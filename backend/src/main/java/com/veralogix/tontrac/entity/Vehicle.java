package com.veralogix.tontrac.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String reg;
    private String fleet;
    private String haulier;
    private String type; // e.g. TRUCK, TRAILER
    private Double maxLegalWeight;
    private String complianceStatus; // e.g. Compliant, Non-Compliant
    private String gpsDeviceId;
    private Boolean active;
}
