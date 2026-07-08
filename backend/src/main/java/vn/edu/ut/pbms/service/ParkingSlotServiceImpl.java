package vn.edu.ut.pbms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;

@Service
@RequiredArgsConstructor
public class ParkingSlotServiceImpl implements ParkingSlotService {

    private final ParkingSlotRepository repository;

    @Override
    public List<ParkingSlot> findSlots(Long floorId, ParkingSlotStatus status) {
        if (floorId != null && status != null) {
            return repository.findByFloorIdAndStatus(floorId, status);
        } else if (floorId != null) {
            return repository.findByFloor_Id(floorId); 
        } else if (status != null) {
            return repository.findByStatus(status);
        }
        return repository.findAll();
    }

    @Override
    public ParkingSlot updateStatus(Long id, ParkingSlotStatus status) {
        ParkingSlot slot = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ô đỗ ID: " + id));
        slot.setStatus(status);
        return repository.save(slot);
    }
}