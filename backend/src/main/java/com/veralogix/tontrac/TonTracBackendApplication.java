package com.veralogix.tontrac;

import com.veralogix.tontrac.entity.Site;
import com.veralogix.tontrac.entity.Stockpile;
import com.veralogix.tontrac.entity.WeighbridgeOrder;
import com.veralogix.tontrac.entity.WeighbridgeTicket;
import com.veralogix.tontrac.entity.Vehicle;
import com.veralogix.tontrac.entity.Driver;
import com.veralogix.tontrac.entity.Haulier;
import com.veralogix.tontrac.entity.Alert;
import com.veralogix.tontrac.repository.SiteRepository;
import com.veralogix.tontrac.repository.StockpileRepository;
import com.veralogix.tontrac.repository.WeighbridgeOrderRepository;
import com.veralogix.tontrac.repository.WeighbridgeTicketRepository;
import com.veralogix.tontrac.repository.VehicleRepository;
import com.veralogix.tontrac.repository.DriverRepository;
import com.veralogix.tontrac.repository.HaulierRepository;
import com.veralogix.tontrac.repository.AlertRepository;
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
            WeighbridgeTicketRepository ticketRepository,
            SiteRepository siteRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            HaulierRepository haulierRepository,
            AlertRepository alertRepository) {
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

            // Seed South African sites
            if (siteRepository.count() == 0) {
                siteRepository.saveAll(List.of(
                    new Site(null, "Goedehoop Colliery", "MINE", -26.2483, 29.3512, "06:00 - 22:00", "Driver induction & PPE required"),
                    new Site(null, "Phola Coal Plant", "STOCKPILE", -26.0234, 29.0874, "24 Hours", "Valid weighbridge RFID card"),
                    new Site(null, "Ermelo Stockyard", "STOCKPILE", -26.5186, 29.9897, "07:00 - 18:00", "Access subject to permit"),
                    new Site(null, "Richards Bay Terminal", "CUSTOMER_SITE", -28.7903, 32.0381, "24 Hours", "Customs gate verification")
                ));
            }

            // Seed hauliers
            if (haulierRepository.count() == 0) {
                haulierRepository.saveAll(List.of(
                    new Haulier(null, "KZN Bulk Logistics", "kznops@bulk.co.za", "+27 31 555 0192", "Compliant", true),
                    new Haulier(null, "TransCoal Transport", "dispatch@transcoal.co.za", "+27 11 882 4310", "Compliant", true),
                    new Haulier(null, "Vryheid Haulers", "ops@vryheidhaul.co.za", "+27 34 981 2291", "Suspended", true)
                ));
            }

            // Seed vehicles
            if (vehicleRepository.count() == 0) {
                vehicleRepository.saveAll(List.of(
                    new Vehicle(null, "GP-142-TR", "Glencore Fleet", "TransCoal Transport", "TRUCK", 50.0, "Compliant", "GPS-V-882", true),
                    new Vehicle(null, "MP-990-CL", "Sasol Fleet", "KZN Bulk Logistics", "TRUCK", 48.0, "Compliant", "GPS-V-122", true),
                    new Vehicle(null, "NW-441-RT", "Vryheid Fleet", "Vryheid Haulers", "TRUCK", 52.0, "Non-Compliant", "GPS-V-901", true),
                    new Vehicle(null, "GP-772-XL", "TransCoal Fleet", "TransCoal Transport", "TRUCK", 50.0, "Compliant", "GPS-V-556", true)
                ));
            }

            // Seed drivers
            if (driverRepository.count() == 0) {
                driverRepository.saveAll(List.of(
                    new Driver(null, "Sipho Zuma", "8904125555081", "DR-ML12345", "Active", LocalDateTime.now().plusMonths(6), LocalDateTime.now().plusMonths(12), "KZN Bulk Logistics", true),
                    new Driver(null, "Jan Nel", "7509185121087", "DR-ML54321", "Active", LocalDateTime.now().plusMonths(8), LocalDateTime.now().plusMonths(10), "TransCoal Transport", true),
                    new Driver(null, "Bafana Sithole", "8203055812089", "DR-ML99999", "Expired", LocalDateTime.now().minusDays(5), LocalDateTime.now().plusMonths(2), "Vryheid Haulers", true)
                ));
            }

            // Seed initial tickets with expanded details
            if (ticketRepository.count() == 0) {
                WeighbridgeTicket t1 = new WeighbridgeTicket(null, "T-84210", "GP-142-TR", "Anthracite Pea", 49.45, 34.10, "Complete", "12:15", LocalDateTime.now().minusHours(2));
                t1.setMineSite("Goedehoop Colliery");
                t1.setOriginWeighbridge("Goedehoop Weighbridge 1");
                t1.setDestination("Richards Bay Terminal");
                t1.setDriverName("Sipho Zuma");
                t1.setTrailerReg("GP-999-TR");
                t1.setTareWeight(15.35);
                t1.setGrossWeight(49.45);
                t1.setNetWeight(34.10);
                t1.setDestinationWeight(34.05);
                t1.setVariance(0.15);
                t1.setReconciliationStatus("Matched");
                t1.setRatePerTon(350.0);
                t1.setTotalAmount(11935.0);
                t1.setInvoiceStatus("Pending");

                WeighbridgeTicket t2 = new WeighbridgeTicket(null, "T-84211", "MP-990-CL", "RB1 Export", 40.67, 28.05, "In Progress", "12:28", LocalDateTime.now().minusHours(1));
                t2.setMineSite("Ermelo Stockyard");
                t2.setOriginWeighbridge("Ermelo Weighbridge 2");
                t2.setDestination("Richards Bay Terminal");
                t2.setDriverName("Jan Nel");
                t2.setTrailerReg("MP-888-CL");
                t2.setTareWeight(12.62);
                t2.setGrossWeight(40.67);
                t2.setNetWeight(28.05);
                t2.setReconciliationStatus("Unreconciled");
                t2.setInvoiceStatus("Pending");

                WeighbridgeTicket t3 = new WeighbridgeTicket(null, "T-84212", "NW-441-RT", "RB1 Export", 62.52, 43.12, "Variance Flagged", "12:35", LocalDateTime.now().minusMinutes(30));
                t3.setMineSite("Goedehoop Colliery");
                t3.setOriginWeighbridge("Goedehoop Weighbridge 1");
                t3.setDestination("Richards Bay Terminal");
                t3.setDriverName("Bafana Sithole");
                t3.setTrailerReg("NW-777-RT");
                t3.setTareWeight(19.40);
                t3.setGrossWeight(62.52);
                t3.setNetWeight(43.12);
                t3.setDestinationWeight(41.25);
                t3.setVariance(4.34);
                t3.setReconciliationStatus("Major Discrepancy");
                t3.setRatePerTon(360.0);
                t3.setTotalAmount(15523.20);
                t3.setInvoiceStatus("Pending");

                ticketRepository.saveAll(List.of(t1, t2, t3));
            }

            // Seed initial alerts
            if (alertRepository.count() == 0) {
                alertRepository.saveAll(List.of(
                    new Alert(null, "Compliance", "Access Denied: Expired Induction", "Driver Bafana Sithole attempted access with expired safety induction certificates.", "CRITICAL", "12:35", false, LocalDateTime.now().minusMinutes(30)),
                    new Alert(null, "Variance", "Major Weight Discrepancy Flagged", "Ticket T-84212 has a 4.34% discrepancy between Ermelo dispatch and Richards Bay receipt weighbridge.", "HIGH", "12:40", false, LocalDateTime.now().minusMinutes(25)),
                    new Alert(null, "Compliance", "Access Denied: Suspended Haulier", "Vehicle NW-441-RT belonging to suspended contractor Vryheid Haulers arrived at the gate.", "CRITICAL", "12:42", false, LocalDateTime.now().minusMinutes(23))
                ));
            }
        };
    }
}

