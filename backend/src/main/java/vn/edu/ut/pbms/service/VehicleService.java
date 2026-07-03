package vn.edu.ut.pbms.service;

import java.util.List;

import vn.edu.ut.pbms.entity.Vehicle;

public interface VehicleService {
    Vehicle registerVehicle(Vehicle vehicle);
    List<Vehicle> getVehiclesByUserId(Long userId);
}