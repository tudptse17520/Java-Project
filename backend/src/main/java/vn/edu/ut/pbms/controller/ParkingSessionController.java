package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import vn.edu.ut.pbms.dto.request.CheckinRequest;
import vn.edu.ut.pbms.dto.response.CheckinResponse;
import vn.edu.ut.pbms.dto.response.ParkingSessionListResponseDTO;
import vn.edu.ut.pbms.service.ParkingSessionService;

/**
 * REST Controller for Parking Sessions management.
 * Endpoint base: /api/v1/sessions
 */
@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name = "Parking Session", description = "Các API quản lý lượt gửi xe")
public class ParkingSessionController {

    private final ParkingSessionService parkingSessionService;

    /**
     * API: Lấy danh sách lượt gửi xe (Parking Sessions) với bộ lọc động.
     * Staff dùng để tìm xe lúc ra, Manager dùng để "Theo dõi xe quá giờ"[cite: 139].
     *
     * @param plate    (Tùy chọn) Tìm kiếm chính xác theo biển số [cite: 142]
     * @param status   (Tùy chọn) Trạng thái lượt gửi: IN_PROGRESS (đang trong bãi) / COMPLETED (đã ra) [cite: 142]
     * @param fromDate (Tùy chọn) Lọc thời gian vào bãi từ ngày... [cite: 142]
     * @return HTTP 200 với total_items và mảng data chi tiết [cite: 144]
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ParkingSessionListResponseDTO> getParkingSessions(
            @RequestParam(required = false) String plate,
            @RequestParam(required = false) String status,
            @RequestParam(name = "from_date", required = false) String fromDate) {

        ParkingSessionListResponseDTO response = parkingSessionService.getParkingSessions(plate, status, fromDate);
        return ResponseEntity.ok(response);
    }

    /**
     * API: Thực hiện Check-in cho xe vào bãi[cite: 74, 75].
     *
     * @param request Thông tin chi tiết lượt vào bãi (Biển số, ID xe nếu có,...) [cite: 78]
     * @return HTTP 201 CREATED với thông tin vé điện tử vừa khởi tạo [cite: 80]
     */
    @PostMapping("/check-in")
    public ResponseEntity<CheckinResponse> checkInVehicle(@Valid @RequestBody CheckinRequest request) {
        CheckinResponse response = parkingSessionService.checkInVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}