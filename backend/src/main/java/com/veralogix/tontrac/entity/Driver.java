package com.veralogix.tontrac.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String idNumber;
    private String licenseNumber;
    private String inductionStatus; // Active, Expired, Pending
    private LocalDateTime medicalExpiryDate;
    private LocalDateTime trainingExpiryDate;
    private String assignedHaulier;
    private Boolean active;
}
