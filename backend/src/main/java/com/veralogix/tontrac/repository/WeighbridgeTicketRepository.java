package com.veralogix.tontrac.repository;

import com.veralogix.tontrac.entity.WeighbridgeTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeighbridgeTicketRepository extends JpaRepository<WeighbridgeTicket, Long> {
    List<WeighbridgeTicket> findAllByOrderByCreatedDateDesc();
}
