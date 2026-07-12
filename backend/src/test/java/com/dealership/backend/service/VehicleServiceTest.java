package com.dealership.backend.service;

import com.dealership.backend.model.Vehicle;
import com.dealership.backend.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void shouldAddVehicle() {

        Vehicle vehicle = new Vehicle(
                "Toyota",
                "Fortuner",
                "SUV",
                2024,
                4200000,
                5
        );

        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);

        Vehicle savedVehicle = vehicleService.addVehicle(vehicle);

        assertNotNull(savedVehicle);
        assertEquals("Toyota", savedVehicle.getMake());

        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void shouldReturnAllVehicles() {

        List<Vehicle> vehicles = List.of(
                new Vehicle("Toyota", "Fortuner", "SUV", 2024, 4200000, 5),
                new Vehicle("Honda", "City", "Sedan", 2023, 1500000, 3)
        );

        when(vehicleRepository.findAll()).thenReturn(vehicles);

        List<Vehicle> result = vehicleService.getAllVehicles();

        assertEquals(2, result.size());

        verify(vehicleRepository).findAll();
    }

    @Test
    void shouldReturnVehicleById() {

        Vehicle vehicle = new Vehicle(
                "BMW",
                "X5",
                "SUV",
                2024,
                9000000,
                2
        );

        when(vehicleRepository.findById("1"))
                .thenReturn(Optional.of(vehicle));

        Vehicle result = vehicleService.getVehicleById("1");

        assertEquals("BMW", result.getMake());

        verify(vehicleRepository).findById("1");
    }

    @Test
    void shouldUpdateVehicle() {

        Vehicle existingVehicle = new Vehicle(
                "Toyota",
                "Fortuner",
                "SUV",
                2024,
                4200000,
                5
        );

        Vehicle updatedVehicle = new Vehicle(
                "Toyota",
                "Legender",
                "SUV",
                2025,
                4500000,
                8
        );

        when(vehicleRepository.findById("1"))
                .thenReturn(Optional.of(existingVehicle));

        when(vehicleRepository.save(any(Vehicle.class)))
                .thenReturn(updatedVehicle);

        Vehicle result = vehicleService.updateVehicle("1", updatedVehicle);

        assertEquals("Legender", result.getModel());
        assertEquals(2025, result.getYear());

        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void shouldDeleteVehicle() {

        Vehicle vehicle = new Vehicle(
                "Toyota",
                "Fortuner",
                "SUV",
                2024,
                4200000,
                5
        );

        when(vehicleRepository.findById("1"))
                .thenReturn(Optional.of(vehicle));

        vehicleService.deleteVehicle("1");

        verify(vehicleRepository).delete(vehicle);
    }
}