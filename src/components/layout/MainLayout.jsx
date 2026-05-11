import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children, activeMenu, onMenuChange, navItems, pageTitle }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#eaf3ee" }}>
      <Sidebar activeMenu={activeMenu} onMenuChange={onMenuChange} navItems={navItems} />
      <div style={{
        marginLeft: "240px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "calc(100% - 240px)",
      }}>
        <Header title={pageTitle} />
        <main style={{
          flex: 1,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;