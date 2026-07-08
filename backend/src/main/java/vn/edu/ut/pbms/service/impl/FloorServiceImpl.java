package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.ut.pbms.constant.FloorStatus;
import vn.edu.ut.pbms.dto.request.FloorRequestDTO;
import vn.edu.ut.pbms.dto.response.FloorResponseDTO;
import vn.edu.ut.pbms.entity.Building;
import vn.edu.ut.pbms.entity.Floor;
import vn.edu.ut.pbms.entity.VehicleType;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.BuildingRepository;
import vn.edu.ut.pbms.repository.FloorRepository;
import vn.edu.ut.pbms.repository.VehicleTypeRepository;
import vn.edu.ut.pbms.service.FloorService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FloorServiceImpl implements FloorService {

    private final FloorRepository floorRepository;
    private final BuildingRepository buildingRepository;
    private final VehicleTypeRepository vehicleTypeRepository;

    @Override
    public FloorResponseDTO createFloor(FloorRequestDTO request) {
        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy tòa nhà với ID: " + request.getBuildingId()));

        VehicleType vehicleType = vehicleTypeRepository.findById(request.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại xe với ID: " + request.getVehicleTypeId()));

        Floor floor = Floor.builder()
                .floorName(request.getFloorName())
                .floorLevel(request.getFloorLevel())
                .capacity(request.getCapacity())
                .building(building)
                .vehicleType(vehicleType)
                .status(FloorStatus.ACTIVE)
                .build();

        Floor savedFloor = floorRepository.save(floor);
        return mapToResponseDTO(savedFloor);
    }

    @Override
    public FloorResponseDTO updateFloor(Long id, FloorRequestDTO request) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tầng với ID: " + id));

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy tòa nhà với ID: " + request.getBuildingId()));

        VehicleType vehicleType = vehicleTypeRepository.findById(request.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy loại xe với ID: " + request.getVehicleTypeId()));

        floor.setFloorName(request.getFloorName());
        floor.setFloorLevel(request.getFloorLevel());
        floor.setCapacity(request.getCapacity());
        floor.setBuilding(building);
        floor.setVehicleType(vehicleType);

        Floor updatedFloor = floorRepository.save(floor);
        return mapToResponseDTO(updatedFloor);
    }

    @Override
    public FloorResponseDTO getFloorById(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tầng với ID: " + id));
        return mapToResponseDTO(floor);
    }

    @Override
    public List<FloorResponseDTO> getAllFloors() {
        return floorRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FloorResponseDTO> getFloorsByBuildingId(Long buildingId) {
        return floorRepository.findByBuildingId(buildingId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFloor(Long id) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tầng với ID: " + id));
        // Soft delete: Chuyển trạng thái sang LOCKED hoặc MAINTENANCE
        floor.setStatus(FloorStatus.LOCKED);
        floorRepository.save(floor);
    }

    // Hàm phụ trợ map từ Entity sang DTO
    private FloorResponseDTO mapToResponseDTO(Floor floor) {
        return FloorResponseDTO.builder()
                .id(floor.getId())
                .floorName(floor.getFloorName())
                .floorLevel(floor.getFloorLevel())
                .capacity(floor.getCapacity())
                .status(floor.getStatus())
                .buildingId(floor.getBuilding() != null ? floor.getBuilding().getId() : null)
                .buildingName(floor.getBuilding() != null ? floor.getBuilding().getBuildingName() : null)
                .vehicleTypeId(floor.getVehicleType() != null ? floor.getVehicleType().getId() : null)
                .build();
    }
}