package vn.edu.ut.pbms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.ut.pbms.dto.response.ParkingSessionListResponseDTO;
import vn.edu.ut.pbms.service.ParkingSessionService;

/**
 * REST Controller for Parking Sessions.
 * Endpoint: GET /api/v1/sessions
 *
 * Staff dùng để tìm xe lúc ra, Manager dùng để "Theo dõi xe quá giờ".
 */
@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class ParkingSessionController {

    private final ParkingSessionService parkingSessionService;

    /**
     * Lấy danh sách lượt gửi xe (Parking Sessions) với bộ lọc động.
     *
     * @param plate    (Tùy chọn) Tìm kiếm chính xác theo biển số
     * @param status   (Tùy chọn) Trạng thái lượt gửi: IN_PROGRESS (đang trong bãi) / COMPLETED (đã ra)
     * @param fromDate (Tùy chọn) Lọc thời gian vào bãi từ ngày...
     * @return HTTP 200 với total_items và mảng data
     */
    @GetMapping
    public ResponseEntity<ParkingSessionListResponseDTO> getParkingSessions(
            @RequestParam(required = false) String plate,
            @RequestParam(required = false) String status,
            @RequestParam(name = "from_date", required = false) String fromDate) {

        ParkingSessionListResponseDTO response = parkingSessionService.getParkingSessions(plate, status, fromDate);
        return ResponseEntity.ok(response);
    }
}
