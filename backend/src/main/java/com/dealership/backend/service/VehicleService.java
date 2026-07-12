package com.dealership.backend.service;

import com.dealership.backend.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    public Vehicle updateVehicle(String id, Vehicle updatedVehicle) {

        Vehicle existingVehicle = getVehicleById(id);

        existingVehicle.setMake(updatedVehicle.getMake());
        existingVehicle.setModel(updatedVehicle.getModel());
        existingVehicle.setCategory(updatedVehicle.getCategory());
        existingVehicle.setYear(updatedVehicle.getYear());
        existingVehicle.setPrice(updatedVehicle.getPrice());
        existingVehicle.setQuantity(updatedVehicle.getQuantity());

        return vehicleRepository.save(existingVehicle);
    }

    public void deleteVehicle(String id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public List<Vehicle> searchVehicles(String keyword, Double minPrice, Double maxPrice) {

        return vehicleRepository.findAll()
                .stream()
                .filter(vehicle -> {

                    boolean keywordMatch = (keyword == null || keyword.isBlank())
                            || vehicle.getMake().toLowerCase().contains(keyword.toLowerCase())
                            || vehicle.getModel().toLowerCase().contains(keyword.toLowerCase())
                            || vehicle.getCategory().toLowerCase().contains(keyword.toLowerCase());

                    boolean minMatch = (minPrice == null)
                            || vehicle.getPrice() >= minPrice;

                    boolean maxMatch = (maxPrice == null)
                            || vehicle.getPrice() <= maxPrice;

                    return keywordMatch && minMatch && maxMatch;
                })
                .toList();
    }

    public Vehicle purchaseVehicle(String id) {

        Vehicle vehicle = getVehicleById(id);

        if (vehicle.getQuantity() <= 0) {
            throw new RuntimeException("Vehicle out of stock");
        }

        vehicle.setQuantity(vehicle.getQuantity() - 1);

        return vehicleRepository.save(vehicle);
    }

    public Vehicle restockVehicle(String id, int quantity) {

        Vehicle vehicle = getVehicleById(id);

        vehicle.setQuantity(vehicle.getQuantity() + quantity);

        return vehicleRepository.save(vehicle);
    }
}