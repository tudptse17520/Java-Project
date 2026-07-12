package vn.edu.ut.pbms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.dto.request.VehicleRequestDTO;
import vn.edu.ut.pbms.dto.response.VehicleCreateResponseDTO;
import vn.edu.ut.pbms.dto.response.VehicleResponseDTO;
import vn.edu.ut.pbms.entity.User;
import vn.edu.ut.pbms.entity.Vehicle;
import vn.edu.ut.pbms.entity.VehicleType;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.UserRepository;
import vn.edu.ut.pbms.repository.VehicleRepository;
import vn.edu.ut.pbms.repository.VehicleTypeRepository;
import vn.edu.ut.pbms.service.VehicleService;

import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleTypeRepository vehicleTypeRepository;

    @Override
    public VehicleCreateResponseDTO registerVehicle(VehicleRequestDTO request) {
        // 1. Kiểm tra biển số xe trùng lặp
        if (vehicleRepository.existsByPlate(request.getPlate().trim())) {
            throw new ConflictException("Biển số xe '" + request.getPlate() + "' đã được đăng ký trên hệ thống.");
        }

        // 2. Lấy User từ Security Context (JWT) thay vì payload
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin xác thực của người dùng.");
        }

        // 3. Tìm Vehicle Type
        VehicleType type = vehicleTypeRepository.findById(request.getVehicleTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phương tiện với ID: " + request.getVehicleTypeId()));

        // 4. Lưu xe
        Vehicle vehicle = Vehicle.builder()
                .user(user)
                .vehicleType(type)
                .plate(request.getPlate().trim())
                .brand(request.getBrand())
                .color(request.getColor())
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);

        return VehicleCreateResponseDTO.builder()
                .id(saved.getId())
                .message("Đăng ký phương tiện thành công.")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getVehiclesByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId);
        }

        List<Vehicle> vehicles = vehicleRepository.findByUserId(userId);
        return vehicles.stream()
                .map(this::mapToVehicleResponseDTO)
                .collect(Collectors.toList());
    }

    private VehicleResponseDTO mapToVehicleResponseDTO(Vehicle vehicle) {
        return VehicleResponseDTO.builder()
                .id(vehicle.getId())
                .userId(vehicle.getUser() != null ? vehicle.getUser().getId() : null)
                .vehicleTypeId(vehicle.getVehicleType() != null ? vehicle.getVehicleType().getId() : null)
                .vehicleTypeName(vehicle.getVehicleType() != null ? vehicle.getVehicleType().getTypeName() : null)
                .plate(vehicle.getPlate())
                .brand(vehicle.getBrand())
                .color(vehicle.getColor())
                .build();
    }
}