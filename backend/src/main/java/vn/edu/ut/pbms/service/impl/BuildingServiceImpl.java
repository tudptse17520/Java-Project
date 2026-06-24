package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.entity.Building;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.repository.BuildingRepository;
import vn.edu.ut.pbms.service.BuildingService;

/**
 * Implementation of BuildingService.
 * Handles create building operation with duplicate name validation.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;

    // ==================== POST - Thêm mới ====================

    @Override
    public BuildingResponseDTO createBuilding(BuildingRequestDTO requestDTO) {
        // Check duplicate building name
        if (buildingRepository.existsByBuildingName(requestDTO.getBuildingName())) {
            throw new ConflictException(
                    "Tòa nhà '" + requestDTO.getBuildingName() + "' đã tồn tại trong hệ thống.");
        }

        // Build entity
        Building building = Building.builder()
                .buildingName(requestDTO.getBuildingName())
                .address(requestDTO.getAddress())
                .numberOfFloors(requestDTO.getNumberOfFloors())
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : BuildingStatus.ACTIVE)
                .build();

        Building savedBuilding = buildingRepository.save(building);

        return BuildingResponseDTO.builder()
                .id(savedBuilding.getId())
                .message("Thêm tòa nhà thành công.")
                .build();
    }
}
