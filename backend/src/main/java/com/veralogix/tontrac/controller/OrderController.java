package com.veralogix.tontrac.controller;

import com.veralogix.tontrac.entity.WeighbridgeOrder;
import com.veralogix.tontrac.repository.WeighbridgeOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private WeighbridgeOrderRepository orderRepository;

    @GetMapping
    public List<WeighbridgeOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public WeighbridgeOrder createOrder(@RequestBody WeighbridgeOrder order) {
        if (order.getOrderId() == null) {
            order.setOrderId("ORD-" + (int)(10000 + Math.random() * 90000));
        }
        if (order.getStatus() == null) {
            order.setStatus("Approved");
        }
        return orderRepository.save(order);
    }

    @DeleteMapping("/{orderId}")
    @Transactional
    public ResponseEntity<?> deleteOrder(@PathVariable String orderId) {
        orderRepository.deleteByOrderId(orderId);
        return ResponseEntity.ok().build();
    }
}
