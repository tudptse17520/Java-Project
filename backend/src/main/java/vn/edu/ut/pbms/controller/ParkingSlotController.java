package vn.edu.ut.pbms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.service.ParkingSlotService;

@RestController
@RequestMapping("/api/v1/parking-slots")
@RequiredArgsConstructor 
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    // API: Lấy danh sách tất cả ô đỗ xe
    // Đường dẫn: GET http://localhost:8080/api/v1/parking-slots
    @GetMapping
    public ResponseEntity<List<ParkingSlot>> getAllParkingSlots() {
        return ResponseEntity.ok(parkingSlotService.getAllParkingSlots());
    }

    // API: Lấy chi tiết một ô đỗ xe theo ID
    // Đường dẫn: GET http://localhost:8080/api/v1/parking-slots/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getParkingSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingSlotService.getParkingSlotById(id));
    }

    // API: Lấy danh sách ô đỗ xe của một tầng cụ thể
    // Đường dẫn: GET http://localhost:8080/api/v1/parking-slots/floor/{floorId}
    @GetMapping("/floor/{floorId}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByFloor(@PathVariable Long floorId) {
        return ResponseEntity.ok(parkingSlotService.getSlotsByFloor(floorId));
    }

    // API: Thay đổi trạng thái ô đỗ xe (Ví dụ: Khóa ô đỗ, bảo trì...)
    // Đường dẫn: PUT http://localhost:8080/api/v1/parking-slots/{id}/status?status=LOCKED
    @PutMapping("/{id}/status")
    public ResponseEntity<ParkingSlot> updateSlotStatus(
            @PathVariable Long id,
            @RequestParam ParkingSlotStatus status) {
        return ResponseEntity.ok(parkingSlotService.updateSlotStatus(id, status));
    }
}