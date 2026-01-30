package com.example.backend.domain.microgrid.lan;

import com.example.backend.domain.microgrid.house.House;
import com.example.backend.service.FirebaseService;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.DocumentSnapshot;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LANManager {

    private static final double FRACTION_OF_DAY_PER_STEP = 1.0 / (24 * 60);

    private final Map<String, LAN> lans = new HashMap<>();
    private final Map<String, String> houseLanMap = new HashMap<>();
    private final Map<String, String> houseUIDMap = new HashMap<>();
    private final FirebaseService firebaseService;

    public LANManager(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
        initializeMapping();
    }

    private void initializeMapping() {
        try {
            List<QueryDocumentSnapshot> users = firebaseService.getAllUsers();

            for (QueryDocumentSnapshot user : users) {
                String meterId = user.getString("meterNumber");
                if (meterId == null) continue;

                String lanId = meterId.substring(0, 1);

                double buyBidPrice =
                        ((Number) user.get("buyBidPrice")).doubleValue();
                double sellingPrice =
                        ((Number) user.get("sellingPrice")).doubleValue();

                LAN lan = lans.computeIfAbsent(lanId, k -> new LAN());

                House house = new House(
                        meterId,
                        1.0 + (4.0 - 1.0) * Math.random(),
                        0.2 + (0.7 - 0.2) * Math.random(),
                        0.15 + (0.25 - 0.15) * Math.random(),
                        buyBidPrice,
                        sellingPrice
                );


                lan.addHouse(house);
                houseLanMap.put(meterId, lanId);
                houseUIDMap.put(meterId, user.getId());
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize LAN mapping", e);
        }
    }

    // t1
    public void step(Instant timestamp) {
        lans.forEach((id, lan) ->
                lan.step(timestamp, FRACTION_OF_DAY_PER_STEP));
    }

    // t2
    public void runMarketCycles() throws Exception {
        for (Map.Entry<String, LAN> entry : lans.entrySet()) {

            String lanId = entry.getKey();
            LAN lan = entry.getValue();

            for (Map.Entry<String, String> mapEntry : houseLanMap.entrySet()) {

                if (!mapEntry.getValue().equals(lanId)) continue;

                DocumentSnapshot user =
                        firebaseService.getUser(
                                houseUIDMap.get(mapEntry.getKey())
                        );
                double buyBidPrice = 0.1;
                try{
                    buyBidPrice =
                        ((Number) user.get("buyBidPrice")).doubleValue();
                }
                catch(Exception e){
                    buyBidPrice = 0.1;
                }

                double sellingPrice = Integer.MAX_VALUE;
                try{
                    sellingPrice = ((Number) user.get("sellingPrice")).doubleValue();
                }
                catch(Exception e){
                    sellingPrice = Integer.MAX_VALUE;
                }
                // System.out.println("LAN ID: " + lanId + ", House ID: " + mapEntry.getKey() +
                //         ", Buy Bid Price: " + buyBidPrice + ", Selling Price: " + sellingPrice);
                // System.out.println("UserData: " + user.getData());
                House house = lan.getHouse(mapEntry.getKey());
                house.setCostPrice(buyBidPrice);
                house.setSellingPrice(sellingPrice);
            }

            lan.runMarketCycle();
        }
    }
    
    // t3
    public void uploadToFirebase() {
        for (Map.Entry<String, String> entry : houseLanMap.entrySet()) {

            System.out.println("Uploading bills for House ID: " + entry.getKey());
            System.out.println("LAN ID: " + entry.getValue());
            String houseId = entry.getKey();
            String lanId = entry.getValue();

            LAN lan = lans.get(lanId);
            Bill bill = lan.getBill(houseId);

            firebaseService.updateUserBills(
                    // houseId,
                    houseUIDMap.get(houseId),
                    bill.getGridImported(),
                    bill.getGridExported(),
                    bill.getP2PRevenue(),
                    bill.getNetBill()
            );
            System.out.println("Finished uploading bills for House ID: " + houseId);
            System.out.println("Bill content" + bill.getGridImported() + ", " +
                    bill.getGridExported() + ", " +
                    bill.getP2PRevenue() + ", " +
                    bill.getNetBill());
            System.out.println("Bill Data: " + bill);
            System.out.println("--------------------------------------------------");
        }

    }

    public void addUser(String userId) throws Exception {

        DocumentSnapshot user = firebaseService.getUser(userId);

        String meterId = user.getString("meterNumber");
        if (meterId == null) return;

        String lanId = meterId.substring(0, 1);

        double buyBidPrice =
                ((Number) user.get("buyBidPrice")).doubleValue();
        double sellingPrice =
                ((Number) user.get("sellingPrice")).doubleValue();

        LAN lan = lans.computeIfAbsent(lanId, k -> new LAN());

        House house = new House(
                meterId,
                1.0 + (4.0 - 1.0) * Math.random(),
                0.2 + (0.7 - 0.2) * Math.random(),
                0.15 + (0.25 - 0.15) * Math.random(),
                buyBidPrice,
                sellingPrice
        );

        lan.addHouse(house);
        houseLanMap.put(meterId, lanId);
    }

    public ArrayList<Bill> getBills() {
        return lans.values()
                .stream()
                .flatMap(lan -> lan.getBills().stream())
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
