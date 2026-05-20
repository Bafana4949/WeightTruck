package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Stockpile;
import com.veralogix.tontrac.repository.StockpileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stockpiles")
public class StockpileController {

    @Autowired
    private StockpileRepository stockpileRepository;

    @GetMapping
    public List<Stockpile> getStockpiles() {
        return stockpileRepository.findAll();
    }

    @PostMapping("/add-tonnage")
    public ResponseEntity<?> addTonnage(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        Double amount = Double.valueOf(payload.get("amount").toString());

        Optional<Stockpile> spOpt = stockpileRepository.findByName(name);
        if (spOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Stockpile not found"));
        }

        Stockpile sp = spOpt.get();
        double newTons = Math.min(sp.getCapacity(), sp.getTons() + amount);
        sp.setTons(newTons);
        stockpileRepository.save(sp);

        return ResponseEntity.ok(sp);
    }
}
