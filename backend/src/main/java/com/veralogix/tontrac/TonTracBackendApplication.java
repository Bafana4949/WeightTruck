package com.veralogix.tontrac;

import com.veralogix.tontrac.entity.Stockpile;
import com.veralogix.tontrac.entity.WeighbridgeOrder;
import com.veralogix.tontrac.entity.WeighbridgeTicket;
import com.veralogix.tontrac.repository.StockpileRepository;
import com.veralogix.tontrac.repository.WeighbridgeOrderRepository;
import com.veralogix.tontrac.repository.WeighbridgeTicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class TonTracBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TonTracBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner demoData(
            StockpileRepository stockpileRepository,
            WeighbridgeOrderRepository orderRepository,
            WeighbridgeTicketRepository ticketRepository) {
        return args -> {
            // Seed stockpiles
            if (stockpileRepository.count() == 0) {
                stockpileRepository.saveAll(List.of(
                    new Stockpile(null, "Stockpile A", "Anthracite Pea", 5420.0, 10000.0, "blue-fill"),
                    new Stockpile(null, "Stockpile B", "RB1 Export", 7850.0, 12000.0, "amber-fill"),
                    new Stockpile(null, "Stockpile C", "Duff", 1950.0, 8000.0, "cyan-fill")
                ));
            }

            // Seed orders
            if (orderRepository.count() == 0) {
                orderRepository.saveAll(List.of(
                    new WeighbridgeOrder(null, "ORD-4029", "Dispatch", "Anthracite Pea", 34.0, 34.0, "Glencore Operations", "Approved"),
                    new WeighbridgeOrder(null, "ORD-4030", "Dispatch", "RB1 Export", 120.0, 60.0, "Exxaro Resources", "Approved"),
                    new WeighbridgeOrder(null, "ORD-4031", "Receipt", "Duff", 200.0, 150.0, "Sasol Mining", "Approved"),
                    new WeighbridgeOrder(null, "ORD-4032", "Receipt", "Anthracite Pea", 50.0, 0.0, "Sasol Mining", "Pending")
                ));
            }

            // Seed initial tickets
            if (ticketRepository.count() == 0) {
                ticketRepository.saveAll(List.of(
                    new WeighbridgeTicket(null, "T-84210", "GP-142-TR", "Anthracite Pea", 49.45, 34.10, "Complete", "12:15", LocalDateTime.now().minusHours(2)),
                    new WeighbridgeTicket(null, "T-84211", "MP-990-CL", "RB1 Export", 40.67, 28.05, "In Progress", "12:28", LocalDateTime.now().minusHours(1)),
                    new WeighbridgeTicket(null, "T-84212", "NW-441-RT", "RB1 Export", 62.52, 43.12, "Variance Flagged", "12:35", LocalDateTime.now().minusMinutes(30))
                ));
            }
        };
    }
}
