import { HomeIcon, BellIcon } from "../components/icons/Icon";

const Header = ({ title = "Overview" }) => {
  return (
    <header style={{
      height: "64px",
      background: "#ffffff",
      borderBottom: "1px solid #f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      position: "sticky",
      top: 0,
      zIndex: 20,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      // Penting: jangan overflow, ikut lebar parent
      minWidth: 0,
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <div style={{
          width: "32px", height: "32px", flexShrink: 0,
          background: "#f0fdf4", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#166534",
        }}>
          <HomeIcon style={{ width: "16px", height: "16px" }} />
        </div>
        <h2 style={{
          fontSize: "20px", fontWeight: 800, color: "#111827",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          margin: 0,
        }}>
          {title === "Dashboard" ? "Overview" : title}
        </h2>
      </div>
    </header>
  );
};

export default Header;