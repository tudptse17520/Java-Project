package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Floor;
import java.util.List; // Duy Kha đã thêm thư viện này

/**
 * Repository interface for Floor entity.
 */
@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    // Duy Kha đã thêm dòng này
    // Tối ưu việc tìm kiếm tầng theo tòa nhà
    List<Floor> findByBuildingId(Long buildingId);
}
