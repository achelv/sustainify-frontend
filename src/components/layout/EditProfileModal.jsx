import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── EditProfileModal ─────────────────────────────────────────────────────────
/**
 * Props:
 *   adminData  – { name: string, email: string }
 *   onSave     – (updatedData) => void
 *   onClose    – () => void
 */
const EditProfileModal = ({ adminData, onSave, onClose }) => {
  const [form, setForm] = useState({ name: adminData?.name ?? "", email: adminData?.email ?? "", password: "" });
  const [hovering, setHovering] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #d1fae5", background: "#f0fdf4", color: "#14532d",
    fontSize: "13.5px", fontFamily: "inherit", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };
  const labelStyle = {
    fontSize: "11px", fontWeight: 700, color: "#166534",
    textTransform: "uppercase", letterSpacing: "0.9px",
    marginBottom: "5px", display: "block",
  };

  const handleSave = () => {
    const { password, ...rest } = form;
    onSave(rest);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)",
          zIndex: 200, backdropFilter: "blur(3px)", animation: "epFadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "400px", maxWidth: "calc(100vw - 32px)",
        background: "#ffffff", borderRadius: "20px",
        zIndex: 201, boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
        animation: "epSlideUp 0.25s ease", overflow: "hidden",
      }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
          padding: "22px 22px 18px", position: "relative",
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "14px", right: "14px",
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "8px", width: "32px", height: "32px",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#fff",
            }}
          >
            <CloseIcon />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Avatar */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <div style={{
                width: "62px", height: "62px", borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                border: "3px solid rgba(255,255,255,0.38)",
                display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                overflow: "hidden", color: "#fff",
              }}>
                <UserIcon size={28} />
              </div>
              {hovering && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "rgba(0,0,0,0.48)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#fff",
                }}>
                  <CameraIcon />
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>{form.name || "—"}</div>
              <div style={{ fontSize: "11.5px", color: "#a7f3d0", marginTop: "2px" }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* ── Form Body ──────────────────────────────────────────── */}
        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Nama */}
          <div>
            <label style={labelStyle}>Nama Lengkap</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              onFocus={e => e.target.style.borderColor = "#16a34a"}
              onBlur={e => e.target.style.borderColor = "#d1fae5"}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={e => e.target.style.borderColor = "#16a34a"}
              onBlur={e => e.target.style.borderColor = "#d1fae5"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>
              Password Baru&nbsp;
              <span style={{ color: "#9ca3af", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                (opsional)
              </span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: "42px" }}
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#16a34a"}
                onBlur={e => e.target.style.borderColor = "#d1fae5"}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#6ee7b7", display: "flex", padding: 0,
                }}
              >
                <EyeIcon off={showPw} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "11px", borderRadius: "12px",
                border: "1.5px solid #d1fae5", background: "#fff",
                color: "#166534", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 2, padding: "11px", borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #15803d, #166534)",
                color: "#fff", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}
            >
              <SaveIcon /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes epFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes epSlideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 14px)) }
          to   { opacity: 1; transform: translate(-50%, -50%) }
        }
      `}</style>
    </>
  );
};

export default EditProfileModal;