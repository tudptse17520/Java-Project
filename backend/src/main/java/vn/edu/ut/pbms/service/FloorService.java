package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.FloorRequestDTO;
import vn.edu.ut.pbms.dto.response.FloorResponseDTO;
import java.util.List;

public interface FloorService {
    FloorResponseDTO createFloor(FloorRequestDTO requestDTO);

    FloorResponseDTO updateFloor(Long id, FloorRequestDTO requestDTO);

    FloorResponseDTO getFloorById(Long id);

    List<FloorResponseDTO> getAllFloors();

    List<FloorResponseDTO> getFloorsByBuildingId(Long buildingId);

    void deleteFloor(Long id);
}