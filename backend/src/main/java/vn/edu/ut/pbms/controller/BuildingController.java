package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.service.BuildingService;

/**
 * REST Controller for Building Management.
 * Base endpoint: /api/v1/buildings
 *
 * Endpoints:
 * - POST   /api/v1/buildings              → Thêm tòa nhà mới (201)
 */
@RestController
@RequestMapping("/api/v1/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    // ==================== POST - Thêm tòa nhà mới ====================

    /**
     * Create a new building.
     * - Validation: @Valid catches empty/invalid fields → 400
     * - Duplicate name: Caught by Service → 409
     *
     * @param requestDTO the building data (validated)
     * @return HTTP 201 with the created building id and message
     */
    @PostMapping
    public ResponseEntity<BuildingResponseDTO> createBuilding(
            @Valid @RequestBody BuildingRequestDTO requestDTO) {
        BuildingResponseDTO createdBuilding = buildingService.createBuilding(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBuilding);
    }
}
