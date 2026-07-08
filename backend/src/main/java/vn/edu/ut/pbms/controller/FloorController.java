package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.dto.request.FloorRequestDTO;
import vn.edu.ut.pbms.dto.response.FloorResponseDTO;
import vn.edu.ut.pbms.service.FloorService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/floors")
@RequiredArgsConstructor
public class FloorController {

    private final FloorService floorService;

    @PostMapping
    public ResponseEntity<FloorResponseDTO> createFloor(@Valid @RequestBody FloorRequestDTO requestDTO) {
        return new ResponseEntity<>(floorService.createFloor(requestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FloorResponseDTO> updateFloor(@PathVariable Long id,
            @Valid @RequestBody FloorRequestDTO requestDTO) {
        return ResponseEntity.ok(floorService.updateFloor(id, requestDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FloorResponseDTO> getFloorById(@PathVariable Long id) {
        return ResponseEntity.ok(floorService.getFloorById(id));
    }

    @GetMapping
    public ResponseEntity<List<FloorResponseDTO>> getAllFloors() {
        return ResponseEntity.ok(floorService.getAllFloors());
    }

    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<FloorResponseDTO>> getFloorsByBuildingId(@PathVariable Long buildingId) {
        return ResponseEntity.ok(floorService.getFloorsByBuildingId(buildingId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFloor(@PathVariable Long id) {
        floorService.deleteFloor(id);
        return ResponseEntity.noContent().build();
    }
}