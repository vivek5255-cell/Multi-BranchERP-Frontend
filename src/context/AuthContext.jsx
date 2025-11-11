// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { login as loginService, logout as logoutService } from "../services/authService";

// // ✅ Create Context
// const AuthContext = createContext();

// // ✅ Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check localStorage token on app load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setUser({ name: "Admin" }); // replace with real user fetch later
//     }
//     setLoading(false);
//   }, []);

//   // Login
//   const login = async (email, password) => {
//     try {
//       const res = await loginService(email, password);
//       setUser({ name: res.user?.name || "Admin" });
//       return { success: true };
//     } catch (err) {
//       return { success: false, message: "Invalid credentials" };
//     }
//   };

//   // Logout
//   const logout = () => {
//     logoutService();
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
// };

// // ✅ Custom Hook for easy access
// export const useAuth = () => useContext(AuthContext);



// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginService, logout as logoutService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch { /* noop */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await loginService(email, password);
    if (res?.success) setUser(res.user || { name: "User" });
    return res;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = useMemo(() => ({
    user, login, logout, isAuthenticated: !!user, loading
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
