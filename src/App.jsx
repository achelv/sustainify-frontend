// src/App.jsx
import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/User/Dashboard";
import HitungEmisi from "./pages/User/HitungEmisi";
import RiwayatAktivitas from "./pages/User/RiwayatAktivitas";
import EcoMingguan from "./pages/User/EcoMingguan";
import LoginPage from "./pages/User/LoginPage";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import ManajemenUser from "./pages/Admin/Manajementuser";
import RiwayatKarbon from "./pages/Admin/RiwayatKararbon";
import { navMenuItems } from "./data/mockData";
import { useActiveMenu } from "./hooks/useActiveMenu";

const DEV_BYPASS_LOGIN = false;

const pathToMenu = {
  "/dashboard": "dashboard",
  "/hitung-emisi": "hitung-emisi",
  "/transportasi": "hitung-transportasi",
  "/rumah_tangga": "hitung-rumah-tangga",
  "/riwayat_aktivitas": "riwayat",
  "/eco-mingguan": "eco-mingguan",
};

const menuToPath = {
  "dashboard": "/dashboard",
  "hitung-emisi": "/hitung-emisi",
  "hitung-transportasi": "/transportasi",
  "hitung-rumah-tangga": "/rumah_tangga",
  "riwayat": "/riwayat_aktivitas",
  "eco-mingguan": "/eco-mingguan",
};

const pageTitleMap = {
  "dashboard": "Dashboard",
  "hitung-emisi": "Hitung Emisi Karbon",
  "hitung-transportasi": "Hitung Emisi Karbon",
  "hitung-rumah-tangga": "Hitung Emisi Karbon",
  "riwayat": "Riwayat Aktivitas",
  "eco-mingguan": "Eco Mingguan",
  "settings": "Pengaturan",
};

const adminMenuToPath = {
  "dashboard": "/admindashboard",
  "manajemen-user": "/adminmanajemen-user",
  "riwayat-karbon": "/adminriwayat-karbon",
};

const adminPathToMenu = {
  "/admindashboard": "dashboard",
  "/adminmanajemen-user": "manajemen-user",
  "/adminriwayat-karbon": "riwayat-karbon",
};

const adminPageTitleMap = {
  "dashboard": "Dashboard",
  "manajemen-user": "Manajemen User",
  "riwayat-karbon": "Riwayat Data Karbon",
};

const getInitialMenu = () => {
  const path = window.location.pathname;
  return pathToMenu[path] || "dashboard";
};

const getInitialAdminMenu = () => {
  const path = window.location.pathname;
  return adminPathToMenu[path] || "dashboard";
};

const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};

// ── Admin wrapper ────────────────────────────────────────────
const AdminApp = ({ onLogout }) => {
  const { activeMenu, handleMenuChange } = useActiveMenu(getInitialAdminMenu());

  const handleAdminMenuChange = (menuId) => {
    handleMenuChange(menuId);
    const newPath = adminMenuToPath[menuId] || "/admindashboard";
    window.history.pushState({}, "", newPath);
  };

  const renderAdminPage = () => {
    switch (activeMenu) {
      case "dashboard":      return <DashboardAdmin />;
      case "manajemen-user": return <ManajemenUser />;
      case "riwayat-karbon": return <RiwayatKarbon />;
      default:               return <DashboardAdmin />;
    }
  };

  return (
    <AdminLayout
      activeMenu={activeMenu}
      onMenuChange={handleAdminMenuChange}
      onLogout={onLogout}
      adminName="Admin Sustainify"
      pageTitle={adminPageTitleMap[activeMenu] || "Dashboard"}
    >
      {renderAdminPage()}
    </AdminLayout>
  );
};

// ── Main App ─────────────────────────────────────────────────
const App = () => {
  const currentPath = window.location.pathname;
  const isAdminPath = adminPathToMenu[currentPath] !== undefined;

  const [isLoggedIn, setIsLoggedIn] = useState(DEV_BYPASS_LOGIN || !!localStorage.getItem("token"));
  const [role, setRole] = useState(isAdminPath ? "admin" : getRoleFromToken());
  const { activeMenu, handleMenuChange } = useActiveMenu(
    isAdminPath ? getInitialAdminMenu() : getInitialMenu()
  );

  if (isAdminPath) {
    return <AdminApp onLogout={() => {
      window.history.pushState({}, "", "/dashboard");
      window.location.reload();
    }} />;
  }

  const handleLogin = () => {
    const userRole = getRoleFromToken();
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.removeItem("token");
    window.history.pushState({}, "", "/");
    window.location.reload();
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  if (role === "admin") return <AdminApp onLogout={handleLogout} />;

  const handleMenuChangeWithPath = (menuId) => {
    handleMenuChange(menuId);
    const newPath = menuToPath[menuId] || "/dashboard";
    window.history.pushState({}, "", newPath);
  };

  const renderPage = () => {
    switch (activeMenu) {
      case "dashboard":           return <Dashboard />;
      case "hitung-emisi":
      case "hitung-transportasi": return <HitungEmisi subPage="transportasi" />;
      case "hitung-rumah-tangga": return <HitungEmisi subPage="rumah-tangga" />;
      case "riwayat":             return <RiwayatAktivitas />;
      case "eco-mingguan":        return <EcoMingguan />;
      case "settings":
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
            <p style={{ color: "#9ca3af", fontSize: "16px" }}>Halaman Pengaturan (coming soon)</p>
          </div>
        );
      default: return <Dashboard />;
    }
  };

  return (
    <MainLayout
      activeMenu={activeMenu}
      onMenuChange={handleMenuChangeWithPath}
      navItems={navMenuItems}
      pageTitle={pageTitleMap[activeMenu] || "Dashboard"}
      onLogout={handleLogout}
    >
      {renderPage()}
    </MainLayout>
  );
};

export default App;