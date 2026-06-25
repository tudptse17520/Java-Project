package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.request.BuildingStatusRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.service.BuildingService;

/**
 * REST Controller for Building Management.
 * Base endpoint: /api/building (follows the singular route request)
 *
 * Endpoints:
 * - GET    /api/building              → Retrieve paginated, filtered buildings
 * - POST   /api/building              → Create a new building
 * - PUT    /api/building/{id}         → Update building details
 * - PATCH  /api/building/{id}/status  → Update building status and cascade to floors
 */
@RestController
@RequestMapping("/api/building")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    // ==================== GET - Phân trang & Lọc ====================

    /**
     * Retrieve list of buildings with filters and pagination.
     *
     * @param keyword the search term for building name
     * @param status  the status of the building
     * @param page    the page number (0-indexed, default: 0)
     * @param size    the page size (default: 10)
     * @return HTTP 200 with the paginated page of buildings
     */
    @GetMapping
    public ResponseEntity<Page<BuildingDetailResponseDTO>> getBuildings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BuildingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<BuildingDetailResponseDTO> buildings = buildingService.getBuildings(keyword, status, pageable);
        return ResponseEntity.ok(buildings);
    }

    // ==================== POST - Thêm tòa nhà mới ====================

    /**
     * Create a new building.
     * - Validation: @Valid catches validation errors → 400 Bad Request
     * - Conflict: Service checks and throws ConflictException → 409 Conflict
     *
     * @param requestDTO the building data (validated)
     * @return HTTP 201 with the created building ID and message
     */
    @PostMapping
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
    public ResponseEntity<BuildingResponseDTO> updateBuildingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BuildingStatusRequestDTO requestDTO) {
        BuildingResponseDTO updatedBuilding = buildingService.updateBuildingStatus(id, requestDTO);
        return ResponseEntity.ok(updatedBuilding);
    }
}
