package vn.edu.ut.pbms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.request.BuildingStatusRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;

/**
 * Service interface for Building business logic.
 * Defines all operations for managing buildings.
 */
public interface BuildingService {

    /**
     * Retrieve a paginated list of buildings filtered by name (keyword) and status.
     *
     * @param keyword the search term for building name (optional)
     * @param status  the status to filter by (optional)
     * @param pageable pagination configuration
     * @return a page of building details including floors
     */
    Page<BuildingDetailResponseDTO> getBuildings(String keyword, BuildingStatus status, Pageable pageable);

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
}
