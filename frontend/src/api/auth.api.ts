import api from "./axios";

export const signup = (data: {
  email: string;
  password: string;
  name: string;
  role: string;

  // 🔽 NEW FIELDS ADDED FOR PROSUMER ONBOARDING
  phone: string;
  meterNumber: string;
  houseName: string;
  location: {
    latitude: number;
    longitude: number;
  };
}) => {
  return api.post("/auth/register", data);
};
