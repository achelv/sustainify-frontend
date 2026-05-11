import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import HitungEmisi from "./pages/HitungEmisi";
import RiwayatAktivitas from "./pages/RiwayatAktivitas";
import EcoMingguan from "./pages/EcoMingguan";
import LoginPage from "./pages/LoginPage";
import { navMenuItems } from "./data/mockData";
import { useActiveMenu } from "./hooks/useActiveMenu";

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

const getInitialMenu = () => {
  const path = window.location.pathname;
  return pathToMenu[path] || "dashboard";
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    window.location.pathname !== "/" && window.location.pathname !== "/login"
  );
  const { activeMenu, handleMenuChange } = useActiveMenu(getInitialMenu());

  const handleMenuChangeWithPath = (menuId) => {
    handleMenuChange(menuId);
    const path = menuToPath[menuId] || "/dashboard";
    window.history.pushState({}, "", path);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.history.pushState({}, "", "/dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (activeMenu) {
      case "dashboard": return <Dashboard />;
      case "hitung-emisi":
      case "hitung-transportasi": return <HitungEmisi subPage="transportasi" />;
      case "hitung-rumah-tangga": return <HitungEmisi subPage="rumah-tangga" />;
      case "riwayat": return <RiwayatAktivitas />;
      case "eco-mingguan": return <EcoMingguan />;
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
    >
      {renderPage()}
    </MainLayout>
  );
};

export default App;