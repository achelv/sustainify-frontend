import { useState } from "react";

const DUMMY_EMAIL = "raina@sustainify.com";
const DUMMY_PASSWORD = "123456";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Email atau password salah.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#eaf3ee",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "48px 40px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: "400px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", background: "#166534", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <span style={{ color: "#fff", fontSize: "22px", fontWeight: 900 }}>S</span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#14532d" }}>Sustainafy</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Masuk ke akun Anda</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Email</label>
          <input
            type="email"
            placeholder="raina@sustainafy.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
            onFocus={e => e.target.style.borderColor = "#166534"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
            onFocus={e => e.target.style.borderColor = "#166534"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Hint */}
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "24px" }}>
        Gunakan: <strong>Email yang terdaftar & Password</strong> 
        </p>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: "13px", borderRadius: "12px", background: "#166534", border: "none", color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
          onMouseLeave={e => e.currentTarget.style.background = "#166534"}
        >
          Masuk
        </button>
      </div>
    </div>
  );
};

export default LoginPage;