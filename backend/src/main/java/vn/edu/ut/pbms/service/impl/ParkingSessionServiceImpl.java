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
import vn.edu.ut.pbms.dto.response.ParkingSessionListResponseDTO;
import vn.edu.ut.pbms.dto.response.ParkingSessionResponseDTO;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.service.ParkingSessionService;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingSessionServiceImpl implements ParkingSessionService {

    private final EntityManager entityManager;
    private final ModelMapper modelMapper;

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
        // Hỗ trợ cả chuỗi thuần (yyyy-MM-ddTHH:mm:ss) và chuỗi có múi giờ (yyyy-MM-ddTHH:mm:ssZ / +07:00)
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
        // Ép cả 2 vế về chữ hoa để đảm bảo an toàn bất kể Collation của DB (SQL Server, PostgreSQL...)
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

        // Dùng ModelMapper ánh xạ các trường cơ bản (id, plate, timeIn, timeOut, totalFee) sang DTO.
        List<ParkingSessionResponseDTO> data = sessions.stream()
                .map(session -> modelMapper.map(session, ParkingSessionResponseDTO.class))
                .collect(Collectors.toList());

        // Tính toán total_items và nạp danh sách vào mảng data
        return ParkingSessionListResponseDTO.builder()
                .totalItems(data.size())
                .data(data)
                .build();
    }
}
