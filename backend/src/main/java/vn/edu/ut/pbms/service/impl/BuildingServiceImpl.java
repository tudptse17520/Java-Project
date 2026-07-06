package vn.edu.ut.pbms.service.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.dto.response.BuildingBrowseResponseDTO;
import vn.edu.ut.pbms.dto.response.BuildingDetailResponseDTO;
import vn.edu.ut.pbms.dto.response.FloorResponseDTO;
import vn.edu.ut.pbms.entity.Building;
import vn.edu.ut.pbms.entity.Floor;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.service.BuildingService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuildingServiceImpl implements BuildingService {

    private final EntityManager entityManager;
    private final ModelMapper modelMapper;

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
                // To do this, we get the original Floor entity
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
}
