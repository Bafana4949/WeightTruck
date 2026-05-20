package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Stockpile;
import com.veralogix.tontrac.entity.WeighbridgeTicket;
import com.veralogix.tontrac.repository.StockpileRepository;
import com.veralogix.tontrac.repository.WeighbridgeTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
        ticket.setCreatedDate(LocalDateTime.now());
        
        WeighbridgeTicket saved = ticketRepository.save(ticket);
        
        // Update stockpile levels if the ticket is successfully accepted (not flagged/pending)
        if ("Complete".equalsIgnoreCase(ticket.getStatus()) || "Accepted".equalsIgnoreCase(ticket.getStatus())) {
            Optional<Stockpile> spOpt = stockpileRepository.findByProduct(ticket.getProd());
            if (spOpt.isPresent()) {
                Stockpile sp = spOpt.get();
                double newTons = Math.min(sp.getCapacity(), sp.getTons() + ticket.getNet());
                sp.setTons(newTons);
                stockpileRepository.save(sp);
            }
        }
        
        return saved;
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
