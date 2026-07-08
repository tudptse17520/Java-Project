package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.request.BuildingStatusRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingListResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;

/**
 * Service interface for Building business logic.
 * Defines all operations for managing buildings.
 */
public interface BuildingService {

    /**
     * Retrieve a list of buildings filtered by status.
     *
     * @param status  the status to filter by (optional)
     * @return a response containing a message and list of building details
     */
    BuildingListResponseDTO getBuildings(BuildingStatus status);

    /**
     * Create a new building.
     *
     * @param requestDTO the building data from the client
     * @return the created building response with id and message
     */
    BuildingResponseDTO createBuilding(BuildingRequestDTO requestDTO);

    /**
     * Update an existing building.
     *
     * @param id         the ID of the building to update
     * @param requestDTO the updated building data
     * @return the response containing updated ID and message
     */
    BuildingResponseDTO updateBuilding(Long id, BuildingRequestDTO requestDTO);

    /**
     * Update the status of a building and optionally cascade updates to floors.
     *
     * @param id         the ID of the building
     * @param requestDTO the new status wrapped in a DTO
     * @return the response containing building ID and message
     */
    BuildingResponseDTO updateBuildingStatus(Long id, BuildingStatusRequestDTO requestDTO);

    /**
     * Delete an existing building.
     * Checks if there are any active parking sessions before deletion.
     *
     * @param id the ID of the building to delete
     * @return the response containing deleted building ID and message
     */
    BuildingResponseDTO deleteBuilding(Long id);
}
