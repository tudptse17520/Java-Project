package vn.edu.ut.pbms.vehicle_type;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Vehicle Type Management.
 * Base endpoint: /api/v1/vehicle-type
 *
 * Endpoints:
 * - GET    /api/v1/vehicle-type              → Lấy danh sách (200)
 * - POST   /api/v1/vehicle-type              → Thêm mới (201)
 * - PUT    /api/v1/vehicle-type/{id}          → Cập nhật (200)
 * - PATCH  /api/v1/vehicle-type/{id}/deactivate → Ngừng áp dụng (200)
 */
@RestController
@RequestMapping("/api/v1/vehicle-type")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    // ==================== GET - Lấy danh sách ====================

    /**
     * Retrieve all vehicle types.
     *
     * @return HTTP 200 with list of vehicle types
     */
    @GetMapping
    public ResponseEntity<List<VehicleTypeResponseDTO>> getAllVehicleTypes() {
        List<VehicleTypeResponseDTO> vehicleTypes = vehicleTypeService.getAllVehicleTypes();
        return ResponseEntity.ok(vehicleTypes);
    }

    // ==================== POST - Thêm mới ====================

    /**
     * Create a new vehicle type.
     * - E1 (empty name): Automatically caught by @Valid + @NotBlank → 400
     * - E2 (duplicate name): Caught by Service → 409
     *
     * @param requestDTO the vehicle type data (validated)
     * @return HTTP 201 with the created vehicle type
     */
    @PostMapping
    public ResponseEntity<VehicleTypeResponseDTO> createVehicleType(
            @Valid @RequestBody VehicleTypeRequestDTO requestDTO) {
        VehicleTypeResponseDTO createdVehicleType = vehicleTypeService.createVehicleType(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicleType);
    }

    // ==================== PUT - Cập nhật ====================

    /**
     * Update an existing vehicle type.
     * - E1 (empty name): Automatically caught by @Valid + @NotBlank → 400
     * - E2 (duplicate name): Caught by Service → 409
     *
     * @param id         the ID of the vehicle type to update (path variable)
     * @param requestDTO the updated vehicle type data (validated)
     * @return HTTP 200 with the updated vehicle type
     */
    @PutMapping("/{id}")
    public ResponseEntity<VehicleTypeResponseDTO> updateVehicleType(
            @PathVariable Long id,
            @Valid @RequestBody VehicleTypeRequestDTO requestDTO) {
        VehicleTypeResponseDTO updatedVehicleType = vehicleTypeService.updateVehicleType(id, requestDTO);
        return ResponseEntity.ok(updatedVehicleType);
    }

    // ==================== PATCH - Ngừng áp dụng ====================

    /**
     * Deactivate a vehicle type (set status to INACTIVE).
     * - E3 (active references): Caught by Service → 400
     *
     * @param id the ID of the vehicle type to deactivate (path variable)
     * @return HTTP 200 with the deactivated vehicle type
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<VehicleTypeResponseDTO> deactivateVehicleType(@PathVariable Long id) {
        VehicleTypeResponseDTO deactivatedVehicleType = vehicleTypeService.deactivateVehicleType(id);
        return ResponseEntity.ok(deactivatedVehicleType);
    }
}
