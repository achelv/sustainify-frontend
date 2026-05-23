import { useState } from "react";
import { LockClosedIcon } from "../../components/icons/Icon";
// Sesuaikan path import icon dengan struktur project kamu:
// import { LockClosedIcon } from "icons/Icon";

import api from "../../api";

function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, password, confirm } = form;

    if (!name || !email || !password || !confirm) {
      setAlert({ msg: "Harap isi semua field terlebih dahulu.", type: "error" });
      return;
    }
    if (password !== confirm) {
      setAlert({ msg: "Password dan konfirmasi password tidak cocok.", type: "error" });
      return;
    }

    setLoading(true);
    setAlert({ msg: "", type: "" });

    try {
      const response = await api.post("/register", {
        name,
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setAlert({ msg: "Pendaftaran berhasil! Masuk ke sistem...", type: "success" });
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess();
          } else {
            window.location.reload();
          }
        }, 1500);
      } else {
        setAlert({ msg: response.data.message || "Pendaftaran gagal. Coba lagi.", type: "error" });
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      let errorMsg = err.response?.data?.message || "Tidak dapat terhubung ke server.";
      
      if (errors) {
        // If there are detailed validation errors, display the first one
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey && errors[firstErrorKey][0]) {
          errorMsg = errors[firstErrorKey][0];
        }
      }
      setAlert({ msg: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBg}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>S</div>
          <div style={styles.brandTitle}>Sustainafy</div>
          <div style={styles.brandSub}>Buat akun baru Anda</div>
        </div>

        {/* Alert */}
        {alert.msg && (
          <div style={alert.type === "error" ? styles.alertError : styles.alertSuccess}>
            {alert.msg}
          </div>
        )}

        {/* Nama Lengkap */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="name">Nama Lengkap</label>
          <input
            style={styles.inp}
            type="text"
            id="name"
            placeholder="Masukkan nama lengkap Anda"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            style={styles.inp}
            type="email"
            id="email"
            placeholder="nama@sustainafy.com"
            value={form.email}
            onChange={handleChange}
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
              placeholder="Buat password"
              value={form.password}
              onChange={handleChange}
            />
            <span style={styles.inpIcon}>
              <LockClosedIcon style={{ width: 17, height: 17 }} />
            </span>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="confirm">Konfirmasi Password</label>
          <div style={styles.inpWrap}>
            <input
              style={{ ...styles.inp, paddingRight: 38 }}
              type="password"
              id="confirm"
              placeholder="Ulangi password Anda"
              value={form.confirm}
              onChange={handleChange}
            />
            <span style={styles.inpIcon}>
              <LockClosedIcon style={{ width: 17, height: 17 }} />
            </span>
          </div>
        </div>

        {/* Tombol Daftar */}
        <button
          style={loading ? { ...styles.btnSubmit, ...styles.btnDisabled } : styles.btnSubmit}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>

        {/* Link Login */}
        <div style={styles.loginLink}>
          Sudah punya akun?{" "}
          <a href="/login" style={styles.loginAnchor}>Masuk di sini</a>
        </div>

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
    maxWidth: 420,
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
    color: "#aaa",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
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
  loginLink: {
    textAlign: "center",
    marginTop: "1.25rem",
    fontSize: 13,
    color: "#888",
  },
  loginAnchor: {
    color: "#2a6a3f",
    fontWeight: 600,
    textDecoration: "none",
  },
};
export default Register;