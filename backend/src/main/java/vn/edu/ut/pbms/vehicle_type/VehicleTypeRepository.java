package vn.edu.ut.pbms.vehicle_type;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for VehicleType entity. Extends JpaRepository for basic
 * CRUD operations and adds custom query methods.
 */
@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {

    /**
     * Check if a vehicle type with the given name already exists. Used for
     * duplicate name validation when creating a new vehicle type (E2).
     *
     * @param typeName the vehicle type name to check
     * @return true if a vehicle type with this name exists
     */
    boolean existsByTypeName(String typeName);

    /**
     * Check if a vehicle type with the given name exists, excluding a specific
     * ID. Used for duplicate name validation when updating a vehicle type (E2),
     * so that the current vehicle type's own name is not considered a
     * duplicate.
     *
     * @param typeName the vehicle type name to check
     * @param id the ID to exclude from the check
     * @return true if another vehicle type with this name exists
     */
    boolean existsByTypeNameAndIdNot(String typeName, Long id);
}
