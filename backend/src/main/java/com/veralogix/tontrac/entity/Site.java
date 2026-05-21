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
public class Site {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String type; // e.g. MINE, STOCKPILE, LOADING_POINT, WEIGHBRIDGE, CUSTOMER_SITE
    private Double latitude;
    private Double longitude;
    private String operatingHours;
    private String accessRules;
}
