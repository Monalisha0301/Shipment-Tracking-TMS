package com.example.shipmenttms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.shipmenttms.entity.Shipment;
import com.example.shipmenttms.repository.ShipmentRepository;

@Service
public class ShipmentService {

    private final ShipmentRepository repository;

    public ShipmentService(ShipmentRepository repository) {
        this.repository = repository;
    }

    public Shipment createShipment(Shipment shipment) {

        if (shipment.getStatus() == null) {
            shipment.setStatus("CREATED");
        }

        return repository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        return repository.findAll();
    }

    public Shipment getShipmentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Shipment updateShipment(Long id, Shipment shipment) {

        Shipment existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setCustomerName(shipment.getCustomerName());
        existing.setPickupLocation(shipment.getPickupLocation());
        existing.setDeliveryLocation(shipment.getDeliveryLocation());
        existing.setDriverName(shipment.getDriverName());
        existing.setVehicleNumber(shipment.getVehicleNumber());
        existing.setStatus(shipment.getStatus());

        return repository.save(existing);
    }

    public void deleteShipment(Long id) {
        repository.deleteById(id);
    }
}