package com.example.backend.controller;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.service.FirebaseAuthService;
import com.example.backend.service.FirestoreService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:8082")
public class AuthController {

    private final FirebaseAuthService firebaseAuthService;
    private final FirestoreService firestoreService;

    public AuthController(
            FirebaseAuthService firebaseAuthService,
            FirestoreService firestoreService
    ) {
        this.firebaseAuthService = firebaseAuthService;
        this.firestoreService = firestoreService;
    }

    /**
     * ✅ REGISTER / SIGNUP USER
     * - Creates Firebase Auth user (email + password)
     * - Gets UID from Firebase
     * - Stores full user profile in Firestore using UID
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            // 1️⃣ Create Firebase Auth user and get UID
            String uid = firebaseAuthService.register(
                    request.getEmail(),
                    request.getPassword(),
                    request.getName(),
                    request.getRole()
            );

            // 2️⃣ Build Firestore user profile
            Map<String, Object> userData = new java.util.HashMap<>();

            userData.put("email", request.getEmail());
            userData.put("name", request.getName());
            userData.put("role", request.getRole());
            userData.put("phone", request.getPhone());
            userData.put("meterNumber", request.getMeterNumber());
            userData.put("houseName", request.getHouseName());

            Map<String, Object> location = new java.util.HashMap<>();
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

            // 4️⃣ Return success
            return ResponseEntity.ok(Map.of("uid", uid));

        } catch (IllegalStateException e) {

            // 🔴 Email already exists
            if ("EMAIL_ALREADY_REGISTERED".equals(e.getMessage())) {
                return ResponseEntity
                        .status(409) // Conflict
                        .body(Map.of(
                                "message", "Email already registered. Please login."
                        ));
            }

            throw e; // unexpected business error

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of(
                            "message", "Signup failed. Please try again."
                    ));
        }
    }


    /**
     * ✅ GET CURRENT LOGGED-IN USER PROFILE
     * - Used by dashboard
     * - Reads user data from Firestore
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader("Authorization") String authorization
    ) throws Exception {

        // Expect header: "Bearer <token>"
        String token = authorization.replace("Bearer ", "");

        // Verify Firebase token
        FirebaseToken decodedToken = firebaseAuthService.verifyToken(token);
        String uid = decodedToken.getUid();

        // Fetch user data from Firestore
        Map<String, Object> userData = firestoreService.getUser(uid);

        return ResponseEntity.ok(userData);
    }
}
