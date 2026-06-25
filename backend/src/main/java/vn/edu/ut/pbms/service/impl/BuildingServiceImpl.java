package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.constant.FloorStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.request.BuildingStatusRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.dto.response.FloorResponseDTO;
import vn.edu.ut.pbms.entity.Building;
import vn.edu.ut.pbms.entity.Floor;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.BuildingRepository;
import vn.edu.ut.pbms.repository.FloorRepository;
import vn.edu.ut.pbms.service.BuildingService;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of BuildingService.
 * Handles all core business rules without modifying the locked BuildingRepository.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;

    // ==================== GET - Lấy danh sách (Có lọc & Phân trang) ====================

    @Override
    @Transactional(readOnly = true)
    public Page<BuildingDetailResponseDTO> getBuildings(String keyword, BuildingStatus status, Pageable pageable) {
        // Fetch all from repository and filter in memory to strictly follow the "locked repository" constraint
        List<Building> buildings = buildingRepository.findAll();

        // Apply filters
        List<BuildingDetailResponseDTO> filtered = buildings.stream()
                .filter(b -> {
                    if (keyword == null || keyword.trim().isEmpty()) {
                        return true;
                    }
                    return b.getBuildingName().toLowerCase().contains(keyword.trim().toLowerCase());
                })
                .filter(b -> {
                    if (status == null) {
                        return true;
                    }
                    return b.getStatus() == status;
                })
                .map(this::mapToDetailResponseDTO)
                .collect(Collectors.toList());

        // Perform pagination manually
        int total = filtered.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);

        List<BuildingDetailResponseDTO> pageContent;
        if (start > total) {
            pageContent = Collections.emptyList();
        } else {
            pageContent = filtered.subList(start, end);
        }

        return new PageImpl<>(pageContent, pageable, total);
    }

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

    // ==================== PUT - Cập nhật ====================

    @Override
    public BuildingResponseDTO updateBuilding(Long id, BuildingRequestDTO requestDTO) {
        // Find existing or throw 404
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));

        // Check duplicate building name excluding this building's own ID
        boolean isDuplicate = buildingRepository.findAll().stream()
                .anyMatch(b -> b.getBuildingName().equalsIgnoreCase(requestDTO.getBuildingName()) && !b.getId().equals(id));
        if (isDuplicate) {
            throw new ConflictException("Tòa nhà '" + requestDTO.getBuildingName() + "' đã tồn tại trong hệ thống.");
        }

        // Update fields
        building.setBuildingName(requestDTO.getBuildingName());
        building.setAddress(requestDTO.getAddress());
        building.setNumberOfFloors(requestDTO.getNumberOfFloors());
        if (requestDTO.getStatus() != null) {
            building.setStatus(requestDTO.getStatus());
        }

        buildingRepository.save(building);

        return BuildingResponseDTO.builder()
                .id(building.getId())
                .message("Cập nhật tòa nhà thành công.")
                .build();
    }

    // ==================== PATCH - Cập nhật trạng thái + Cascade Floors ====================

    @Override
    public BuildingResponseDTO updateBuildingStatus(Long id, BuildingStatusRequestDTO requestDTO) {
        // Find existing or throw 404
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));

        BuildingStatus newStatus = requestDTO.getStatus();
        building.setStatus(newStatus);
        buildingRepository.save(building);

        // Cascade status to all related floors
        List<Floor> floors = building.getFloors();
        if (floors != null && !floors.isEmpty()) {
            FloorStatus targetFloorStatus;
            switch (newStatus) {
                case MAINTENANCE:
                    targetFloorStatus = FloorStatus.MAINTENANCE;
                    break;
                case INACTIVE:
                    targetFloorStatus = FloorStatus.LOCKED;
                    break;
                case ACTIVE:
                default:
                    targetFloorStatus = FloorStatus.ACTIVE;
                    break;
            }

            for (Floor floor : floors) {
                floor.setStatus(targetFloorStatus);
            }
            floorRepository.saveAll(floors);
        }

        return BuildingResponseDTO.builder()
                .id(building.getId())
                .message("Cập nhật trạng thái tòa nhà thành công.")
                .build();
    }

    // ==================== Helper Mappers ====================

    private BuildingDetailResponseDTO mapToDetailResponseDTO(Building building) {
        List<FloorResponseDTO> floorDTOs = null;
        if (building.getFloors() != null) {
            floorDTOs = building.getFloors().stream()
                    .map(f -> FloorResponseDTO.builder()
                            .id(f.getId())
                            .floorName(f.getFloorName())
                            .floorLevel(f.getFloorLevel())
                            .capacity(f.getCapacity())
                            .status(f.getStatus())
                            .build())
                    .collect(Collectors.toList());
        }

        return BuildingDetailResponseDTO.builder()
                .id(building.getId())
                .buildingName(building.getBuildingName())
                .address(building.getAddress())
                .numberOfFloors(building.getNumberOfFloors())
                .status(building.getStatus())
                .floors(floorDTOs)
                .build();
    }
}
