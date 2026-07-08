package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Building;

/**
 * Repository interface for Building entity.
 * Provides basic CRUD operations and custom query methods if needed.
 */
@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {

    boolean existsByBuildingName(String buildingName);

    boolean existsByBuildingNameAndIdNot(String buildingName, Long id);
}

