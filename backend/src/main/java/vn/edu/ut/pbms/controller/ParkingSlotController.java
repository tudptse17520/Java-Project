package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.dto.request.SlotUpdateRequest;
import vn.edu.ut.pbms.dto.response.ParkingSlotResponse;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.service.ParkingSlotService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/slots")
@RequiredArgsConstructor
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    @GetMapping
    public ResponseEntity<List<ParkingSlotResponse>> getSlots(
            @RequestParam(required = false) Long floor_id,
            @RequestParam(required = false) ParkingSlotStatus status) {
        
        List<ParkingSlot> slots = parkingSlotService.findSlots(floor_id, status);
        
        List<ParkingSlotResponse> response = slots.stream().map(s -> ParkingSlotResponse.builder()
                .id(s.getId())
                // Lấy ID từ đối tượng Floor đã được map (xử lý null an toàn)
                .floorId(s.getFloor() != null ? s.getFloor().getId() : null)
                .slotName(s.getSlotName())
                .status(s.getStatus() != null ? s.getStatus().name() : "UNKNOWN")
                .build()).toList();
                
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ParkingSlotResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody SlotUpdateRequest request) {
        
        ParkingSlotStatus newStatus = ParkingSlotStatus.valueOf(request.getStatus().toUpperCase());
        ParkingSlot updated = parkingSlotService.updateStatus(id, newStatus);
        
        return ResponseEntity.ok(ParkingSlotResponse.builder()
                .id(updated.getId())
                .floorId(updated.getFloor() != null ? updated.getFloor().getId() : null)
                .slotName(updated.getSlotName())
                .status(updated.getStatus().name())
                .build());
    }
}