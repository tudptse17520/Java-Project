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
import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;
import vn.edu.ut.pbms.dto.response.ParkingSessionListResponseDTO;
import vn.edu.ut.pbms.dto.response.ParkingSessionResponseDTO;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.entity.Vehicle;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.repository.VehicleRepository;
import vn.edu.ut.pbms.service.ParkingSessionService;

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
                    // Fallback: chuỗi có múi giờ → chuyển đổi sang LocalDateTime (bỏ offset)
                    parsedFromDate = ZonedDateTime.parse(trimmed).toLocalDateTime();
                } catch (DateTimeParseException e2) {
                    throw new BusinessRuleViolationException(
                            "Định dạng ngày '" + fromDate + "' không hợp lệ. Vui lòng dùng định dạng: yyyy-MM-ddTHH:mm:ss");
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

        ParkingSlot parkingSlot = null;
        if (request.getParkingSlotId() != null) {
            parkingSlot = parkingSlotRepository.findById((long) request.getParkingSlotId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy vị trí đỗ với ID: " + request.getParkingSlotId()));
        }

        // 2. Tạo mã code vé ngẫu nhiên, duy nhất
        String ticketCode = "TK-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();

        // 3. Khởi tạo mốc thời gian vào bãi và trạng thái mặc định
        LocalDateTime timeIn = LocalDateTime.now();
        ParkingSessionStatus status = ParkingSessionStatus.IN_PROGRESS;

        // 4. Build thực thể và thực hiện lưu vào cơ sở dữ liệu
        ParkingSession session = ParkingSession.builder()
                .plate(request.getPlate())
                .ticketCode(ticketCode)
                .timeIn(timeIn)
                .status(status)
                .vehicle(vehicle)
                .parkingSlot(parkingSlot)
                .build();

        ParkingSession savedSession = parkingSessionRepository.save(session);

        // 5. Đóng gói dữ liệu trả về cho Front-End
        return CheckinResponse.builder()
                .id(savedSession.getId().intValue())
                .ticketCode(savedSession.getTicketCode())
                .timeIn(savedSession.getTimeIn().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .status(savedSession.getStatus().name())
                .message("Xe check-in thành công.")
                .build();
    }
}