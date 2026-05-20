import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

// ─── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 0 .5-4" />
    <polyline points="3 3 3 7 7 7" />
  </svg>
);
const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// ─── Nav Config ───────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard",       label: "Overview",           icon: <HomeIcon />,    section: "Dashboard" },
  { id: "manajemen-user",  label: "Manajemen User",     icon: <UsersIcon />,   section: "Menu" },
  { id: "riwayat-karbon",  label: "Riwayat Data Karbon",icon: <HistoryIcon />, section: "Menu" },
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const Tooltip = ({ label, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", left: "calc(100% + 12px)", top: "50%",
          transform: "translateY(-50%)", background: "#1a1a1a", color: "#f0fdf4",
          fontSize: "12px", fontWeight: 500, padding: "6px 10px", borderRadius: "8px",
          whiteSpace: "nowrap", pointerEvents: "none", zIndex: 100,
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          {label}
          <div style={{
            position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)",
            border: "5px solid transparent", borderRightColor: "#1a1a1a",
          }} />
        </div>
      )}
    </div>
  );
};

// ─── SidebarAdmin ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   activeMenu        – string
 *   onMenuChange      – (id: string) => void
 *   onLogout          – () => void
 *   adminName         – string  (default "Admin Sustainify")
 *   collapsed         – boolean (controlled from parent)
 *   onToggleCollapse  – () => void
 */
const SidebarAdmin = ({
  activeMenu = "dashboard",
  onMenuChange = () => {},
  onLogout = () => {},
  adminName = "Admin Sustainify",
  collapsed = false,
  onToggleCollapse = () => {},
}) => {
  const setCollapsed = onToggleCollapse; // alias for readability
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [adminData, setAdminData]   = useState({
    name:  adminName,
    email: "admin@sustainify.id",
  });

  const W          = collapsed ? "68px" : "240px";
  const TRANSITION = "width 0.28s cubic-bezier(0.4,0,0.2,1)";

  const btnBase = (isActive) => ({
    display: "flex", alignItems: "center",
    gap: collapsed ? 0 : "10px",
    width: "100%",
    padding: collapsed ? "11px" : "10px 12px",
    borderRadius: "12px", border: "none", cursor: "pointer",
    fontSize: "13px", fontFamily: "inherit",
    textAlign: "left", lineHeight: 1.4,
    justifyContent: collapsed ? "center" : "flex-start",
    background: isActive ? "#ffffff" : "transparent",
    color: isActive ? "#14532d" : "#d1fae5",
    fontWeight: isActive ? 700 : 500,
    marginBottom: "2px",
    transition: "background 0.15s, color 0.15s",
  });

  const SectionLabel = ({ text }) =>
    collapsed ? null : (
      <div style={{
        fontSize: "10px", fontWeight: 700, color: "#6ee7b7",
        textTransform: "uppercase", letterSpacing: "1.5px",
        padding: "0 10px", marginBottom: "6px",
        whiteSpace: "nowrap", overflow: "hidden",
      }}>
        {text}
      </div>
    );

  const NavBtn = ({ item }) => {
    const isActive = activeMenu === item.id;
    const [hov, setHov] = useState(false);
    const btn = (
      <button
        onClick={() => onMenuChange(item.id)}
        style={{ ...btnBase(isActive), background: isActive ? "#ffffff" : hov ? "#166534" : "transparent" }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <span style={{ flexShrink: 0, display: "flex" }}>{item.icon}</span>
        {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
      </button>
    );
    return collapsed ? <Tooltip label={item.label}>{btn}</Tooltip> : btn;
  };

  return (
    <>
      <aside style={{
        width: W, minHeight: "100vh", background: "#14532d",
        display: "flex", flexDirection: "column", padding: "20px 10px",
        position: "fixed", left: 0, top: 0, zIndex: 30,
        overflowX: "hidden", overflowY: "auto",
        transition: TRANSITION, boxSizing: "border-box",
      }}>

        {/* Logo + toggle */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "0 4px", marginBottom: "6px", gap: "8px",
        }}>
          {!collapsed && (
            <span style={{ fontSize: "19px", fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
              Sustainify
            </span>
          )}
          <button
            onClick={() => { onToggleCollapse(); setProfileOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "9px",
              width: "34px", height: "34px", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", color: "#d1fae5", flexShrink: 0,
            }}
          >
            <MenuIcon />
          </button>
        </div>

        <div style={{ height: "2px", background: "#166534", borderRadius: "2px", margin: "0 4px 18px" }} />

        {/* Dashboard */}
        <SectionLabel text="Dashboard" />
        <NavBtn item={navItems[0]} />

        {/* Menu */}
        <div style={{ marginTop: "14px", marginBottom: "6px" }}>
          <SectionLabel text="Menu" />
        </div>
        <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {navItems.slice(1).map(item => <NavBtn key={item.id} item={item} />)}
        </nav>

        {/* Profile & Logout */}
        <div style={{ marginTop: "16px", borderTop: "1px solid #166534", paddingTop: "14px" }}>

          {collapsed ? (
            /* Icon-only: click avatar → open modal */
            <Tooltip label={adminData.name}>
              <button
                onClick={() => setEditOpen(true)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "100%", padding: "10px", borderRadius: "12px", border: "none",
                  cursor: "pointer", background: "rgba(255,255,255,0.08)", marginBottom: "6px",
                }}
              >
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", color: "#fff",
                }}>
                  <UserIcon size={16} />
                </div>
              </button>
            </Tooltip>
          ) : (
            <>
              {/* Profile row */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px", width: "100%",
                  padding: "10px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: profileOpen ? "rgba(255,255,255,0.1)" : "transparent",
                  marginBottom: "4px",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#166534"}
                onMouseLeave={e => e.currentTarget.style.background = profileOpen ? "rgba(255,255,255,0.1)" : "transparent"}
              >
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "#fff",
                }}>
                  <UserIcon size={16} />
                </div>
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "13px", fontWeight: 600, color: "#fff",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {adminData.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6ee7b7" }}>Administrator</div>
                </div>
                <ChevronIcon open={profileOpen} />
              </button>

              {/* Dropdown: Edit Profile */}
              {profileOpen && (
                <button
                  onClick={() => { setEditOpen(true); setProfileOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", width: "100%",
                    padding: "8px 12px 8px 32px", borderRadius: "10px", border: "none",
                    cursor: "pointer", fontSize: "12.5px", fontFamily: "inherit",
                    textAlign: "left", background: "transparent", color: "#a7f3d0", marginBottom: "4px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <EditIcon />
                  Edit Profile
                </button>
              )}
            </>
          )}

          {/* Logout */}
          {collapsed ? (
            <Tooltip label="Logout">
              <button
                onClick={onLogout}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "100%", padding: "10px", borderRadius: "12px",
                  border: "none", cursor: "pointer", background: "transparent", color: "#fca5a5",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <LogoutIcon />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={onLogout}
              style={{
                display: "flex", alignItems: "center", gap: "10px", width: "100%",
                padding: "10px 12px", borderRadius: "12px", border: "none", cursor: "pointer",
                fontSize: "13px", fontFamily: "inherit", textAlign: "left",
                background: "transparent", color: "#fca5a5", fontWeight: 500,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <LogoutIcon />
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Edit Profile Modal (separate component) */}
      {editOpen && (
        <EditProfileModal
          adminData={adminData}
          onSave={(updated) => setAdminData(updated)}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarAdmin;