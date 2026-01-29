// src/dashboard.js
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const token = localStorage.getItem("token");
if (!token) window.location.href = "/login.html";

fetch("http://localhost:8080/api/dashboard", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  document.getElementById("house").innerText = data.message;
});

document.getElementById("logout").onclick = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
  window.location.href = "/login.html";
};
