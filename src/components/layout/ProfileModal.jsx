import { useState } from "react";

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { name: "Raina", email: "raina@sustainify.com" };
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || payload.username || "User",
      email: payload.email || "-",
    };
  } catch {
    return { name: "Raina", email: "raina@sustainify.com" };
  }
};

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const InputField = ({ label, value, onChange, type = "text", readOnly = false, placeholder = "", rightEl = null }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{
      display: "block", fontSize: "12px", color: "#6b7280",
      fontWeight: 600, marginBottom: "6px",
      textTransform: "uppercase", letterSpacing: "0.5px",
    }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: rightEl ? "10px 40px 10px 14px" : "10px 14px",
          borderRadius: "10px",
          border: "1.5px solid #e5e7eb",
          fontSize: "14px",
          fontFamily: "inherit",
          color: readOnly ? "#9ca3af" : "#111827",
          outline: "none",
          boxSizing: "border-box",
          background: readOnly ? "#f9fafb" : "#fff",
          transition: "border-color 0.15s",
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = "#16a34a"; }}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
      />
      {rightEl && (
        <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
          {rightEl}
        </div>
      )}
    </div>
  </div>
);

const ProfileModal = ({ onClose }) => {
  const user = getUserFromToken();
  const [name, setName] = useState(user.name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Inisial dari email
  const avatarInitials = user.email.slice(0, 2).toUpperCase();

  const handleSave = () => {
    // TODO: hit API untuk simpan nama & password
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "360px",
          position: "relative",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          background: "#14532d",
          padding: "20px 24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>
            Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "8px", padding: "6px", cursor: "pointer",
              color: "#fff", display: "flex",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px", height: "16px" }}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar — inisial dari email, tanpa kamera */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 24px 8px" }}>
          <div style={{
            width: "84px", height: "84px", borderRadius: "50%",
            background: "linear-gradient(135deg, #4ade80, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: 700, color: "#fff",
            border: "3px solid #dcfce7",
            boxShadow: "0 4px 12px rgba(20,83,45,0.2)",
            userSelect: "none",
          }}>
            {avatarInitials}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#6b7280" }}>
            {user.email}
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "20px 24px 28px" }}>
          <InputField
            label="Nama Pengguna"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Masukkan nama pengguna"
          />

          <div style={{ height: "1px", background: "#f3f4f6", margin: "4px 0 16px" }} />
          <p style={{
            fontSize: "12px", fontWeight: 700, color: "#6b7280",
            textTransform: "uppercase", letterSpacing: "0.5px",
            margin: "0 0 12px",
          }}>
            Ganti Password
          </p>

          <InputField
            label="Password Lama"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            type={showOld ? "text" : "password"}
            placeholder="Masukkan password lama"
            rightEl={
              <button
                onClick={() => setShowOld(!showOld)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}
              >
                <EyeIcon open={showOld} />
              </button>
            }
          />

          <InputField
            label="Password Baru"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            type={showNew ? "text" : "password"}
            placeholder="Masukkan password baru"
            rightEl={
              <button
                onClick={() => setShowNew(!showNew)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}
              >
                <EyeIcon open={showNew} />
              </button>
            }
          />

          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: "12px", borderRadius: "12px",
              background: "#14532d", color: "#fff", border: "none",
              fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
              cursor: "pointer", transition: "background 0.15s", marginTop: "4px",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#166534"}
            onMouseLeave={e => e.currentTarget.style.background = "#14532d"}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;