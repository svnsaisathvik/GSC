import api from "./axios";

export const getDashboard = () => {
  const token = localStorage.getItem("token");

  return api.get("/api/energy/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateSellingPrice = (price: number) => {
  const token = localStorage.getItem("token");

  return api.post(
    "/api/energy/price",
    { sellingPrice: price },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
