import { CarIcon, BusIcon, MonitorIcon, EVIcon, DetailIcon } from "../components/icons/Icon";

const iconMap = {
  car: CarIcon,
  bus: BusIcon,
  monitor: MonitorIcon,
  ev: EVIcon,
};

const ActivityItem = ({ type, date, emission, onDetail }) => {
  const IconComponent = iconMap[type] || CarIcon;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "12px 8px",
      borderBottom: "1px solid #f3f4f6",
      borderRadius: "12px",
      transition: "background 0.15s",
      cursor: "default",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: "40px", height: "40px",
        background: "#f0fdf4", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#15803d", flexShrink: 0,
      }}>
        <IconComponent style={{ width: "18px", height: "18px" }} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>{date}</p>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "3px" }}>
        <span style={{ fontSize: "16px", fontWeight: 800, color: "#15803d" }}>
          {emission.toFixed(2)}
        </span>
        <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, marginBottom: "1px" }}>
          kg co₂
        </span>
      </div>

      <button
        onClick={onDetail}
        style={{
          width: "32px", height: "32px",
          background: "#dcfce7", border: "none",
          borderRadius: "8px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#15803d", flexShrink: 0,
        }}
      >
        <DetailIcon style={{ width: "15px", height: "15px" }} />
      </button>
    </div>
  );
};

export default ActivityItem;
