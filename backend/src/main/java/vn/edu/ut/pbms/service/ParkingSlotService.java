package vn.edu.ut.pbms.service;

import java.util.List;

import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;

public interface ParkingSlotService {
    // Lấy tất cả ô đỗ xe
    List<ParkingSlot> getAllParkingSlots();

    // Lấy ô đỗ xe theo ID
    ParkingSlot getParkingSlotById(Long id);

    // Tìm ô đỗ xe theo tầng
    List<ParkingSlot> getSlotsByFloor(Long floorId);

    // Cập nhật trạng thái ô đỗ xe (VD: Từ trống sang đã có xe)
    ParkingSlot updateSlotStatus(Long id, ParkingSlotStatus status);
}