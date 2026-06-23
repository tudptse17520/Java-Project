package vn.edu.ut.pbms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;

@Service
@RequiredArgsConstructor // Tự động inject ParkingSlotRepository vào thông qua Constructor của Lombok
public class ParkingSlotServiceImpl implements ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;

    @Override
    public List<ParkingSlot> getAllParkingSlots() {
        return parkingSlotRepository.findAll();
    }

    @Override
    public ParkingSlot getParkingSlotById(Long id) {
        return parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ô đỗ xe với ID: " + id));
    }

    @Override
    public List<ParkingSlot> getSlotsByFloor(Long floorId) {
        return parkingSlotRepository.findByFloorId(floorId);
    }

    @Override
    public ParkingSlot updateSlotStatus(Long id, ParkingSlotStatus status) {
        ParkingSlot slot = getParkingSlotById(id);
        slot.setStatus(status);
        return parkingSlotRepository.save(slot);
    }
}