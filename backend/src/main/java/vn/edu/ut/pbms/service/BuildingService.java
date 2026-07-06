package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.response.BuildingBrowseResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;

import java.util.List;

public interface BuildingService {
    
    /**
     * Browse all buildings with their current available slots.
     * Uses a single query with subquery for availability count.
     * No pagination is applied as per requirement.
     * 
     * @return List of BuildingBrowseResponseDTO
     */
    List<BuildingBrowseResponseDTO> browseBuildings();

    /**
     * Get detailed information for a specific building, including its floors and available slots.
     * 
     * @param id Building ID
     * @return BuildingDetailResponseDTO
     */
    BuildingDetailResponseDTO getBuildingDetail(Long id);
}
