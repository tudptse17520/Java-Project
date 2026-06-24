package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;

/**
 * Service interface for Building business logic.
 * Defines all operations for managing buildings.
 */
public interface BuildingService {

    /**
     * Create a new building.
     *
     * @param requestDTO the building data from the client
     * @return the created building response with id and message
     */
    BuildingResponseDTO createBuilding(BuildingRequestDTO requestDTO);
}
