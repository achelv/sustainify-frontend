import { useState } from "react";
import { LockClosedIcon } from "../../components/icons/Icon";

const API_URL = "https://api.sustainafy.com/v1/auth/login";

export default function LoginAdmin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    const { username, password } = form;

    if (!username || !password) {
      setAlert({ msg: "Harap isi username dan password.", type: "error" });
      return;
    }

    setLoading(true);
    setAlert({ msg: "", type: "" });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ msg: "Login berhasil! Mengalihkan...", type: "success" });
      } else {
        setAlert({ msg: data.message || "Username atau password salah.", type: "error" });
      }
    } catch (err) {
      setAlert({ msg: "Tidak dapat terhubung ke server.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.pageBg}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>S</div>
          <div style={styles.brandTitle}>Sustainafy</div>
          <div style={styles.brandSub}>Masuk ke panel admin</div>
        </div>

        {/* Alert */}
        {alert.msg && (
          <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>
            {alert.msg}
          </div>
        )}

        {/* Username */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="username">Username</label>
          <input
            style={styles.inp}
            type="text"
            id="username"
            placeholder="Masukkan username"
            value={form.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password">Password</label>
          <div style={styles.inpWrap}>
            <input
              style={{ ...styles.inp, paddingRight: 38 }}
              type="password"
              id="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
            <span style={styles.inpIcon}>
              <LockClosedIcon style={{ width: 17, height: 17, color: "#aaa" }} />
            </span>
          </div>
        </div>

        {/* Tombol Masuk */}
        <button
          style={loading ? { ...styles.btnSubmit, ...styles.btnDisabled } : styles.btnSubmit}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

      </div>
    </div>
  );
}

const styles = {
  pageBg: {
    minHeight: "100vh",
    background: "#e8f0e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: "2rem 2rem 2.5rem",
    width: "100%",
    maxWidth: 400,
  },
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    background: "#2a6a3f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 700,
    color: "white",
    marginBottom: "0.75rem",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#2a6a3f",
    marginBottom: 4,
  },
  brandSub: {
    fontSize: 14,
    color: "#888",
  },
  alertError: {
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: "1rem",
    background: "#fde8e8",
    color: "#a32d2d",
    border: "1px solid #f09595",
  },
  alertSuccess: {
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: "1rem",
    background: "#eaf3de",
    color: "#27500a",
    border: "1px solid #97c459",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
  },
  inpWrap: {
    position: "relative",
  },
  inp: {
    width: "100%",
    height: 48,
    border: "1.5px solid #dde3dd",
    borderRadius: 10,
    padding: "0 14px",
    fontSize: 14,
    color: "#333",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
  },
  inpIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 6,
  },
  hintStrong: {
    color: "#2a6a3f",
    fontWeight: 600,
  },
  btnSubmit: {
    width: "100%",
    height: 52,
    background: "#2a6a3f",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  btnDisabled: {
    background: "#7aaa8a",
    cursor: "not-allowed",
  },
};