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
public class WeighbridgeTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String ticketId;
    private String reg;
    private String prod;
    private Double gross;
    private Double net;
    private String status;
    private String time;
    private LocalDateTime createdDate;

    // Expanded logistics fields
    private String mineSite;
    private String originWeighbridge;
    private String destination;
    private String driverName;
    private String trailerReg;
    private Double tareWeight;
    private Double grossWeight;
    private Double netWeight;
    private Double destinationWeight;
    private Double variance;
    private String reconciliationStatus; // e.g. Matched, Minor Variance, Major Discrepancy, Unreconciled
    private Double ratePerTon;
    private Double totalAmount;
    private String invoiceStatus; // Pending, Invoiced

    // Constructor for backwards compatibility during seeding
    public WeighbridgeTicket(Long id, String ticketId, String reg, String prod, Double gross, Double net, String status, String time, LocalDateTime createdDate) {
        this.id = id;
        this.ticketId = ticketId;
        this.reg = reg;
        this.prod = prod;
        this.gross = gross;
        this.net = net;
        this.status = status;
        this.time = time;
        this.createdDate = createdDate;
    }
}

