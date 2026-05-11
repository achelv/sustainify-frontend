import { HomeIcon, BellIcon } from "../icons/Icon";

const Header = ({ title = "Dashboard" }) => {
  const headerStyle = {
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
  };

  const leftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const iconBoxStyle = {
    width: "32px",
    height: "32px",
    background: "#f0fdf4",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#166534",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: 800,
    color: "#111827",
  };

  const bellBtnStyle = {
    width: "36px",
    height: "36px",
    background: "#166534",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
  };

  return (
    <header style={headerStyle}>
      <div style={leftStyle}>
        <div style={iconBoxStyle}>
          <HomeIcon style={{ width: "16px", height: "16px" }} />
        </div>
        <h2 style={titleStyle}>{title}</h2>
      </div>
      <button style={bellBtnStyle}>
        <BellIcon style={{ width: "16px", height: "16px" }} />
      </button>
    </header>
  );
};

export default Header;
