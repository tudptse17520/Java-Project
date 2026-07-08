package vn.edu.ut.pbms.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;

/**
 * Repository interface for ParkingSlot entity.
 */
@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    
    // Tìm kiếm danh sách ô đỗ xe theo mã tầng (Floor ID)
    List<ParkingSlot> findByFloorId(Long floorId);
    
    // Tìm kiếm danh sách ô đỗ xe theo trạng thái (AVAILABLE, OCCUPIED,...)
    List<ParkingSlot> findByStatus(ParkingSlotStatus status);
    List<ParkingSlot> findByFloorIdAndStatus(Long floorId, ParkingSlotStatus status);
    List<ParkingSlot> findByFloor_Id(Long floorId);
}
