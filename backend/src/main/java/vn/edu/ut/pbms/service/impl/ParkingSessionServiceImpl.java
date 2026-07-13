package vn.edu.ut.pbms.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.BookingStatus;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;
import vn.edu.ut.pbms.dto.response.ParkingSessionListResponseDTO;
import vn.edu.ut.pbms.dto.response.ParkingSessionResponseDTO;
import vn.edu.ut.pbms.entity.Booking;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.entity.Vehicle;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.BookingRepository;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.repository.VehicleRepository;
import vn.edu.ut.pbms.service.ParkingSessionService;
import vn.edu.ut.pbms.service.SlotAvailabilityService;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of ParkingSessionService.
 * Xử lý luồng nghiệp vụ xe ra/vào và tra cứu lịch sử bãi xe.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ParkingSessionServiceImpl implements ParkingSessionService {

    private final EntityManager entityManager;
    private final ModelMapper modelMapper;
    private final ParkingSessionRepository parkingSessionRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final BookingRepository bookingRepository;
    private final SlotAvailabilityService slotAvailabilityService;

    /**
     * Tra cứu danh sách lượt gửi xe với bộ lọc động (Dynamic Query) dùng Criteria API.
     */
    @Override
    @Transactional(readOnly = true)
    public ParkingSessionListResponseDTO getParkingSessions(String plate, String status, String fromDate) {

        // ==================== Bước 1: Validate tham số đầu vào ====================

        // Kiểm tra tính hợp lệ của status: phải thuộc đúng Enum (IN_PROGRESS, COMPLETED)
        ParkingSessionStatus parsedStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                parsedStatus = ParkingSessionStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessRuleViolationException(
                        "Trạng thái '" + status + "' không hợp lệ. Chỉ chấp nhận: IN_PROGRESS, COMPLETED.");
            }
        }

        // Ép chuỗi from_date sang LocalDateTime, kiểm tra định dạng hợp lệ
        LocalDateTime parsedFromDate = null;
        if (fromDate != null && !fromDate.trim().isEmpty()) {
            String trimmed = fromDate.trim();
            try {
                parsedFromDate = LocalDateTime.parse(trimmed);
            } catch (DateTimeParseException e1) {
                try {
                    // Fallback 1: chuỗi chỉ có ngày (VD: 2026-07-12)
                    parsedFromDate = java.time.LocalDate.parse(trimmed).atStartOfDay();
                } catch (DateTimeParseException e2) {
                    try {
                        // Fallback 2: chuỗi có múi giờ
                        parsedFromDate = ZonedDateTime.parse(trimmed).toLocalDateTime();
                    } catch (DateTimeParseException e3) {
                        throw new BusinessRuleViolationException(
                                "Định dạng ngày '" + fromDate + "' không hợp lệ. Vui lòng dùng định dạng ISO-8601 (yyyy-MM-ddTHH:mm:ss hoặc yyyy-MM-dd)");
                    }
                }
            }
        }

        // ==================== Bước 2: Xây dựng truy vấn động (Dynamic Query) ====================

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ParkingSession> query = cb.createQuery(ParkingSession.class);
        Root<ParkingSession> root = query.from(ParkingSession.class);

        List<Predicate> predicates = new ArrayList<>();

        // Bộ lọc 1: Biển số xe (plate) - Tìm kiếm chính xác, không phân biệt hoa/thường
        if (plate != null && !plate.trim().isEmpty()) {
            predicates.add(cb.equal(cb.upper(root.get("plate")), plate.trim().toUpperCase()));
        }

        // Bộ lọc 2: Trạng thái (status)
        if (parsedStatus != null) {
            predicates.add(cb.equal(root.get("status"), parsedStatus));
        }

        // Bộ lọc 3: Từ ngày (from_date) - Lọc mốc thời gian vào bãi (time_in >= from_date)
        if (parsedFromDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("timeIn"), parsedFromDate));
        }

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        // Sắp xếp mặc định theo thời gian vào (mới nhất lên trước)
        query.orderBy(cb.desc(root.get("timeIn")));

        // ==================== Bước 3: Truy xuất cơ sở dữ liệu (Database Fetch) ====================

        List<ParkingSession> sessions = entityManager.createQuery(query).getResultList();

        // ==================== Bước 4: Đóng gói và Phản hồi (Flattening & Response) ====================

        List<ParkingSessionResponseDTO> data = sessions.stream()
                .map(session -> modelMapper.map(session, ParkingSessionResponseDTO.class))
                .collect(Collectors.toList());

        return ParkingSessionListResponseDTO.builder()
                .totalItems(data.size())
                .data(data)
                .build();
    }

    /**
     * Xử lý tạo lượt gửi xe mới (Xe vào bãi - Check-in).
     */
    @Override
    public CheckinResponse checkInVehicle(CheckinRequest request) {
        // 1. Tìm các thông tin liên kết nếu có ID truyền lên
        Vehicle vehicle = null;
        if (request.getVehicleId() != null) {
            vehicle = vehicleRepository.findById((long) request.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy phương tiện với ID: " + request.getVehicleId()));
        }

        // Tìm phương tiện theo biển số nếu không truyền vehicle_id (để link xe thành viên)
        if (vehicle == null && request.getPlate() != null && !request.getPlate().trim().isEmpty()) {
            vehicle = vehicleRepository.findByPlate(request.getPlate().trim()).orElse(null);
        }

        ParkingSlot parkingSlot = null;
        if (request.getParkingSlotId() != null) {
            parkingSlot = parkingSlotRepository.findById((long) request.getParkingSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy vị trí đỗ với ID: " + request.getParkingSlotId()));
        }

        // Tìm kiếm và áp dụng thông tin đặt chỗ trước (Booking) nếu có
        Booking matchedBooking = null;
        if (vehicle != null) {
            List<Booking> activeBookings = bookingRepository.findByVehicleIdAndStatus(vehicle.getId(), BookingStatus.CONFIRMED);
            if (activeBookings.isEmpty()) {
                activeBookings = bookingRepository.findByVehicleIdAndStatus(vehicle.getId(), BookingStatus.PENDING);
            }
            if (!activeBookings.isEmpty()) {
                matchedBooking = activeBookings.get(0);
                matchedBooking.setStatus(BookingStatus.CHECKED_IN);
                bookingRepository.save(matchedBooking);

                // Ưu tiên sử dụng slot đỗ đã được đặt trước nếu request không truyền lên
                if (parkingSlot == null) {
                    parkingSlot = matchedBooking.getParkingSlot();
                }
            }
        }

        // 2. Kiểm tra tính khả dụng và cập nhật trạng thái ô đỗ
        if (parkingSlot != null) {
            if (parkingSlot.getStatus() == ParkingSlotStatus.OCCUPIED ||
                parkingSlot.getStatus() == ParkingSlotStatus.MAINTENANCE ||
                parkingSlot.getStatus() == ParkingSlotStatus.LOCKED) {
                throw new BusinessRuleViolationException(
                        "Vị trí đỗ '" + parkingSlot.getSlotName() + "' hiện tại không khả dụng.");
            }

            // Cập nhật trạng thái ô đỗ thành OCCUPIED và phát sự kiện SSE
            slotAvailabilityService.updateSlotStatus(parkingSlot.getId(), ParkingSlotStatus.OCCUPIED);
        }

        // 3. Tạo mã code vé ngẫu nhiên, duy nhất
        String ticketCode = "TK-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();

        // 4. Khởi tạo mốc thời gian vào bãi và trạng thái mặc định
        LocalDateTime timeIn = LocalDateTime.now();
        ParkingSessionStatus status = ParkingSessionStatus.IN_PROGRESS;

        // 5. Build thực thể và thực hiện lưu vào cơ sở dữ liệu
        ParkingSession session = ParkingSession.builder()
                .plate(request.getPlate())
                .ticketCode(ticketCode)
                .timeIn(timeIn)
                .status(status)
                .vehicle(vehicle)
                .user(vehicle != null ? vehicle.getUser() : null)
                .parkingSlot(parkingSlot)
                .booking(matchedBooking)
                .build();

        ParkingSession savedSession = parkingSessionRepository.save(session);

        // 6. Đóng gói dữ liệu trả về cho Front-End
        return CheckinResponse.builder()
                .id(savedSession.getId().intValue())
                .ticketCode(savedSession.getTicketCode())
                .timeIn(savedSession.getTimeIn().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .status(savedSession.getStatus())
                .message("Xe check-in thành công.")
                .build();
    }

    /**
     * Tra cứu danh sách lượt gửi xe của một user cụ thể.
     */
    @Override
    @Transactional(readOnly = true)
    public ParkingSessionListResponseDTO getParkingSessionsByUserId(Long userId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ParkingSession> query = cb.createQuery(ParkingSession.class);
        Root<ParkingSession> root = query.from(ParkingSession.class);

        query.where(cb.equal(root.get("user").get("id"), userId));
        query.orderBy(cb.desc(root.get("timeIn")));

        List<ParkingSession> sessions = entityManager.createQuery(query).getResultList();

        List<ParkingSessionResponseDTO> data = sessions.stream()
                .map(session -> modelMapper.map(session, ParkingSessionResponseDTO.class))
                .collect(Collectors.toList());

        return ParkingSessionListResponseDTO.builder()
                .totalItems(data.size())
                .data(data)
                .build();
    }
}