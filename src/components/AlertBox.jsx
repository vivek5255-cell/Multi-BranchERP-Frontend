import React, { useEffect } from "react";
import "../styles/alertbox.css";

const AlertBox = ({ type = "info", message = "", onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 3000); // auto-close after 3 sec
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`alert-box ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default AlertBox;
