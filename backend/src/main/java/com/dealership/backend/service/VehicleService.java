package com.dealership.backend.service;

import com.dealership.backend.model.Vehicle;
import com.dealership.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(String id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle updateVehicle(String id, Vehicle updatedVehicle) {

        Vehicle existingVehicle = getVehicleById(id);

        existingVehicle.setMake(updatedVehicle.getMake());
        existingVehicle.setModel(updatedVehicle.getModel());
        existingVehicle.setYear(updatedVehicle.getYear());
        existingVehicle.setPrice(updatedVehicle.getPrice());
        existingVehicle.setQuantity(updatedVehicle.getQuantity());

        return vehicleRepository.save(existingVehicle);
    }

    public void deleteVehicle(String id) {

        Vehicle vehicle = getVehicleById(id);

        vehicleRepository.delete(vehicle);
    }
}