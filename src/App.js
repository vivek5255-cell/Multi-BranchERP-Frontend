
// // import React, { useState, useEffect } from "react";
// // import Navbar from "./components/Navbar";
// // import Sidebar from "./components/Sidebar";
// // import "./styles/dashboard.css";
// // import AlertBox from "./components/AlertBox";

// // /* ===== Pages ===== */
// // import Login from "./pages/Login";
// // import Dashboard from "./pages/Dashboard";
// // import Products from "./pages/Products";
// // import Vendors from "./pages/Vendors";
// // import Branches from "./pages/Branches";
// // import PurchaseOrder from "./pages/PurchaseOrder";
// // import GRN from "./pages/GRN";
// // import Invoice from "./pages/Invoice";
// // import StockTransfer from "./pages/StockTransfer";
// // import Reports from "./pages/Reports";

// // function App() {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [currentPage, setCurrentPage] = useState("dashboard");
// //   const [showAlert, setShowAlert] = useState(false);
// //   const [user, setUser] = useState(null);

// //   // ✅ Check login status on load
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) setUser({ name: "Admin" });
// //   }, []);

// //   // ✅ Handle logout
// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     setUser(null);
// //   };

// //   // ✅ Handle login success (from Login.jsx)
// //   const handleLogin = (userData) => {
// //     localStorage.setItem("token", "dummy-token");
// //     setUser(userData);
// //     setShowAlert(true);
// //     setTimeout(() => setShowAlert(false), 2500);
// //   };

// //   // ✅ Page routing logic
// //   const renderPage = () => {
// //     switch (currentPage) {
// //       case "dashboard":
// //         return <Dashboard />;
// //       case "products":
// //         return <Products />;
// //       case "vendors":
// //         return <Vendors />;
// //       case "branches":
// //         return <Branches />;
// //       case "purchase":
// //         return <PurchaseOrder />;
// //       case "grn":
// //         return <GRN />;
// //       case "invoice":
// //         return <Invoice />;
// //       case "transfer":
// //         return <StockTransfer />;
// //       case "reports":
// //         return <Reports />;
// //       default:
// //         return <Dashboard />;
// //     }
// //   };

// //   /* ========== Show login page if not logged in ========== */
// //   if (!user) {
// //     return <Login onLogin={handleLogin} />;
// //   }

// //   /* ========== Otherwise show ERP dashboard layout ========== */
// //   return (
// //     <div className="app-shell">
// //       <Navbar
// //         user={user}
// //         onLogout={handleLogout}
// //         onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
// //       />

// //       <div className="app-body">
// //         <Sidebar
// //           isOpen={sidebarOpen}
// //           onClose={() => setSidebarOpen(false)}
// //           onNavigate={(page) => {
// //             setCurrentPage(page);
// //             setSidebarOpen(false);
// //           }}
// //         />

// //         <main className="dashboard-content">{renderPage()}</main>
// //       </div>

// //       {showAlert && (
// //         <AlertBox
// //           type="success"
// //           message="Login successful! Welcome back 👋"
// //           onClose={() => setShowAlert(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // export default App;


// // src/App.js
// import React, { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
// import AlertBox from "./components/AlertBox";
// import "./styles/dashboard.css";

// /* ===== Pages ===== */
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Products from "./pages/Products";
// import Vendors from "./pages/Vendors";
// import Branches from "./pages/Branches";
// import PurchaseOrder from "./pages/PurchaseOrder";
// import GRN from "./pages/GRN";
// import Invoice from "./pages/Invoice";
// import StockTransfer from "./pages/StockTransfer";
// import Reports from "./pages/Reports";

// /* ===== Services ===== */
// import { login as loginService, logout as logoutService } from "./services/authService";

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [user, setUser] = useState(null);
//   const [showAlert, setShowAlert] = useState({ visible: false, message: "", type: "" });

//   // ✅ Check login status on app load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setUser({ name: "Admin" }); // mock user
//   }, []);

//   // ✅ Handle login
//   const handleLogin = async (email, password) => {
//     try {
//       const res = await loginService(email, password);
//       setUser({ name: res.user?.name || "Admin" });
//       setShowAlert({ visible: true, message: "Login successful! 🎉", type: "success" });
//       setTimeout(() => setShowAlert({ visible: false }), 2500);
//     } catch (err) {
//       setShowAlert({ visible: true, message: "Invalid credentials!", type: "error" });
//       setTimeout(() => setShowAlert({ visible: false }), 2500);
//     }
//   };

//   // ✅ Handle logout
//   const handleLogout = () => {
//     logoutService();
//     setUser(null);
//     setCurrentPage("dashboard");
//     setShowAlert({ visible: true, message: "Logged out successfully.", type: "info" });
//     setTimeout(() => setShowAlert({ visible: false }), 2000);
//   };

//   // ✅ Page rendering logic
//   const renderPage = () => {
//     switch (currentPage) {
//       case "dashboard":
//         return <Dashboard />;
//       case "products":
//         return <Products />;
//       case "vendors":
//         return <Vendors />;
//       case "branches":
//         return <Branches />;
//       case "purchase":
//         return <PurchaseOrder />;
//       case "grn":
//         return <GRN />;
//       case "invoice":
//         return <Invoice />;
//       case "transfer":
//         return <StockTransfer />;
//       case "reports":
//         return <Reports />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   /* ===== Show Login Page if Not Authenticated ===== */
//   if (!user) {
//     return <Login onLogin={handleLogin} />;
//   }

//   /* ===== Otherwise Show ERP Layout ===== */
//   return (
//     <div className="app-shell">
//       <Navbar
//         user={user}
//         onLogout={handleLogout}
//         onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//       />

//       <div className="app-body">
//         <Sidebar
//           isOpen={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//           onNavigate={(page) => {
//             setCurrentPage(page);
//             setSidebarOpen(false);
//           }}
//         />

//         <main className="dashboard-content">{renderPage()}</main>
//       </div>

//       {showAlert.visible && (
//         <AlertBox
//           type={showAlert.type}
//           message={showAlert.message}
//           onClose={() => setShowAlert({ visible: false })}
//         />
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AlertBox from "./components/AlertBox";
import "./styles/dashboard.css";

/* ===== Pages ===== */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Vendors from "./pages/Vendors";
import Branches from "./pages/Branches";
import PurchaseOrder from "./pages/PurchaseOrder";
import GRN from "./pages/GRN";
import Invoice from "./pages/Invoice";
import StockTransfer from "./pages/StockTransfer";
import Reports from "./pages/Reports";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState({ visible: false, message: "", type: "" });

  /* ✅ Check login status on page load */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "Owner" });
    }
  }, []);

  /* ✅ Login handler (fixed credentials) */
  const handleLogin = (email, password) => {
    if (email === "owner@erp.com" && password === "owner123") {
      localStorage.setItem("token", "dummy-token");
      setUser({ name: "Owner" });

      setShowAlert({ visible: true, message: "Login successful! 🎉", type: "success" });
      setTimeout(() => setShowAlert({ visible: false }), 2000);
    } else {
      setShowAlert({ visible: true, message: "Invalid email or password!", type: "error" });
      setTimeout(() => setShowAlert({ visible: false }), 2000);
    }
  };

  /* ✅ Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCurrentPage("dashboard");

    setShowAlert({ visible: true, message: "Logged out successfully.", type: "info" });
    setTimeout(() => setShowAlert({ visible: false }), 2000);
  };

  /* ✅ Page router (manual routing) */
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "vendors":
        return <Vendors />;
      case "branches":
        return <Branches />;
      case "purchase":
        return <PurchaseOrder />;
      case "grn":
        return <GRN />;
      case "invoice":
        return <Invoice />;
      case "transfer":
        return <StockTransfer />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  /* ✅ If NOT logged in → only show the login screen */
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  /* ✅ If logged in → show full ERP layout */
  return (
    <div className="app-shell">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={(page) => {
            setCurrentPage(page);
            setSidebarOpen(false);
          }}
        />

        <main className="dashboard-content">{renderPage()}</main>
      </div>

      {showAlert.visible && (
        <AlertBox
          type={showAlert.type}
          message={showAlert.message}
          onClose={() => setShowAlert({ visible: false })}
        />
      )}
    </div>
  );
}

export default App;

