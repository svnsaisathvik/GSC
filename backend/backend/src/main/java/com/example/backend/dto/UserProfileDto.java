package com.example.backend.dto;

public record UserProfileDto(
        String houseName,
        String name,
        String phone,
        String role,
        String meterNumber,   // 🆕 ADD THIS
        Double latitude,
        Double longitude,
        Double buyBidPrice
) {}
