import { useState, useEffect, useRef } from "react";
import { HomeIcon, CalculatorIcon, HistoryIcon, LeafIcon } from "../icons/Icon";

const iconMap = {
  home: HomeIcon,
  calculator: CalculatorIcon,
  history: HistoryIcon,
  leaf: LeafIcon,
};

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { name: "Raina", email: "Raina@sustainify.com" };
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || payload.username || "User",
      email: payload.email || "-",
    };
  } catch {
    return { name: "Raina", email: "Raina@sustainify.com" };
  }
};

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 240;

const Sidebar = ({ activeMenu, onMenuChange, navItems, onAddAccount, onLogout, onOpenProfile, collapsed, onCollapse }) => {
  const [openSubmenu, setOpenSubmenu] = useState(() => {
    const isEmisiActive = ["hitung-emisi", "hitung-transportasi", "hitung-rumah-tangga"].includes(activeMenu);
    return isEmisiActive ? "hitung-emisi" : null;
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [tooltip, setTooltip] = useState(null); // { label, y }
  const dropdownRef = useRef(null);
  const user = getUserFromToken();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When collapsing, close any open submenu & dropdown
  useEffect(() => {
    if (collapsed) {
      setOpenSubmenu(null);
      setShowUserDropdown(false);
    }
  }, [collapsed]);

  const normalizeLabel = (label) => (label === "Dashboard" ? "Overview" : label);

  const getBtnStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: collapsed ? 0 : "10px",
    width: "100%",
    padding: collapsed ? "10px 0" : "10px 14px",
    justifyContent: collapsed ? "center" : "flex-start",
    borderRadius: "12px",
    border: isActive ? "2px solid #4ade8066" : "2px solid transparent",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "inherit",
    textAlign: "left",
    lineHeight: 1.4,
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    color: "#ffffff",
    fontWeight: isActive ? 700 : 500,
    marginBottom: "2px",
    transition: "background 0.15s, padding 0.25s",
    position: "relative",
  });

  const getSubmenuBtnStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: "8px", width: "100%",
    padding: "8px 12px 8px 38px", borderRadius: "10px", border: "none",
    cursor: "pointer", fontSize: "12px", fontFamily: "inherit", textAlign: "left",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    color: isActive ? "#ffffff" : "#a7f3d0",
    fontWeight: isActive ? 600 : 400, marginBottom: "2px",
    transition: "background 0.15s",
  });

  const handleNavClick = (item) => {
    if (collapsed) {
      // In collapsed mode, expand first, then navigate
      onCollapse(false);
      onMenuChange(item.id);
      return;
    }
    if (item.submenu) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
      onMenuChange(item.id);
    } else {
      setOpenSubmenu(null);
      onMenuChange(item.id);
    }
  };

  const ecoItem = navItems.find((item) => item.id === "eco-mingguan");
  const mainItems = navItems.filter((item) => item.id !== "eco-mingguan");

  const renderTooltip = () =>
    collapsed && tooltip ? (
      <div style={{
        position: "fixed",
        left: `${COLLAPSED_WIDTH + 8}px`,
        top: `${tooltip.y}px`,
        transform: "translateY(-50%)",
        background: "#14532d",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 600,
        padding: "6px 10px",
        borderRadius: "8px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        {tooltip.label}
        {/* Arrow */}
        <div style={{
          position: "absolute",
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: 0, height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderRight: "5px solid #14532d",
        }} />
      </div>
    ) : null;
// 1. TARUH KODENYA DI SINI (Tepat sebelum return utama)
  if (window.location.pathname === "/" || window.location.pathname === "/login") {
    return null;
  }

  return (
    <>
      <style>{`
        .sfy-sidebar {
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .sfy-label {
          transition: opacity 0.15s, width 0.25s;
          overflow: hidden;
          white-space: nowrap;
        }
        .sfy-nav-btn:hover { background: #166534 !important; }
      `}</style>

      {renderTooltip()}

      <aside
  className="sfy-sidebar"
  style={{
    width: `${collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}px`,
    minHeight: "100vh",
    background: "#14532d",
    display: "flex",
    flexDirection: "column",
    padding: collapsed ? "28px 10px 20px" : "28px 16px 20px",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 30,
    overflowY: "auto",
    overflowX: "hidden",
    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",  // ← tambah ini juga biar smooth
  }}
      >

        {/* Logo + Toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? 0 : "0 4px",
          marginBottom: "20px",
          gap: "8px",
        }}>
          {!collapsed && (
            <span style={{
              fontSize: "22px", fontWeight: 800, color: "#fff",
              letterSpacing: "-0.5px", whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.2s",
            }}>
              Sustainify
            </span>
          )}
          {/* Toggle button */}
          <button
            onClick={() => onCollapse(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "8px",
              padding: "7px",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            {/* Chevron icon: points left when expanded, right when collapsed */}
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{
                width: "16px", height: "16px",
                transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.25s",
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Eco Mingguan */}
        {ecoItem && (() => {
          const IconComponent = iconMap[ecoItem.icon];
          const isActive = activeMenu === ecoItem.id;
          return (
            <button
              className="sfy-nav-btn"
              onClick={() => handleNavClick(ecoItem)}
              style={getBtnStyle(isActive)}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = "#166534";
                if (collapsed) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ label: normalizeLabel(ecoItem.label), y: rect.top + rect.height / 2 });
                }
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = "transparent";
                setTooltip(null);
              }}
            >
              {IconComponent && <IconComponent style={{ width: "18px", height: "18px", flexShrink: 0 }} />}
              {!collapsed && <span style={{ flex: 1 }}>{normalizeLabel(ecoItem.label)}</span>}
            </button>
          );
        })()}

        {/* Divider */}
        <div style={{ height: "1px", background: "#166534", margin: "14px 4px" }} />

        {/* "Menu" label — hidden when collapsed */}
        {!collapsed && (
          <div style={{
            fontSize: "10px", fontWeight: 700, color: "#6ee7b7",
            textTransform: "uppercase", letterSpacing: "1.5px",
            padding: "0 10px", marginBottom: "8px",
          }}>
            Menu
          </div>
        )}

        {/* Main Nav */}
        <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {mainItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            const isActive =
              activeMenu === item.id ||
              (item.submenu && item.submenu.some((s) => s.id === activeMenu));
            const isOpen = openSubmenu === item.id;

            return (
              <div key={item.id}>
                <button
                  className="sfy-nav-btn"
                  onClick={() => handleNavClick(item)}
                  style={{ ...getBtnStyle(isActive), color: "#d1fae5" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#166534";
                    if (collapsed) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ label: normalizeLabel(item.label), y: rect.top + rect.height / 2 });
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    setTooltip(null);
                  }}
                >
                  {IconComponent && <IconComponent style={{ width: "18px", height: "18px", flexShrink: 0 }} />}
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1 }}>{normalizeLabel(item.label)}</span>
                      {item.submenu && (
                        <span style={{
                          fontSize: "11px", color: "#6ee7b7",
                          display: "inline-block",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}>▾</span>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu — only show when expanded */}
                {!collapsed && item.submenu && isOpen && (
                  <div style={{ marginBottom: "4px" }}>
                    {item.submenu.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onMenuChange(sub.id)}
                        style={getSubmenuBtnStyle(activeMenu === sub.id)}
                        onMouseEnter={e => { if (activeMenu !== sub.id) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={e => { if (activeMenu !== sub.id) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{
                          width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                          background: activeMenu === sub.id ? "#4ade80" : "#6ee7b7",
                        }} />
                        {normalizeLabel(sub.label)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div
          style={{ borderTop: "1px solid #166534", paddingTop: "14px", position: "relative" }}
          ref={dropdownRef}
        >
          {/* Dropdown — only when expanded */}
         {!collapsed && showUserDropdown && (
  <div style={{
    position: "absolute", bottom: "76px", left: "8px", right: "8px",
    background: "#ffffff", borderRadius: "12px",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    overflow: "hidden", zIndex: 100,
  }}>
    <button
      onClick={() => { setShowUserDropdown(false); onOpenProfile?.(); }}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        width: "100%", padding: "12px 16px", border: "none",
        background: "transparent", cursor: "pointer",
        fontSize: "13px", fontFamily: "inherit", color: "#14532d", fontWeight: 500,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      Edit Profile
    </button>

    <div style={{ height: "1px", background: "#e5e7eb", margin: "0 12px" }} />

    <button
      onClick={() => { setShowUserDropdown(false); onAddAccount?.(); }}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        width: "100%", padding: "12px 16px", border: "none",
        background: "transparent", cursor: "pointer",
        fontSize: "13px", fontFamily: "inherit", color: "#1d4ed8", fontWeight: 500,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="16" y1="11" x2="22" y2="11" />
      </svg>
      Tambah Akun
    </button>

    <div style={{ height: "1px", background: "#e5e7eb", margin: "0 12px" }} />

    <button
      onClick={() => { setShowUserDropdown(false); onLogout?.(); }}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        width: "100%", padding: "12px 16px", border: "none",
        background: "transparent", cursor: "pointer",
        fontSize: "13px", fontFamily: "inherit", color: "#dc2626", fontWeight: 500,
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Logout
    </button>
  </div>
)}
          <button
            onClick={() => {
              if (collapsed) {
                onCollapse(false); // expand dulu biar dropdown keliatan
              } else {
                setShowUserDropdown(!showUserDropdown);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : "10px",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
              padding: collapsed ? "10px 0" : "10px 12px",
              borderRadius: "12px",
              border: "none",
              background: showUserDropdown ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!showUserDropdown) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { if (!showUserDropdown) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          >
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ width: "18px", height: "18px" }}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#86efac", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </div>
                </div>
                <span style={{
                  fontSize: "11px", color: "#6ee7b7",
                  transform: showUserDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s", flexShrink: 0,
                }}>▾</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;