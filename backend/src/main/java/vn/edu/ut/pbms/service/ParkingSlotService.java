package vn.edu.ut.pbms.service;

import java.util.List;

import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.dto.request.ParkingSlotRequest;
import vn.edu.ut.pbms.dto.response.ParkingSlotCreateResponse;

public interface ParkingSlotService {
    // Khớp với controller: tìm slot theo floor_id và status
    List<ParkingSlot> findSlots(Long floorId, ParkingSlotStatus status);
    
    // Khớp với controller: cập nhật status
    ParkingSlot updateStatus(Long id, ParkingSlotStatus status);

    // Thêm mới slot
    ParkingSlotCreateResponse createSlot(ParkingSlotRequest request);
}