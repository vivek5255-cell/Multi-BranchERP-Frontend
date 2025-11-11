// // src/pages/Login.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import "../styles/login.css";

// const OWNER_EMAIL = "owner@erp.com";
// const OWNER_PASSWORD = "owner123";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState(OWNER_EMAIL);
//   const [password, setPassword] = useState(OWNER_PASSWORD);
//   const [busy, setBusy] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setBusy(true);

//     if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
//       localStorage.setItem("isAuthenticated", "true");
//       navigate("/dashboard");
//     } else {
//       Swal.fire("Error", "Invalid email or password", "error");
//     }

//     setBusy(false);
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h1 className="login-title">ERP Login</h1>

//         <form onSubmit={handleLogin}>
//           <label className="form-label">Email</label>
//           <input
//             className="form-input"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label className="form-label" style={{ marginTop: "12px" }}>
//             Password
//           </label>
//           <input
//             className="form-input"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button className="login-btn" type="submit" disabled={busy}>
//             {busy ? "Please wait…" : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }










import { useState } from "react";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const OWNER_EMAIL = "owner@erp.com";
  const OWNER_PASSWORD = "owner123";

  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState(OWNER_PASSWORD);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
      onLogin(email, password);
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>Welcome to ERP System</h1>
        <p>
          Manage branches, vendors, stock transfers, invoices and purchase orders 
          — all from one unified dashboard.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">User Login</h2>

          <form onSubmit={handleSubmit}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" type="submit">
              Login
            </button>

            {error && <div className="error-text">{error}</div>}
          </form>
        </div>
      </div>

    </div>
  );
}


