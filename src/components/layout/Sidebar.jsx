import { useState } from "react";
import { HomeIcon, CalculatorIcon, HistoryIcon, LeafIcon, SettingsIcon } from "../icons/Icon";

const iconMap = {
  home: HomeIcon,
  calculator: CalculatorIcon,
  history: HistoryIcon,
  leaf: LeafIcon,
};

const Sidebar = ({ activeMenu, onMenuChange, navItems }) => {
  const [openSubmenu, setOpenSubmenu] = useState("hitung-emisi");

  const sidebarStyle = {
    width: "240px", minHeight: "100vh", background: "#14532d",
    display: "flex", flexDirection: "column", padding: "28px 16px",
    position: "fixed", left: 0, top: 0, zIndex: 30, overflowY: "auto",
  };

  const getBtnStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: "10px", width: "100%",
    padding: "10px 12px", borderRadius: "12px", border: "none", cursor: "pointer",
    fontSize: "13px", fontFamily: "inherit", textAlign: "left", lineHeight: 1.4,
    background: isActive ? "#ffffff" : "transparent",
    color: isActive ? "#14532d" : "#d1fae5",
    fontWeight: isActive ? 700 : 500, marginBottom: "2px",
  });

  const getSubmenuBtnStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: "8px", width: "100%",
    padding: "8px 12px 8px 36px", borderRadius: "10px", border: "none",
    cursor: "pointer", fontSize: "12px", fontFamily: "inherit", textAlign: "left",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    color: isActive ? "#ffffff" : "#a7f3d0",
    fontWeight: isActive ? 600 : 400, marginBottom: "2px",
  });

  const handleNavClick = (item) => {
    if (item.submenu) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
      onMenuChange(item.id);
    } else {
      onMenuChange(item.id);
    }
  };

  return (
    <aside style={sidebarStyle}>
      <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", padding: "0 8px", marginBottom: "6px" }}>
        Sustainify
      </div>
      <div style={{ height: "2px", background: "#166534", borderRadius: "2px", margin: "0 8px 20px 8px" }} />

      <div style={{ fontSize: "10px", fontWeight: 700, color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "1.5px", padding: "0 10px", marginBottom: "6px" }}>
        Dashboard
      </div>
      <button onClick={() => onMenuChange("dashboard")} style={getBtnStyle(activeMenu === "dashboard")}
        onMouseEnter={e => { if (activeMenu !== "dashboard") e.currentTarget.style.background = "#166534"; }}
        onMouseLeave={e => { if (activeMenu !== "dashboard") e.currentTarget.style.background = "transparent"; }}
      >
        <HomeIcon style={{ width: "18px", height: "18px", flexShrink: 0 }} />
        Dashboard
      </button>

      <div style={{ fontSize: "10px", fontWeight: 700, color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "1.5px", padding: "0 10px", margin: "16px 0 6px" }}>
        Menu
      </div>

      <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {navItems.filter(item => item.id !== "dashboard").map((item) => {
          const IconComponent = iconMap[item.icon];
          const isActive = activeMenu === item.id || (item.submenu && item.submenu.some(s => s.id === activeMenu));
          const isOpen = openSubmenu === item.id;

          return (
            <div key={item.id}>
              <button onClick={() => handleNavClick(item)}
                style={getBtnStyle(isActive && !item.submenu)}
                onMouseEnter={e => { if (!isActive || item.submenu) e.currentTarget.style.background = "#166534"; }}
                onMouseLeave={e => { if (!isActive || item.submenu) e.currentTarget.style.background = "transparent"; }}
              >
                {IconComponent && <IconComponent style={{ width: "18px", height: "18px", flexShrink: 0 }} />}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.submenu && (
                  <span style={{ fontSize: "12px", color: "#6ee7b7", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
                )}
              </button>

              {item.submenu && isOpen && (
                <div style={{ marginBottom: "4px" }}>
                  {item.submenu.map(sub => (
                    <button key={sub.id} onClick={() => onMenuChange(sub.id)}
                      style={getSubmenuBtnStyle(activeMenu === sub.id)}
                      onMouseEnter={e => { if (activeMenu !== sub.id) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                      onMouseLeave={e => { if (activeMenu !== sub.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: activeMenu === sub.id ? "#4ade80" : "#6ee7b7", flexShrink: 0 }} />
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{ marginTop: "16px", borderTop: "1px solid #166534", paddingTop: "16px" }}>
        <button onClick={() => onMenuChange("settings")} style={getBtnStyle(activeMenu === "settings")}
          onMouseEnter={e => { if (activeMenu !== "settings") e.currentTarget.style.background = "#166534"; }}
          onMouseLeave={e => { if (activeMenu !== "settings") e.currentTarget.style.background = "transparent"; }}
        >
          <SettingsIcon style={{ width: "18px", height: "18px", flexShrink: 0 }} />
          Pengaturan
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;