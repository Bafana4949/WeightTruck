package com.veralogix.tontrac.repository;

import com.veralogix.tontrac.entity.Stockpile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StockpileRepository extends JpaRepository<Stockpile, Long> {
    Optional<Stockpile> findByName(String name);
    Optional<Stockpile> findByProduct(String product);
}
