package com.example.backend.domain.microgrid.lan.policy;

import com.example.backend.domain.microgrid.house.House;
import com.example.backend.domain.microgrid.lan.EnergySnapshot;
import com.example.backend.domain.microgrid.lan.LAN;

import java.util.List;

public interface TradePolicy
{
    public abstract void trade(LAN lan, List<EnergySnapshot> haveSurplus, List<EnergySnapshot> haveDeficit);

    public abstract EnergySnapshot getEnergySnapshot(LAN lan, House house);
}
