import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
import { signup } from "@/api/auth.api";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
// import SocialButton from "@/components/SocialButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    latitude?: string;
    longitude?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [houseName, setHouseName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [role, setRole] = useState<"PROSUMER" | "PRODUCER" | "CONSUMER">("PROSUMER");




  // 🔁 AUTO-REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/login");
    }
  }, []);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      latitude?: string;
      longitude?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // ✅ NEW VALIDATIONS (ADD HERE)
    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    }

    if (!latitude) {
      newErrors.latitude = "Latitude is required";
    }

    if (!longitude) {
      newErrors.longitude = "Longitude is required";
    }

    // ⬇️ EXISTING VALIDATIONS (KEEP AS IS)
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await signup({
        email,
        password,
        name,
        role,
        phone,
        meterNumber,
        houseName,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });


      const { uid } = res.data;

      localStorage.setItem("uid", uid);

      toast({
        title: "Account created!",
        description: "Welcome! Your account has been created successfully.",
      });

      navigate("/login");
        } catch (error: any) {
          toast({
            title: "Signup failed",
            description:
              error?.response?.data?.message ||
              "Unable to create account. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with your account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name} 
        />

        {/* Role Selection */}
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Select Role
          </label>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: "PROSUMER",
                title: "Prosumer",
                desc: "Buy & Sell",
              },
              {
                value: "PRODUCER",
                title: "Producer",
                desc: "Sell only",
              },
              {
                value: "CONSUMER",
                title: "Consumer",
                desc: "Buy only",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRole(item.value as any)}
                className={`rounded-xl border px-4 py-3 text-left transition-all
                  ${
                    role === item.value
                      ? "border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <p className="text-sm font-semibold text-white">
                  {item.title}
                </p>
                <p className="text-xs text-white/50">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <p className="text-xs text-white/40">
            Choose how you want to participate in the energy network
          </p>
        </div>

        <AuthInput
          label="House Name"
          type="text"
          placeholder="Enter house name"
          value={houseName}
          onChange={(e) => setHouseName(e.target.value)}
          // error={errors.houseName}
        />

        <AuthInput
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />

        <AuthInput
          label="Meter Number"
          placeholder="Enter your electricity meter number"
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
        />

        <AuthInput
          label="Latitude"
          type="number"
          placeholder="e.g. 12.9716"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          error={errors.latitude}
        />

        <AuthInput
          label="Longitude"
          type="number"
          placeholder="e.g. 77.5946"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          error={errors.longitude}
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary/20"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </span>
        </div>

        <Button
          type="submit"
          className="w-full py-6 text-base font-semibold rounded-xl"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SocialButton icon="google">
            Google
          </SocialButton>
          <SocialButton icon="apple">
            Apple
          </SocialButton>
        </div> */}

        <p className="text-center text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
