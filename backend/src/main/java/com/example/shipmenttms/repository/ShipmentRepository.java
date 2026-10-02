package com.example.shipmenttms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shipmenttms.entity.Shipment;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

}