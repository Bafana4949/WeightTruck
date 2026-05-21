package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Alert;
import com.veralogix.tontrac.entity.Driver;
import com.veralogix.tontrac.entity.Stockpile;
import com.veralogix.tontrac.entity.Vehicle;
import com.veralogix.tontrac.entity.WeighbridgeTicket;
import com.veralogix.tontrac.repository.AlertRepository;
import com.veralogix.tontrac.repository.DriverRepository;
import com.veralogix.tontrac.repository.StockpileRepository;
import com.veralogix.tontrac.repository.VehicleRepository;
import com.veralogix.tontrac.repository.WeighbridgeTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    @Autowired
    private WeighbridgeTicketRepository ticketRepository;

    @Autowired
    private StockpileRepository stockpileRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private AlertRepository alertRepository;

    private final List<Map<String, Object>> gateLogs = new ArrayList<>(List.of(
        Map.of("reg", "L-008-MN", "time", "12:12", "status", "granted", "msg", "Induction valid. Order active.", "error", false),
        Map.of("reg", "NW-441-RT", "time", "12:25", "status", "denied", "msg", "Missing driver induction.", "error", true),
        Map.of("reg", "GP-772-XL", "time", "12:31", "status", "granted", "msg", "License valid. Access granted.", "error", false)
    ));

    @GetMapping("/tickets")
    public List<WeighbridgeTicket> getTickets() {
        return ticketRepository.findAllByOrderByCreatedDateDesc();
    }

    @PostMapping("/tickets")
    public WeighbridgeTicket createTicket(@RequestBody WeighbridgeTicket ticket) {
        if (ticket.getTicketId() == null) {
            ticket.setTicketId("T-" + (int)(80000 + Math.random() * 10000));
        }
        if (ticket.getCreatedDate() == null) {
            ticket.setCreatedDate(LocalDateTime.now());
        }

        // 1. Compliance Verification
        if (ticket.getReg() != null) {
            Optional<Vehicle> vOpt = vehicleRepository.findByReg(ticket.getReg());
            if (vOpt.isPresent()) {
                Vehicle vehicle = vOpt.get();
                if ("Non-Compliant".equalsIgnoreCase(vehicle.getComplianceStatus())) {
                    ticket.setStatus("Flagged");
                    createComplianceAlert("Vehicle Non-Compliant", "Vehicle " + ticket.getReg() + " failed access validation check.", "CRITICAL");
                }
                
                // Overweight verification
                if (ticket.getGross() != null && vehicle.getMaxLegalWeight() != null) {
                    if (ticket.getGross() > vehicle.getMaxLegalWeight()) {
                        ticket.setStatus("Flagged");
                        createComplianceAlert("Overweight Violation", "Vehicle " + ticket.getReg() + " gross weight of " + ticket.getGross() + "t exceeds legal limit of " + vehicle.getMaxLegalWeight() + "t.", "HIGH");
                    }
                }
            }
        }

        if (ticket.getDriverName() != null) {
            Optional<Driver> dOpt = driverRepository.findByName(ticket.getDriverName());
            if (dOpt.isPresent()) {
                Driver driver = dOpt.get();
                if ("Expired".equalsIgnoreCase(driver.getInductionStatus())) {
                    ticket.setStatus("Flagged");
                    createComplianceAlert("Driver Induction Expired", "Driver " + ticket.getDriverName() + " has expired safety inductions.", "CRITICAL");
                }
                if (driver.getMedicalExpiryDate() != null && driver.getMedicalExpiryDate().isBefore(LocalDateTime.now())) {
                    ticket.setStatus("Flagged");
                    createComplianceAlert("Medical Expiry Violation", "Driver " + ticket.getDriverName() + " has an expired medical certificate.", "HIGH");
                }
            }
        }

        // 2. Intersite weight variance reconciliation logic
        if (ticket.getNetWeight() != null && ticket.getDestinationWeight() != null && ticket.getNetWeight() > 0) {
            double diff = Math.abs(ticket.getNetWeight() - ticket.getDestinationWeight());
            double variancePercent = (diff / ticket.getNetWeight()) * 100.0;
            ticket.setVariance(variancePercent);

            if (variancePercent > 2.0) {
                ticket.setReconciliationStatus("Major Discrepancy");
                ticket.setStatus("Variance Flagged");
                createComplianceAlert("Major Intersite Variance", "Ticket " + ticket.getTicketId() + " shows variance of " + String.format("%.2f", variancePercent) + "% between dispatch and receipt weighbridges.", "HIGH");
            } else if (variancePercent > 1.0) {
                ticket.setReconciliationStatus("Minor Variance");
                ticket.setStatus("Complete");
            } else {
                ticket.setReconciliationStatus("Matched");
                ticket.setStatus("Complete");
            }
        } else {
            if (ticket.getReconciliationStatus() == null) {
                ticket.setReconciliationStatus("Unreconciled");
            }
        }

        // 3. Billing calculation
        if (ticket.getRatePerTon() != null && ticket.getNet() != null) {
            ticket.setTotalAmount(ticket.getRatePerTon() * ticket.getNet());
        } else if (ticket.getRatePerTon() != null && ticket.getNetWeight() != null) {
            ticket.setTotalAmount(ticket.getRatePerTon() * ticket.getNetWeight());
        }
        if (ticket.getInvoiceStatus() == null) {
            ticket.setInvoiceStatus("Pending");
        }

        WeighbridgeTicket saved = ticketRepository.save(ticket);

        // Update stockpile levels if the ticket is successfully accepted (not flagged/pending)
        if ("Complete".equalsIgnoreCase(ticket.getStatus()) || "Accepted".equalsIgnoreCase(ticket.getStatus())) {
            Optional<Stockpile> spOpt = stockpileRepository.findByProduct(ticket.getProd());
            if (spOpt.isPresent()) {
                Stockpile sp = spOpt.get();
                Double netVal = ticket.getNet() != null ? ticket.getNet() : ticket.getNetWeight();
                if (netVal != null) {
                    double newTons = Math.min(sp.getCapacity(), sp.getTons() + netVal);
                    sp.setTons(newTons);
                    stockpileRepository.save(sp);
                }
            }
        }

        return saved;
    }

    private void createComplianceAlert(String title, String desc, String severity) {
        Alert alert = new Alert();
        alert.setType("Compliance");
        alert.setTitle(title);
        alert.setDescription(desc);
        alert.setSeverity(severity);
        alert.setIsRead(false);
        alert.setCreatedDate(LocalDateTime.now());
        alert.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        alertRepository.save(alert);
    }

    @GetMapping("/gate-logs")
    public List<Map<String, Object>> getGateLogs() {
        return gateLogs;
    }

    @PostMapping("/gate-logs")
    public Map<String, Object> addGateLog(@RequestBody Map<String, Object> log) {
        gateLogs.add(0, log);
        if (gateLogs.size() > 10) {
            gateLogs.remove(gateLogs.size() - 1);
        }
        return log;
    }
}

