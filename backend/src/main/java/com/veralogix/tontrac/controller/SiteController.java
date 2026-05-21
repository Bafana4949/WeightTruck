package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.Site;
import com.veralogix.tontrac.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    @Autowired
    private SiteRepository siteRepository;

    @GetMapping
    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }

    @PostMapping
    public Site saveSite(@RequestBody Site site) {
        return siteRepository.save(site);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSite(@PathVariable Long id) {
        siteRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
