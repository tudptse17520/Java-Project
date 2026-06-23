package vn.edu.ut.pbms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping; 
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.service.ParkingSlotService;

@RestController
@RequestMapping("/api/v1/slots")
@RequiredArgsConstructor 
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    // API: Xem danh sách và tìm kiếm vị trí đỗ xe / slot trống
    // Đường dẫn chuẩn: GET http://localhost:8080/api/v1/slots?floor_id=1&status=AVAILABLE
    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getSlots(
            @RequestParam(value = "floor_id", required = false) Long floorId,
            @RequestParam(value = "status", required = false) ParkingSlotStatus status) {
        
        // Nếu client truyền lên floor_id thì lọc theo tầng 
        if (floorId != null) {
            return ResponseEntity.ok(parkingSlotService.getSlotsByFloor(floorId));
        }
        
        // Mặc định nếu không truyền tham số lọc thì trả về tất cả
        return ResponseEntity.ok(parkingSlotService.getAllParkingSlots());
    }

    // API: Lấy chi tiết một ô đỗ xe theo ID (Giữ lại dùng nội bộ)
    // Đường dẫn: GET http://localhost:8080/api/v1/slots/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getParkingSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingSlotService.getParkingSlotById(id));
    }

    // API: Cập nhật trạng thái vị trí đỗ xe
    // Đường dẫn chuẩn: PATCH http://localhost:8080/api/v1/slots/{id}/status 
    @PatchMapping("/{id}/status")
    public ResponseEntity<ParkingSlot> updateSlotStatus(
            @PathVariable Long id,
            @RequestParam ParkingSlotStatus status) {
        return ResponseEntity.ok(parkingSlotService.updateSlotStatus(id, status));
    }
}