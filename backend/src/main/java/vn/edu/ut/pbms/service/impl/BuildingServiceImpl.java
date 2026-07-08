package vn.edu.ut.pbms.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.BuildingStatus;
import vn.edu.ut.pbms.constant.FloorStatus;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.dto.request.BuildingRequestDTO;
import vn.edu.ut.pbms.dto.request.BuildingStatusRequestDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingListResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.entity.Building;
import vn.edu.ut.pbms.entity.Floor;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.BuildingRepository;
import vn.edu.ut.pbms.repository.FloorRepository;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.service.BuildingService;

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
    private final ParkingSlotRepository parkingSlotRepository;
    private final EntityManager entityManager;
    private final ModelMapper modelMapper;

    // ==================== GET - Lấy danh sách (Có lọc & JOIN FETCH) ====================

    @Override
    @Transactional(readOnly = true)
    public BuildingListResponseDTO getBuildings(BuildingStatus status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Building> query = cb.createQuery(Building.class);
        Root<Building> root = query.from(Building.class);

        // Nạp trước danh sách floors để tránh lỗi N+1 Query
        root.fetch("floors", JoinType.LEFT);
        
        // Tránh trùng lặp do LEFT JOIN FETCH
        query.distinct(true);

        if (status != null) {
            Predicate statusPredicate = cb.equal(root.get("status"), status);
            query.where(statusPredicate);
        }

        List<Building> buildings = entityManager.createQuery(query).getResultList();

        List<BuildingDetailResponseDTO> detailList = buildings.stream()
                .map(building -> modelMapper.map(building, BuildingDetailResponseDTO.class))
                .collect(Collectors.toList());

        return BuildingListResponseDTO.builder()
                .message("Lấy danh sách tòa nhà thành công.")
                .data(detailList)
                .build();
    }

    // ==================== POST - Thêm mới ====================

    @Override
    public BuildingResponseDTO createBuilding(BuildingRequestDTO requestDTO) {
        if (buildingRepository.existsByBuildingName(requestDTO.getBuildingName())) {
            throw new ConflictException(
                    "Tòa nhà '" + requestDTO.getBuildingName() + "' đã tồn tại trong hệ thống.");
        }

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
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));

        boolean isDuplicate = buildingRepository.findAll().stream()
                .anyMatch(b -> b.getBuildingName().equalsIgnoreCase(requestDTO.getBuildingName()) && !b.getId().equals(id));
        if (isDuplicate) {
            throw new ConflictException("Tòa nhà '" + requestDTO.getBuildingName() + "' đã tồn tại trong hệ thống.");
        }

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

    // ==================== PATCH - Cập nhật trạng thái + Cascade Floors & Slots ====================

    @Override
    public BuildingResponseDTO updateBuildingStatus(Long id, BuildingStatusRequestDTO requestDTO) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));

        BuildingStatus newStatus = requestDTO.getStatus();
        building.setStatus(newStatus);
        buildingRepository.save(building);

        List<Floor> floors = building.getFloors();
        if (floors != null && !floors.isEmpty()) {
            FloorStatus targetFloorStatus;
            ParkingSlotStatus targetSlotStatus;
            
            switch (newStatus) {
                case MAINTENANCE:
                    targetFloorStatus = FloorStatus.MAINTENANCE;
                    targetSlotStatus = ParkingSlotStatus.MAINTENANCE;
                    break;
                case INACTIVE:
                    targetFloorStatus = FloorStatus.LOCKED;
                    targetSlotStatus = ParkingSlotStatus.LOCKED;
                    break;
                case ACTIVE:
                default:
                    targetFloorStatus = FloorStatus.ACTIVE;
                    targetSlotStatus = ParkingSlotStatus.AVAILABLE;
                    break;
            }

            for (Floor floor : floors) {
                floor.setStatus(targetFloorStatus);
                List<ParkingSlot> slots = floor.getParkingSlots();
                if (slots != null) {
                    for (ParkingSlot slot : slots) {
                        if (newStatus == BuildingStatus.ACTIVE) {
                            // Chỉ kích hoạt lại các slot đang bị khóa hoặc bảo trì
                            if (slot.getStatus() == ParkingSlotStatus.LOCKED || slot.getStatus() == ParkingSlotStatus.MAINTENANCE) {
                                slot.setStatus(ParkingSlotStatus.AVAILABLE);
                            }
                        } else {
                            slot.setStatus(targetSlotStatus);
                        }
                    }
                    parkingSlotRepository.saveAll(slots);
                }
            }
            floorRepository.saveAll(floors);
        }

        return BuildingResponseDTO.builder()
                .id(building.getId())
                .message("Cập nhật trạng thái tòa nhà thành công.")
                .build();
    }

    // ==================== DELETE - Xóa tòa nhà ====================

    @Override
    public BuildingResponseDTO deleteBuilding(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));

        // Kiểm tra xem có phiên đỗ xe nào đang hoạt động (IN_PROGRESS) trong tòa nhà này không
        String jpql = "SELECT COUNT(ps) FROM ParkingSession ps " +
                      "WHERE ps.parkingSlot.floor.building.id = :buildingId " +
                      "AND ps.status = :status";
        
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("buildingId", id)
                .setParameter("status", ParkingSessionStatus.IN_PROGRESS)
                .getSingleResult();

        if (count > 0) {
            throw new ConflictException("Không thể xóa tòa nhà vì đang có phiên đỗ xe hoạt động bên trong.");
        }

        buildingRepository.delete(building);

        return BuildingResponseDTO.builder()
                .id(id)
                .message("Xóa tòa nhà thành công.")
                .build();
    }
}
