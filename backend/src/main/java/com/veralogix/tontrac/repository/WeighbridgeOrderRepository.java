package com.veralogix.tontrac.repository;

import com.veralogix.tontrac.entity.WeighbridgeOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeighbridgeOrderRepository extends JpaRepository<WeighbridgeOrder, Long> {
    void deleteByOrderId(String orderId);
}
