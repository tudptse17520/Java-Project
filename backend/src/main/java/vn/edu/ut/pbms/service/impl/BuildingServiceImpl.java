package vn.edu.ut.pbms.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.*;
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
import vn.edu.ut.pbms.dto.response.BuildingBrowseResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingListResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingResponseDTO;
import vn.edu.ut.pbms.dto.response.FloorResponseDTO;
import vn.edu.ut.pbms.entity.Building;
import vn.edu.ut.pbms.entity.Floor;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.BuildingRepository;
import vn.edu.ut.pbms.repository.FloorRepository;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.service.BuildingService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of BuildingService.
 * Handles all core business rules and real-time analytical queries.
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

    // ==================== FEATURE: BROWSE REAL-TIME AVAILABILITY ====================

    @Override
    @Transactional(readOnly = true)
    public List<BuildingBrowseResponseDTO> browseBuildings() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<Building> root = cq.from(Building.class);

        // Subquery for available slots count
        Subquery<Long> sq = cq.subquery(Long.class);
        Root<ParkingSlot> subRoot = sq.from(ParkingSlot.class);
        Join<ParkingSlot, Floor> floorJoin = subRoot.join("floor");
        
        sq.select(cb.count(subRoot));
        sq.where(cb.and(
                cb.equal(floorJoin.get("building"), root),
                cb.equal(subRoot.get("status"), ParkingSlotStatus.AVAILABLE)
        ));

        cq.multiselect(root, sq.getSelection());

        List<Tuple> results = entityManager.createQuery(cq).getResultList();

        return results.stream().map(tuple -> {
            Building building = tuple.get(0, Building.class);
            Long availableSlots = tuple.get(1, Long.class);

            BuildingBrowseResponseDTO dto = modelMapper.map(building, BuildingBrowseResponseDTO.class);
            dto.setAvailableSlots(availableSlots != null ? availableSlots : 0L);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BuildingDetailResponseDTO getBuildingDetail(Long id) {
        // Query 1: Fetch building and floors eagerly
        String hql = "SELECT b FROM Building b LEFT JOIN FETCH b.floors f LEFT JOIN FETCH f.vehicleType WHERE b.id = :id";
        List<Building> buildings = entityManager.createQuery(hql, Building.class)
                .setParameter("id", id)
                .getResultList();

        if (buildings.isEmpty()) {
            throw new BusinessRuleViolationException("Building not found with id: " + id);
        }
        
        Building building = buildings.get(0);

        // Query 2: Fetch available slot counts grouped by floor id for this building
        String countHql = "SELECT p.floor.id, COUNT(p) FROM ParkingSlot p WHERE p.floor.building.id = :id AND p.status = 'AVAILABLE' GROUP BY p.floor.id";
        List<Object[]> countResults = entityManager.createQuery(countHql, Object[].class)
                .setParameter("id", id)
                .getResultList();

        Map<Long, Long> floorAvailabilityMap = countResults.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

        // Mapping
        BuildingDetailResponseDTO responseDTO = modelMapper.map(building, BuildingDetailResponseDTO.class);
        
        long totalAvailable = 0;
        if (responseDTO.getFloors() != null) {
            for (FloorResponseDTO floorDTO : responseDTO.getFloors()) {
                Long available = floorAvailabilityMap.getOrDefault(floorDTO.getId(), 0L);
                floorDTO.setAvailableSlots(available);
                totalAvailable += available;
                
                // Map vehicleTypeName if available
                building.getFloors().stream()
                        .filter(f -> f.getId().equals(floorDTO.getId()))
                        .findFirst()
                        .ifPresent(f -> {
                            if (f.getVehicleType() != null) {
                                floorDTO.setVehicleTypeName(f.getVehicleType().getTypeName());
                            }
                        });
            }
        }
        
        responseDTO.setTotalAvailableSlots(totalAvailable);

        return responseDTO;
    }

    // ==================== GET - Lấy danh sách (Có lọc & JOIN FETCH) ====================

    @Override
    @Transactional(readOnly = true)
    public BuildingListResponseDTO getBuildings(String keyword, BuildingStatus status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Building> query = cb.createQuery(Building.class);
        Root<Building> root = query.from(Building.class);

        // Nạp trước danh sách floors để tránh lỗi N+1 Query
        root.fetch("floors", JoinType.LEFT);
        
        // Tránh trùng lặp do LEFT JOIN FETCH
        query.distinct(true);

        Predicate predicate = cb.conjunction();

        if (keyword != null && !keyword.trim().isEmpty()) {
            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            Predicate namePredicate = cb.like(cb.lower(root.get("buildingName")), pattern);
            Predicate addressPredicate = cb.like(cb.lower(root.get("address")), pattern);
            predicate = cb.and(predicate, cb.or(namePredicate, addressPredicate));
        }

        if (status != null) {
            predicate = cb.and(predicate, cb.equal(root.get("status"), status));
        }

        query.where(predicate);

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

        boolean isDuplicate = buildingRepository.existsByBuildingNameAndIdNot(requestDTO.getBuildingName(), id);
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