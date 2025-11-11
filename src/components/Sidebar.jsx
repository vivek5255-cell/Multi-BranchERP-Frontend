import React, { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const [active, setActive] = useState("dashboard");

  const handleClick = (page) => {
    setActive(page);
    if (onNavigate) onNavigate(page);
    if (window.innerWidth < 768) onClose(); // auto-close on mobile
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <ul className="sidebar-menu">
        <li
          className={active === "dashboard" ? "active" : ""}
          onClick={() => handleClick("dashboard")}
        >
          📊 Dashboard
        </li>
        <li
          className={active === "products" ? "active" : ""}
          onClick={() => handleClick("products")}
        >
          📦 Products
        </li>
        <li
          className={active === "vendors" ? "active" : ""}
          onClick={() => handleClick("vendors")}
        >
          🏭 Vendors
        </li>
        <li
          className={active === "branches" ? "active" : ""}
          onClick={() => handleClick("branches")}
        >
          🏢 Branches
        </li>
        <li
          className={active === "purchase" ? "active" : ""}
          onClick={() => handleClick("purchase")}
        >
          🧾 Purchase Orders
        </li>
        <li
          className={active === "grn" ? "active" : ""}
          onClick={() => handleClick("grn")}
        >
          📥 GRN
        </li>
        <li
          className={active === "invoice" ? "active" : ""}
          onClick={() => handleClick("invoice")}
        >
          💰 Invoice
        </li>
        <li
          className={active === "transfer" ? "active" : ""}
          onClick={() => handleClick("transfer")}
        >
          🔄 Stock Transfer
        </li>
        <li
          className={active === "reports" ? "active" : ""}
          onClick={() => handleClick("reports")}
        >
          📑 Reports
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
