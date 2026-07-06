package vn.edu.ut.pbms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import vn.edu.ut.pbms.dto.response.BuildingBrowseResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.service.BuildingService;
import vn.edu.ut.pbms.service.SseEmitterManager;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;
    private final SseEmitterManager sseEmitterManager;

    @GetMapping
    public ResponseEntity<List<BuildingBrowseResponseDTO>> browseBuildings() {
        return ResponseEntity.ok(buildingService.browseBuildings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDetailResponseDTO> getBuildingDetail(@PathVariable Long id) {
        return ResponseEntity.ok(buildingService.getBuildingDetail(id));
    }

    @GetMapping("/{id}/availability-stream")
    public SseEmitter subscribeToAvailability(@PathVariable Long id) {
        return sseEmitterManager.subscribe(id);
    }

    @GetMapping("/availability-stream")
    public SseEmitter subscribeToGlobalAvailability() {
        return sseEmitterManager.subscribe(null); // Subscribe to global
    }
}
