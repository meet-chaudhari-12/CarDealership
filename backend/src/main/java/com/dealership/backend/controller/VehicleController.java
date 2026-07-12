package com.dealership.backend.controller;

import com.dealership.backend.model.Vehicle;
import com.dealership.backend.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    public Vehicle addVehicle(@Valid @RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable String id) {
        return vehicleService.getVehicleById(id);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable String id,
                                 @Valid @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }

    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable String id) {
        vehicleService.deleteVehicle(id);
        return "Vehicle deleted successfully";
    }

    @GetMapping("/search")
    public List<Vehicle> searchVehicles(

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) Double minPrice,

            @RequestParam(required = false) Double maxPrice) {

        return vehicleService.searchVehicles(keyword, minPrice, maxPrice);
    }

    @PostMapping("/{id}/purchase")
    public Vehicle purchaseVehicle(@PathVariable String id) {
        return vehicleService.purchaseVehicle(id);
    }

    @PostMapping("/{id}/restock")
    public Vehicle restockVehicle(@PathVariable String id,
                                  @RequestBody Map<String, Integer> request) {

        return vehicleService.restockVehicle(id, request.get("quantity"));
    }
}