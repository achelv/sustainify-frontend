import { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import Header from "./Header";

const SIDEBAR_FULL = "240px";
const SIDEBAR_MINI = "68px";
const TRANSITION   = "all 0.28s cubic-bezier(0.4,0,0.2,1)";

/**
 * Props:
 *   children      – page content
 *   activeMenu    – string
 *   onMenuChange  – (id) => void
 *   onLogout      – () => void
 *   pageTitle     – string
 *   adminName     – string
 */
const AdminLayout = ({
  children,
  activeMenu,
  onMenuChange,
  onLogout,
  pageTitle,
  adminName,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_MINI : SIDEBAR_FULL;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#eaf3ee" }}>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <SidebarAdmin
        activeMenu={activeMenu}
        onMenuChange={onMenuChange}
        onLogout={onLogout}
        adminName={adminName}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />

      {/* ── Main area — shifts with the sidebar ─────────────────── */}
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: `calc(100% - ${sidebarWidth})`,
        transition: TRANSITION,
        minWidth: 0,          // prevent flex overflow
      }}>
        <Header title={pageTitle} />

        <main style={{
          flex: 1,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
