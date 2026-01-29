import { useEffect, useState } from "react";
import { getDashboard, updateSellingPrice } from "@/api/energy.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import TopBar from "@/components/layout/TopBar";



import { 
  User, 
  Phone, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Zap,
  ArrowUpRight,
  Check
} from "lucide-react";


const Dashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sellingPrice, setSellingPrice] = useState([6.5]);
  const [phone, setPhone] = useState("");
  const [houseName, setHouseName] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);


  const [energySold, setEnergySold] = useState(0);
  const [energyConsumed, setEnergyConsumed] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [gridSavings, setGridSavings] = useState(0);
  const [liveRate, setLiveRate] = useState(0);
  const isSelling = energySold > energyConsumed;
  const isConsuming = energyConsumed > energySold;


  useEffect(() => {
    getDashboard()
      .then((res) => {
        const data = res.data;

        setName(data.name);
        setEmail(data.email);
        setRole(data.role);

        // 🆕 NEW FIELDS
        setPhone(data.phone ?? "");
        setHouseName(data.houseName ?? "");
        setLatitude(data.location?.latitude ?? null);
        setLongitude(data.location?.longitude ?? null);

        setEnergySold(data.energySold);
        setEnergyConsumed(data.energyConsumed);
        setEarnings(data.earnings);
        setGridSavings(data.gridSavings);
        setLiveRate(data.liveRate ?? 0);
        setSellingPrice([data.sellingPrice]);
      })
      .catch(console.error);
  }, []);



  const handleSavePrice = async () => {
    try {
      await updateSellingPrice(sellingPrice[0]);
    } catch (err) {
      console.error("Failed to update selling price", err);
    }
  };



  return (
    <div className="min-h-screen bg-auth-gradient">
      <TopBar />
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left Column - Profile & Status */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/10">
                    <User className="h-8 w-8 text-white/70" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{name}</h2>
                    <p className="text-sm text-white/50">{houseName}</p>
                    <p className="text-sm text-white/60">{role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Phone</p>
                      <p className="text-white font-mono">
                        {phone ? `+91 ${phone}` : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Location</p>
                      <div className="flex gap-6">
                        <div>
                          <span className="text-xs text-white/40">LAT</span>
                          <p className="text-white font-mono">
                            {latitude !== null ? `${latitude}°` : "--"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-white/40">LNG</span>
                          <p className="text-white font-mono">
                            {longitude !== null ? `${longitude}°` : "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-lg bg-white/5 p-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-white">Smart Meter Connected</p>
                    <p className="text-xs text-white/50">Actively participating in the P2P energy network</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Status Card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Current Status</h3>
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                      isSelling ? "bg-emerald-500/20" : "bg-orange-500/20"
                    }`}
                  >
                    {isSelling ? (
                      <ArrowUpRight className="h-7 w-7 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-7 w-7 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-xl font-semibold ${
                        isSelling ? "text-emerald-400" : "text-orange-400"
                      }`}
                    >
                      {isSelling ? "Selling Energy" : "Consuming Energy"}
                    </p>

                    <p className="text-sm text-white/50">
                      @ ₹{sellingPrice[0].toFixed(2)}/kWh
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <span className="text-sm text-white/60">Live Rate</span>
                  <span className="text-lg font-mono font-semibold text-white">
                    {Math.abs(energySold - energyConsumed).toFixed(2)}
                    <span className="text-sm text-white/50"> kWh</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Pricing */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Energy Sold */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      +12.5%
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-1">Energy Sold</p>
                  <p className="text-3xl font-mono font-bold text-white">
                    {energySold.toFixed(1)} <span className="text-base font-normal text-white/50">kWh</span>
                  </p>
                </CardContent>
              </Card>

              {/* Energy Consumed */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
                      <TrendingDown className="h-6 w-6 text-orange-400" />
                    </div>
                    <span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-400">
                      8.2%
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-1">Energy Consumed</p>
                  <p className="text-3xl font-mono font-bold text-white">
                    {energyConsumed.toFixed(1)} <span className="text-base font-normal text-white/50">kWh</span>
                  </p>
                </CardContent>
              </Card>

              {/* Total Earnings */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
                      <TrendingUp className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      +₹1,240
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-1">Total Earnings</p>
                  <p className="text-3xl font-mono font-bold text-white">
                    ₹{earnings.toFixed(2)} <span className="text-base font-normal text-white/50">this month</span>
                  </p>
                </CardContent>
              </Card>

              {/* Grid Savings */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                      <Zap className="h-6 w-6 text-yellow-400" />
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      +28%
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-1">Grid Savings</p>
                  <p className="text-3xl font-mono font-bold text-white">
                    ₹{gridSavings.toFixed(1)} <span className="text-base font-normal text-white/50">vs grid prices</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Selling Price Card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Selling Price</h3>
                    <p className="text-sm text-white/50">Set your electricity rate</p>
                  </div>
                </div>

                {/* Price Input */}
                <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="text-2xl text-white/40">₹</span>
                  <span className="text-3xl font-mono font-bold text-white">{sellingPrice[0].toFixed(2)}</span>
                  <span className="text-white/50">/kWh</span>
                </div>

                {/* Price Slider */}
                <div className="mb-6">
                  <Slider
                    value={sellingPrice}
                    onValueChange={setSellingPrice}
                    max={20}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="mt-2 flex justify-between text-sm text-white/40">
                    <span>₹0</span>
                    <span>₹10</span>
                    <span>₹20</span>
                  </div>
                </div>

                {/* Grid Price Comparison */}
                <div className="mb-6 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm text-white/50">Grid Price</p>
                    <p className="text-lg font-mono font-semibold text-white">₹8.50/kWh</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
                    Competitive
                  </span>
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSavePrice}
                  className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-6"
                >
                  <Check className="h-5 w-5" />
                  Save Price
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
