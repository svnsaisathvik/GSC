package com.example.backend.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FirebaseService {

    private final Firestore firestore;

    public FirebaseService(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * ✅ Fetch all users
     * Used during LAN initialization (startup)
     */
    public List<QueryDocumentSnapshot> getAllUsers() throws Exception {
        return firestore
                .collection("users")
                .get()
                .get()
                .getDocuments();
    }

    /**
     * ✅ Fetch a single user by UID / meterId
     * Used during:
     * - market sync
     * - addUser
     */
    public DocumentSnapshot getUser(String userId) throws Exception {
        return firestore
                .collection("users")
                .document(userId)
                .get()
                .get();
    }

    /**
     * ✅ Update billing-related fields after LAN computation
     */
    public void updateUserBills(
            String userId,
            double energyConsumed,
            double energySold,
            double gridSavings,
            double earnings
    ) {
        firestore
                .collection("users")
                .document(userId)
                .update(
                        "energyConsumed", energyConsumed,
                        "energySold", energySold,
                        "gridSavings", gridSavings,
                        "earnings", earnings
                );
    }
}
