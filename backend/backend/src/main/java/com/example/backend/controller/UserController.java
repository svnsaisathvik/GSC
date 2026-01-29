package com.example.backend.controller;

import com.example.backend.dto.DashboardStatsDto;
import com.example.backend.dto.UserProfileDto;
import com.example.backend.service.FirebaseAuthService;
import com.example.backend.service.FirestoreService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final FirebaseAuthService authService;
    private final FirestoreService firestoreService;

    public UserController(FirebaseAuthService authService,
                          FirestoreService firestoreService) {
        this.authService = authService;
        this.firestoreService = firestoreService;
    }

    @GetMapping(value = "/profile", produces = "application/json")
public UserProfileDto getProfile(
        @RequestHeader("Authorization") String authHeader
) throws Exception {

        FirebaseToken token =
                authService.verifyToken(authHeader.replace("Bearer ", ""));

        Map<String, Object> user =
                firestoreService.getUser(token.getUid());

        Map<String, Object> location =
                (Map<String, Object>) user.get("location");

        Double latitude = null;
        Double longitude = null;

        if (location != null) {
                Object latObj = location.get("latitude");
                Object lngObj = location.get("longitude");

                if (latObj instanceof Number) {
                latitude = ((Number) latObj).doubleValue();
                }
                if (lngObj instanceof Number) {
                longitude = ((Number) lngObj).doubleValue();
                }
        }

        return new UserProfileDto(
                (String) user.get("houseName"),
                (String) user.get("name"),
                (String) user.get("phone"),
                (String) user.get("role"),
                (String) user.get("meterNumber"), // 🆕 ADD THIS
                latitude,
                longitude,
                user.get("buyBidPrice") instanceof Number
                        ? ((Number) user.get("buyBidPrice")).doubleValue()
                        : 0.0
        );

}


    @GetMapping("/dashboard/stats")
    public DashboardStatsDto getDashboardStats(
            @RequestHeader("Authorization") String authHeader
    ) throws Exception {

        FirebaseToken token = authService.verifyToken(authHeader.replace("Bearer ", ""));
        Map<String, Object> user = firestoreService.getUser(token.getUid());

        return new DashboardStatsDto(
                getDouble(user, "energySold"),
                getDouble(user, "energyConsumed"),
                getDouble(user, "totalEarnings"),
                getDouble(user, "gridSavings")
        );

    }
        private double getDouble(Map<String, Object> map, String key) {
                Object value = map.get(key);
                return value == null ? 0.0 : ((Number) value).doubleValue();
        }
}



