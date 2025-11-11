// src/services/http.js
import axios from "axios";

// With CRA proxy, just hit relative '/api'
const BASE = "/api";

const http = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export default http;
