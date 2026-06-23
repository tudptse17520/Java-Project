package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Floor;

/**
 * Repository interface for Floor entity.
 */
@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
}
