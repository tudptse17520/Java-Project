package vn.edu.ut.pbms.controller;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import vn.edu.ut.pbms.dto.request.VehicleRequestDTO;
import vn.edu.ut.pbms.dto.response.VehicleCreateResponseDTO;
import vn.edu.ut.pbms.dto.response.VehicleResponseDTO;
import vn.edu.ut.pbms.service.VehicleService;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicle", description = "API quản lý phương tiện cá nhân")
public class VehicleController {

    private final VehicleService vehicleService;

    @Operation(summary = "Đăng ký xe cá nhân thành viên")
    @PostMapping
    public ResponseEntity<VehicleCreateResponseDTO> registerVehicle(
            @Valid @RequestBody VehicleRequestDTO request) {
        VehicleCreateResponseDTO response = vehicleService.registerVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Lấy danh sách xe của một user cụ thể")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByUser(
            @PathVariable("userId") Long userId) {
        List<VehicleResponseDTO> response = vehicleService.getVehiclesByUserId(userId);
        return ResponseEntity.ok(response);
    }
}