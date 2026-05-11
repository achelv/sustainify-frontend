const Badge = ({ count, label = "Aktivitas" }) => (
  <div style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#dcfce7",
    border: "1px solid #bbf7d0",
    color: "#166534",
    fontSize: "13px",
    fontWeight: 700,
    padding: "6px 16px",
    borderRadius: "99px",
    width: "100%",
    justifyContent: "center",
  }}>
    <span style={{ color: "#15803d" }}>{count}</span>
    <span style={{ color: "#16a34a", fontWeight: 600 }}>{label}</span>
  </div>
);

export default Badge;