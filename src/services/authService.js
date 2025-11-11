// // src/services/authService.js
// import api from "./api";

// // ✅ Login (POST /auth/login)
// export async function login(email, password) {
//   const res = await api.post("/auth/login", { email, password });
//   // Save token if returned by backend
//   if (res.data.token) {
//     localStorage.setItem("token", res.data.token);
//   }
//   return res.data;
// }

// // ✅ Logout
// export function logout() {
//   localStorage.removeItem("token");
// }

// // ✅ Get current user (optional endpoint)
// export async function getCurrentUser() {
//   const res = await api.get("/auth/me");
//   return res.data;
// }


// src/services/authService.js
// import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

// const OWNER_EMAIL = "owner@erp.com";
// const OWNER_PASS  = "Owner@123";

// export async function login(email, password) {
//   // ✅ fixed owner login
//   if (email.toLowerCase() === OWNER_EMAIL && password === OWNER_PASS) {
//     const token = "owner-demo-token";
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify({ name: "Owner", role: "OWNER", email }));
//     return { success: true, user: { name: "Owner", role: "OWNER", email } };
//   }

//   // otherwise try backend
//   try {
//     const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
//     const { token, user } = res.data || {};
//     if (!token) throw new Error("Invalid response from server.");
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user || { name: "User", email }));
//     return { success: true, user: user || { name: "User", email } };
//   } catch (err) {
//     const msg =
//       err?.response?.data?.message ||
//       err?.message ||
//       "Login failed.";
//     return { success: false, message: msg };
//   }
// }

// export function logout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// }


// src/services/authService.js
const OWNER_EMAIL = "owner@erp.com";
const OWNER_PASSWORD = "owner@123"; // change to whatever you want

export async function login(email, password) {
  // fixed owner credentials
  if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
    const token = "demo-owner-token";
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ name: "Owner" }));
    return { user: { name: "Owner" }, token };
  }
  // if you later wire backend, do axios.post here instead.
  throw new Error("Invalid credentials");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}
