package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.VehicleTypeRequestDTO;
import vn.edu.ut.pbms.dto.response.VehicleTypeResponseDTO;

import java.util.List;

/**
 * Service interface for VehicleType business logic.
 * Defines all operations for managing vehicle types.
 */
public interface VehicleTypeService {

    /**
     * Retrieve all vehicle types.
     *
     * @return list of all vehicle types as response DTOs
     */
    List<VehicleTypeResponseDTO> getAllVehicleTypes();

    /**
     * Create a new vehicle type.
     *
     * @param requestDTO the vehicle type data from the client
     * @return the created vehicle type as a response DTO
     */
    VehicleTypeResponseDTO createVehicleType(VehicleTypeRequestDTO requestDTO);

    /**
     * Update an existing vehicle type.
     *
     * @param id         the ID of the vehicle type to update
     * @param requestDTO the updated vehicle type data
     * @return the updated vehicle type as a response DTO
     */
    VehicleTypeResponseDTO updateVehicleType(Long id, VehicleTypeRequestDTO requestDTO);

    /**
     * Deactivate a vehicle type by setting its status to INACTIVE.
     *
     * @param id the ID of the vehicle type to deactivate
     * @return the deactivated vehicle type as a response DTO
     */
    VehicleTypeResponseDTO deactivateVehicleType(Long id);
}
