package com.example.backend;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.example.backend.domain.microgrid.lan.LANManager;

import java.time.Instant;

@Component
public class LANManagerScheduler {

    private final LANManager lanManager;

    public LANManagerScheduler(LANManager lanManager) {
        this.lanManager = lanManager;
    }

    // t1: every minute
    @Scheduled(fixedRate = 1000)
    public void step() {
        lanManager.step(Instant.now());
    }

    // t2: every 2 minutes
    @Scheduled(fixedRate = 120_000)
    public void marketCycle() throws Exception {
        lanManager.runMarketCycles();
    }

    // t3: every 5 minutes
    @Scheduled(fixedRate = 60_000)
    public void upload() throws Exception {
        lanManager.uploadToFirebase();
    }
}
