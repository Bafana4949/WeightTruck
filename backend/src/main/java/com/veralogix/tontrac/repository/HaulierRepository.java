package com.veralogix.tontrac.repository;

import com.veralogix.tontrac.entity.Haulier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HaulierRepository extends JpaRepository<Haulier, Long> {
}
