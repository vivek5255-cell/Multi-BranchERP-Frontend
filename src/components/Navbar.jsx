import React from "react";
import "../styles/navbar.css";

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <nav className="navbar">
      {/* Sidebar Toggle Button (for mobile) */}
      <button className="menu-btn" onClick={onToggleSidebar}>
        ☰
      </button>

      {/* Logo / App Title */}
      <div className="navbar-brand">
        <span className="brand-highlight">ERP</span> Dashboard
      </div>

      {/* Right Side - User Info */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">👤 {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="navbar-user">Guest</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
