package com.example.backend.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;
import com.google.firebase.auth.FirebaseAuthException;

@Service
public class FirebaseAuthService {

    private final FirestoreService firestoreService;

    // ✅ Constructor injection
    public FirebaseAuthService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    // 🔐 Existing method (KEEP THIS)
    public FirebaseToken verifyToken(String token) throws Exception {
        return FirebaseAuth
                .getInstance()
                .verifyIdToken(token);
    }

    // 🆕 NEW METHOD — SIGNUP
    public String register(String email, String password, String name, String role) throws Exception {

        try {
            UserRecord user = FirebaseAuth.getInstance()
                    .createUser(
                            new UserRecord.CreateRequest()
                                    .setEmail(email)
                                    .setPassword(password)
                    );

            return user.getUid();

        } catch (FirebaseAuthException e) {
            if ("EMAIL_EXISTS".equals(e.getErrorCode())) {
                throw new IllegalStateException("EMAIL_ALREADY_REGISTERED");
            }
            throw e;
        }
    }

}