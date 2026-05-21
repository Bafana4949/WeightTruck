package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Alert;
import com.veralogix.tontrac.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedDateDesc();
    }

    @PostMapping
    public Alert createAlert(@RequestBody Alert alert) {
        if (alert.getCreatedDate() == null) {
            alert.setCreatedDate(LocalDateTime.now());
        }
        if (alert.getIsRead() == null) {
            alert.setIsRead(false);
        }
        return alertRepository.save(alert);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Optional<Alert> alertOpt = alertRepository.findById(id);
        if (alertOpt.isPresent()) {
            Alert alert = alertOpt.get();
            alert.setIsRead(true);
            alertRepository.save(alert);
            return ResponseEntity.ok(alert);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id) {
        alertRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
