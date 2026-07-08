package vn.edu.ut.pbms.service.impl;

import vn.edu.ut.pbms.entity.Vehicle;
import vn.edu.ut.pbms.repository.VehicleRepository;
import vn.edu.ut.pbms.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public Vehicle registerVehicle(Vehicle vehicle) {
        // Bạn có thể thêm logic kiểm tra trùng biển số (plate) ở đây
        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUserId(userId);
    }
}