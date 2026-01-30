package com.example.backend.controller;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.service.FirebaseAuthService;
import com.example.backend.service.FirestoreService;
import com.example.backend.domain.microgrid.lan.LANManager;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:8082")
public class AuthController {

    private final FirebaseAuthService firebaseAuthService;
    private final FirestoreService firestoreService;
    private final LANManager lanManager;

    public AuthController(
            FirebaseAuthService firebaseAuthService,
            FirestoreService firestoreService,
            LANManager lanManager
    ) {
        this.firebaseAuthService = firebaseAuthService;
        this.firestoreService = firestoreService;
        this.lanManager = lanManager;
    }

    /**
     * ✅ REGISTER / SIGNUP USER
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            // 1️⃣ Create Firebase Auth user
            String uid = firebaseAuthService.register(
                    request.getEmail(),
                    request.getPassword(),
                    request.getName(),
                    request.getRole()
            );

            // 2️⃣ Build Firestore user profile
            Map<String, Object> userData = new HashMap<>();

            userData.put("email", request.getEmail());
            userData.put("name", request.getName());
            userData.put("role", request.getRole());
            userData.put("phone", request.getPhone());
            userData.put("meterNumber", request.getMeterNumber());
            userData.put("houseName", request.getHouseName());

            Map<String, Object> location = new HashMap<>();
            location.put("latitude", request.getLocation().getLatitude());
            location.put("longitude", request.getLocation().getLongitude());
            userData.put("location", location);

            // 🔽 DEFAULT ENERGY VALUES
            userData.put("sellingPrice", 6.5);
            userData.put("buyBidPrice", 6.0);
            userData.put("energySold", 0);
            userData.put("energyConsumed", 0);
            userData.put("earnings", 0);
            userData.put("gridSavings", 0);
            userData.put("createdAt", System.currentTimeMillis());

            // 3️⃣ Save to Firestore
            firestoreService.createUser(uid, userData);

            // 4️⃣ Register user in LAN brain
            lanManager.addUser(uid);

            return ResponseEntity.ok(Map.of("uid", uid));

        } catch (IllegalStateException e) {

            if ("EMAIL_ALREADY_REGISTERED".equals(e.getMessage())) {
                return ResponseEntity
                        .status(409)
                        .body(Map.of("message", "Email already registered. Please login."));
            }

            throw e;

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("message", "Signup failed. Please try again."));
        }
    }

    /**
     * ✅ GET CURRENT USER
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader("Authorization") String authorization
    ) throws Exception {

        String token = authorization.replace("Bearer ", "");
        FirebaseToken decodedToken = firebaseAuthService.verifyToken(token);
        String uid = decodedToken.getUid();

        Map<String, Object> userData = firestoreService.getUser(uid);
        return ResponseEntity.ok(userData);
    }
}
