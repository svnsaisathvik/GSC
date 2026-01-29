package com.example.backend.service;

import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.FieldValue;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirestoreService {

    private final Firestore firestore;

    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Map<String, Object> getUser(String uid) throws Exception {
        return firestore.collection("users")
                .document(uid)
                .get()
                .get()
                .getData();
    }

    public void updateUserField(String uid, String field, Object value) throws Exception {
        firestore.collection("users")
                .document(uid)
                .update(field, value)
                .get();
    }

    // ✅ EXISTING METHOD (KEEP THIS – backward compatible)
    public void createUser(String uid, String name, String role, String email) throws Exception {

        Map<String, Object> user = new HashMap<>();
        user.put("email", email);
        user.put("name", name);
        user.put("role", role);
        user.put("sellingPrice", 6.5);
        user.put("energySold", 0);
        user.put("energyConsumed", 0);
        user.put("earnings", 0);
        user.put("gridSavings", 0);
        user.put("createdAt", FieldValue.serverTimestamp());

        firestore.collection("users")
                .document(uid)
                .set(user)
                .get();
    }

    // 🆕 NEW METHOD (USED BY SIGNUP FLOW)
    public void createUser(String uid, Map<String, Object> userData) throws Exception {

        // Ensure server timestamp is always set
        userData.put("createdAt", FieldValue.serverTimestamp());

        firestore.collection("users")
                .document(uid)
                .set(userData)
                .get();
    }
}
