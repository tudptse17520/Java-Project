package vn.edu.ut.pbms.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.dto.request.ParkingSlotRequest;
import vn.edu.ut.pbms.dto.response.ParkingSlotCreateResponse;
import vn.edu.ut.pbms.entity.Floor;
import vn.edu.ut.pbms.entity.ParkingSlot;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.exception.BusinessRuleViolationException;
import vn.edu.ut.pbms.repository.FloorRepository;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.service.ParkingSlotService;
import vn.edu.ut.pbms.service.SlotAvailabilityService;

@Service
@RequiredArgsConstructor
@Transactional
public class ParkingSlotServiceImpl implements ParkingSlotService {

    private final ParkingSlotRepository repository;
    private final FloorRepository floorRepository;
    private final SlotAvailabilityService slotAvailabilityService;

    @Override
    @Transactional(readOnly = true)
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
        // Sử dụng SlotAvailabilityService để update nhằm kích hoạt cơ chế khóa và phát SSE Event
        slotAvailabilityService.updateSlotStatus(id, status);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ô đỗ ID: " + id));
    }

    @Override
    public ParkingSlotCreateResponse createSlot(ParkingSlotRequest request) {
        // 1. Kiểm tra Tầng đỗ xe tồn tại
        Floor floor = floorRepository.findById(request.getFloorId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tầng với ID: " + request.getFloorId()));

        // 2. Kiểm tra trùng tên slot trên cùng một tầng
        if (repository.existsByFloorIdAndSlotName(request.getFloorId(), request.getSlotName())) {
            throw new ConflictException("Tên vị trí đỗ '" + request.getSlotName() + "' đã tồn tại trên tầng này.");
        }

        // 3. Kiểm tra giới hạn sức chứa của tầng (Capacity Check)
        List<ParkingSlot> currentSlots = repository.findByFloorId(request.getFloorId());
        if (currentSlots.size() >= floor.getCapacity()) {
            throw new BusinessRuleViolationException(
                    "Không thể tạo thêm vị trí đỗ. Tầng '" + floor.getFloorName() + "' đã đạt sức chứa tối đa (" + floor.getCapacity() + ").");
        }

        // 4. Xác định trạng thái ban đầu (Mặc định: AVAILABLE)
        ParkingSlotStatus initialStatus = ParkingSlotStatus.AVAILABLE;
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                initialStatus = ParkingSlotStatus.valueOf(request.getStatus().trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessRuleViolationException("Trạng thái ô đỗ '" + request.getStatus() + "' không hợp lệ.");
            }
        }

        // 5. Lưu vào Database
        ParkingSlot slot = ParkingSlot.builder()
                .floor(floor)
                .slotName(request.getSlotName())
                .status(initialStatus)
                .build();

        ParkingSlot savedSlot = repository.save(slot);

        // Kích hoạt SSE event thông báo cho Clients
        try {
            slotAvailabilityService.updateSlotStatus(savedSlot.getId(), initialStatus);
        } catch (Exception e) {
            // log and ignore if any SSE broadcast error occurs during creation post-save
        }

        return ParkingSlotCreateResponse.builder()
                .id(savedSlot.getId())
                .message("Tạo vị trí đỗ xe thành công.")
                .build();
    }
}
