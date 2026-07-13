package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.request.BuildingStatusRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingBrowseResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingListResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.service.BuildingService;
import vn.edu.ut.pbms.service.SseEmitterManager;

import java.util.List;

/**
 * REST Controller for Building Management.
 * Base endpoint: /api/v1/buildings
 */
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/buildings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'STAFF', 'MANAGER', 'ADMIN')")
@Tag(name = "Building")
public class BuildingController {

    private final BuildingService buildingService;
    private final SseEmitterManager sseEmitterManager;

    @GetMapping("/browse")
    public ResponseEntity<List<BuildingBrowseResponseDTO>> browseBuildings() {
        return ResponseEntity.ok(buildingService.browseBuildings());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<BuildingDetailResponseDTO> getBuildingDetail(@PathVariable Long id) {
        return ResponseEntity.ok(buildingService.getBuildingDetail(id));
    }

    @GetMapping("/{id}/availability-stream")
    @PreAuthorize("permitAll()")
    public SseEmitter subscribeToAvailability(@PathVariable Long id) {
        return sseEmitterManager.subscribe(id);
    }

    @GetMapping("/availability-stream")
    @PreAuthorize("permitAll()")
    public SseEmitter subscribeToGlobalAvailability() {
        return sseEmitterManager.subscribe(null); // Subscribe to global
    }

    // ==================== GET - Tra cứu ====================

    /**
     * Retrieve list of buildings filtered by status.
     *
     * @param status the status of the building
     * @return HTTP 200 with the list of buildings
     */
    @GetMapping
    public ResponseEntity<BuildingListResponseDTO> getBuildings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BuildingStatus status) {
        
        BuildingListResponseDTO response = buildingService.getBuildings(keyword, status);
        return ResponseEntity.ok(response);
    }

    // ==================== POST - Thêm tòa nhà mới ====================

    /**
     * Create a new building.
     *
     * @param requestDTO the building data (validated)
     * @return HTTP 201 with the created building ID and message
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<BuildingResponseDTO> createBuilding(
            @Valid @RequestBody BuildingRequestDTO requestDTO) {
        BuildingResponseDTO createdBuilding = buildingService.createBuilding(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBuilding);
    }

    // ==================== PUT - Cập nhật thông tin ====================

    /**
     * Update an existing building's details.
     *
     * @param id         the building ID from path
     * @param requestDTO the updated building data (validated)
     * @return HTTP 200 with the updated building ID and success message
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<BuildingResponseDTO> updateBuilding(
            @PathVariable Long id,
            @Valid @RequestBody BuildingRequestDTO requestDTO) {
        BuildingResponseDTO updatedBuilding = buildingService.updateBuilding(id, requestDTO);
        return ResponseEntity.ok(updatedBuilding);
    }

    // ==================== PATCH - Cập nhật trạng thái ====================

    /**
     * Update a building's status and cascade status to its floors.
     *
     * @param id         the building ID from path
     * @param requestDTO the status data (validated)
     * @return HTTP 200 with building ID and success message
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<BuildingResponseDTO> updateBuildingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BuildingStatusRequestDTO requestDTO) {
        BuildingResponseDTO updatedBuilding = buildingService.updateBuildingStatus(id, requestDTO);
        return ResponseEntity.ok(updatedBuilding);
    }

    // ==================== DELETE - Xóa tòa nhà ====================

    /**
     * Delete an existing building.
     * * @param id the building ID from path
     * 
     * @return HTTP 200 with building ID and success message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<BuildingResponseDTO> deleteBuilding(@PathVariable Long id) {
        BuildingResponseDTO deletedBuilding = buildingService.deleteBuilding(id);
        return ResponseEntity.ok(deletedBuilding);
    }
}