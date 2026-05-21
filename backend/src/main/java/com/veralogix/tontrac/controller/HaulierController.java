package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Haulier;
import com.veralogix.tontrac.repository.HaulierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hauliers")
public class HaulierController {

    @Autowired
    private HaulierRepository haulierRepository;

    @GetMapping
    public List<Haulier> getAllHauliers() {
        return haulierRepository.findAll();
    }

    @PostMapping
    public Haulier saveHaulier(@RequestBody Haulier haulier) {
        if (haulier.getActive() == null) {
            haulier.setActive(true);
        }
        return haulierRepository.save(haulier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHaulier(@PathVariable Long id) {
        haulierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
