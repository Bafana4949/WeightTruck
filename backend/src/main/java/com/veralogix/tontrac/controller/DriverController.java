package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Driver;
import com.veralogix.tontrac.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @PostMapping
    public Driver saveDriver(@RequestBody Driver driver) {
        if (driver.getActive() == null) {
            driver.setActive(true);
        }
        return driverRepository.save(driver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        driverRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
