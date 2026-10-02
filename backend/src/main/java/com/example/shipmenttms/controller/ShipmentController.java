package com.example.shipmenttms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.shipmenttms.entity.Shipment;
import com.example.shipmenttms.service.ShipmentService;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin("*")
public class ShipmentController {

    private final ShipmentService service;

    public ShipmentController(ShipmentService service) {
        this.service = service;
    }

    @PostMapping
    public Shipment createShipment(@RequestBody Shipment shipment) {
        return service.createShipment(shipment);
    }

    @GetMapping
    public List<Shipment> getAllShipments() {
        return service.getAllShipments();
    }

    @GetMapping("/{id}")
    public Shipment getShipmentById(@PathVariable Long id) {
        return service.getShipmentById(id);
    }

    @PutMapping("/{id}")
    public Shipment updateShipment(
            @PathVariable Long id,
            @RequestBody Shipment shipment) {

        return service.updateShipment(id, shipment);
    }

    @DeleteMapping("/{id}")
    public String deleteShipment(@PathVariable Long id) {

        service.deleteShipment(id);

        return "Shipment deleted successfully";
    }
}