import api from "./axios";

export const getUserProfile = () => {
  const token = localStorage.getItem("token");

  return api.get("/api/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
};
