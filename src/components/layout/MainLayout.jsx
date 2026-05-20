// src/components/layout/MainLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProfileModal from "./ProfileModal";

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 240;

const MainLayout = ({ children, activeMenu, onMenuChange, navItems, pageTitle, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#eaf3ee" }}>
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={onMenuChange}
        navItems={navItems}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfile(true)}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />

      {/* Main content — follows sidebar width */}
      <div style={{
        marginLeft: `${sidebarWidth}px`,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <Header title={pageTitle} />
        <main style={{ flex: 1, padding: "32px", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default MainLayout;