import Badge from "./Badge";

const cardStyle = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "24px",
  border: "1px solid #f3f4f6",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  flex: 1,
  minWidth: "200px",
};

const StatCard = ({ icon, title, value, unit = "kg co₂", aktivitas, variant = "default", progress }) => {
  if (variant === "total") {
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {icon}
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937" }}>Total Emisi</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
          <span style={{ fontSize: "44px", fontWeight: 900, color: "#111827", lineHeight: 1, letterSpacing: "-1px" }}>
            {value}
          </span>
          <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 600, marginBottom: "5px" }}>{unit}</span>
        </div>
        {progress !== undefined && (
          <div style={{ width: "100%", height: "10px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: "#16a34a", borderRadius: "99px" }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon}
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#374151" }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
        <span style={{ fontSize: "38px", fontWeight: 900, color: "#111827", lineHeight: 1, letterSpacing: "-0.5px" }}>
          {value}
        </span>
        <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, marginBottom: "4px" }}>{unit}</span>
      </div>
      {aktivitas !== undefined && <Badge count={aktivitas} />}
    </div>
  );
};

export default StatCard;
