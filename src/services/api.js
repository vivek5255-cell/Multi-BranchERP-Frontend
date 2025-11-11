// // src/services/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api", // ← no trailing slash
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;


// // Single axios instance used everywhere
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080/api",
//   withCredentials: true, // matches your CORS config
// });

// export default api;


// Central axios instance: respects either .env base or CRA dev proxy
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE?.replace(/\/+$/, "") || "/api"; // default to /api so CRA proxy works

const api = axios.create({
  baseURL, // e.g. http://localhost:8080/api
  headers: { "Accept": "application/json" }
});

export default api;

