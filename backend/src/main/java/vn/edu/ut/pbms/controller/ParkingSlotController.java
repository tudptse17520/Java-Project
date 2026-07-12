package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.dto.request.ParkingSlotRequest;
import vn.edu.ut.pbms.dto.request.SlotUpdateRequest;
import vn.edu.ut.pbms.dto.response.ParkingSlotCreateResponse;
import vn.edu.ut.pbms.dto.response.ParkingSlotListResponse;
import vn.edu.ut.pbms.dto.response.ParkingSlotResponse;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.service.ParkingSlotService;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/slots")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'STAFF', 'MANAGER', 'ADMIN')")
@Tag(name = "Parking Slot")
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    @GetMapping
    public ResponseEntity<ParkingSlotListResponse> getSlots(
            @RequestParam(required = false) Long floorId,
            @RequestParam(required = false) ParkingSlotStatus status) {
        
        List<ParkingSlot> slots = parkingSlotService.findSlots(floorId, status);
        
        List<ParkingSlotResponse> data = slots.stream().map(s -> ParkingSlotResponse.builder()
                .id(s.getId())
                // Lấy ID từ đối tượng Floor đã được map (xử lý null an toàn)
                .floorId(s.getFloor() != null ? s.getFloor().getId() : null)
                .slotName(s.getSlotName())
                .status(s.getStatus())
                .build()).toList();
                
        long totalAvailable = slots.stream().filter(s -> s.getStatus() == ParkingSlotStatus.AVAILABLE).count();
                
        return ResponseEntity.ok(ParkingSlotListResponse.builder()
                .totalAvailable(totalAvailable)
                .data(data)
                .build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ParkingSlotResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody SlotUpdateRequest request) {
        
        ParkingSlotStatus newStatus = request.getStatus();
        ParkingSlot updated = parkingSlotService.updateStatus(id, newStatus);
        
        return ResponseEntity.ok(ParkingSlotResponse.builder()
                .id(updated.getId())
                .floorId(updated.getFloor() != null ? updated.getFloor().getId() : null)
                .slotName(updated.getSlotName())
                .status(updated.getStatus())
                .build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ParkingSlotCreateResponse> createSlot(
            @Valid @RequestBody ParkingSlotRequest request) {
        ParkingSlotCreateResponse response = parkingSlotService.createSlot(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}