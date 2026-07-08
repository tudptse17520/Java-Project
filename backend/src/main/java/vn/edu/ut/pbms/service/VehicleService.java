package vn.edu.ut.pbms.service;

import java.util.List;
import vn.edu.ut.pbms.dto.request.VehicleRequestDTO;
import vn.edu.ut.pbms.dto.response.VehicleCreateResponseDTO;
import vn.edu.ut.pbms.dto.response.VehicleResponseDTO;

public interface VehicleService {
    VehicleCreateResponseDTO registerVehicle(VehicleRequestDTO request);
    List<VehicleResponseDTO> getVehiclesByUserId(Long userId);
}