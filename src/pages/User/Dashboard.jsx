import { useState } from "react";
import StatCard from "../../components/ui/StatCard";
import ActivityItem from "../../components/ui/ActivityItem";
import { CO2Icon, TransportIcon, HouseIcon } from "../components/icons/Icon";
import { stats, activities, weeklyChartData, catatan } from "../../data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── ActivityDetailModal ──────────────────────────────────────────────────────

const typeConfig = {
  transportasi: {
    label: "Transportasi", color: "#0369a1", bg: "#e0f2fe",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  rumah_tangga: {
    label: "Rumah Tangga", color: "#b45309", bg: "#fef3c7",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  makanan: {
    label: "Makanan", color: "#15803d", bg: "#dcfce7",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
};

const DetailRow = ({ label, value, unit }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #f3f4f6",
  }}>
    <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: "13.5px", color: "#111827", fontWeight: 700 }}>
      {value}{unit && <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: "4px" }}>{unit}</span>}
    </span>
  </div>
);

const EmissionBar = ({ value, max = 20 }) => {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct < 30 ? "#16a34a" : pct < 65 ? "#d97706" : "#dc2626";
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Tingkat Emisi
        </span>
        <span style={{ fontSize: "12px", color, fontWeight: 700 }}>
          {pct < 30 ? "Rendah" : pct < 65 ? "Sedang" : "Tinggi"}
        </span>
      </div>
      <div style={{ height: "8px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: "99px",
          background: `linear-gradient(90deg, #16a34a, ${color})`,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
};

const ActivityDetailModal = ({ activity, onClose }) => {
  if (!activity) return null;
  const cfg = typeConfig[activity.type] ?? { label: activity.type, color: "#374151", bg: "#f9fafb", icon: null };
  const detail = activity.detail ?? {};
  const emissionVal = typeof activity.emission === "number" ? activity.emission : parseFloat(activity.emission) || 0;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        zIndex: 300, backdropFilter: "blur(4px)", animation: "adFadeIn 0.2s ease",
      }} />

      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "420px", maxWidth: "calc(100vw - 32px)", background: "#ffffff",
        borderRadius: "24px", zIndex: 301, boxShadow: "0 32px 72px rgba(0,0,0,0.18)",
        animation: "adSlideUp 0.26s cubic-bezier(0.34,1.56,0.64,1)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 100%)", padding: "22px 22px 20px", position: "relative" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "14px", right: "14px", background: "rgba(255,255,255,0.15)",
            border: "none", borderRadius: "8px", width: "32px", height: "32px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px", background: cfg.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: cfg.color, flexShrink: 0,
            }}>
              {cfg.icon}
            </div>
            <div>
              <div style={{
                display: "inline-block", padding: "2px 10px", background: "rgba(255,255,255,0.18)",
                borderRadius: "20px", fontSize: "11px", fontWeight: 700, color: "#d1fae5",
                textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "4px",
              }}>
                {cfg.label}
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff" }}>
                {emissionVal.toFixed(2)}
                <span style={{ fontSize: "13px", fontWeight: 400, color: "#a7f3d0", marginLeft: "6px" }}>kg CO₂</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontSize: "12.5px", color: "#6b7280", fontWeight: 500 }}>{activity.date}</span>
          </div>

          <div style={{ marginBottom: "4px" }}>
            {detail.vehicle    && <DetailRow label="Kendaraan"   value={detail.vehicle} />}
            {detail.distance   && <DetailRow label="Jarak"       value={detail.distance}   unit="km" />}
            {detail.duration   && <DetailRow label="Durasi"      value={detail.duration}   unit="menit" />}
            {detail.kwh        && <DetailRow label="Konsumsi"    value={detail.kwh}        unit="kWh" />}
            {detail.source     && <DetailRow label="Sumber"      value={detail.source} />}
            {detail.items      && <DetailRow label="Item"        value={detail.items} />}
            {detail.passengers && <DetailRow label="Penumpang"   value={detail.passengers} unit="orang" />}
            {detail.fuel       && <DetailRow label="Bahan Bakar" value={detail.fuel} />}
          </div>

          <EmissionBar value={emissionVal} />

          {detail.note && (
            <div style={{
              marginTop: "16px", background: "#f0fdf4", border: "1px solid #dcfce7",
              borderRadius: "12px", padding: "14px 16px", fontSize: "13px",
              color: "#14532d", lineHeight: 1.65,
            }}>
              <span style={{ fontWeight: 700, display: "block", marginBottom: "4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", color: "#16a34a" }}>Catatan</span>
              {detail.note}
            </div>
          )}

          <button onClick={onClose} style={{
            marginTop: "20px", width: "100%", padding: "12px", borderRadius: "14px",
            border: "none", background: "linear-gradient(135deg, #15803d, #166534)",
            color: "#fff", fontSize: "13.5px", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Tutup
          </button>
        </div>
      </div>

      <style>{`
        @keyframes adFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes adSlideUp {
          from { opacity:0; transform:translate(-50%, calc(-50% + 20px)) scale(0.97) }
          to   { opacity:1; transform:translate(-50%, -50%) scale(1) }
        }
      `}</style>
    </>
  );
};

// ─── WelcomeBanner ────────────────────────────────────────────────────────────

const WelcomeBanner = () => (
  <div style={{
    background: "#166534", borderRadius: "20px", padding: "32px 36px",
    marginBottom: "24px", position: "relative", overflow: "hidden",
    minHeight: "110px", display: "flex", alignItems: "center",
  }}>
    <div style={{
      position: "absolute", top: "-30px", left: "-20px",
      width: "200px", height: "200px",
      background: "rgba(255,255,255,0.04)", borderRadius: "50%",
    }} />
    <p style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", position: "relative", zIndex: 2 }}>
      Selamat datang, Raina
    </p>
    <div style={{ position: "absolute", right: "32px", bottom: 0, display: "flex", alignItems: "flex-end", gap: "3px", opacity: 0.7 }}>
      {[28, 44, 36, 52, 32, 48, 38].map((h, i) => (
        <div key={i} style={{ width: 14, height: h, background: "#4ade80", borderRadius: "3px 3px 0 0", opacity: 0.5 + i * 0.07 }} />
      ))}
      <svg width="32" height="60" viewBox="0 0 32 60" fill="none">
        <line x1="16" y1="60" x2="16" y2="20" stroke="#4ade80" strokeWidth="2" />
        <circle cx="16" cy="18" r="3" fill="#4ade80" />
        <line x1="16" y1="18" x2="16" y2="4" stroke="#4ade80" strokeWidth="2" />
        <line x1="16" y1="18" x2="4" y2="28" stroke="#4ade80" strokeWidth="2" />
        <line x1="16" y1="18" x2="28" y2="28" stroke="#4ade80" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>
      <WelcomeBanner />

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          variant="total"
          icon={<CO2Icon />}
          value={stats.totalEmisi.toLocaleString("id-ID", { minimumFractionDigits: 3 })}
          unit="kg co₂"
          progress={33}
        />
        <StatCard
          icon={<TransportIcon />}
          title="Transportasi"
          value={stats.transportasi.value.toFixed(2)}
          unit="kg co₂"
          aktivitas={stats.transportasi.aktivitas}
        />
        <StatCard
          icon={<HouseIcon />}
          title="Rumah Tangga"
          value={stats.rumahTangga.value.toFixed(2)}
          unit="kg co₂"
          aktivitas={stats.rumahTangga.aktivitas}
        />
      </div>

      {/* Bottom section */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Activity History */}
        <div style={{
          background: "#ffffff", borderRadius: "20px", padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          flex: 2, minWidth: "280px",
        }}>
          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
            Riwayat Aktivitas
          </h3>
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              type={activity.type}
              date={activity.date}
              emission={activity.emission}
              onDetail={() => setSelectedActivity(activity)}
            />
          ))}
        </div>

        {/* Stats + Notes */}
        <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Statistik</h3>
            <div style={{ height: "180px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 2px 12px #0001" }} />
                  <Line type="monotone" dataKey="value" stroke="#166534" strokeWidth={2}
                    dot={{ fill: "white", stroke: "#166534", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#166534" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
              <div style={{ width: "20px", height: "2px", background: "#166534", borderRadius: "2px" }} />
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>2020</span>
            </div>
          </div>

          <div style={{
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Catatan</h3>
            <div style={{
              background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "12px",
              padding: "16px", fontSize: "13px", color: "#14532d", fontWeight: 500, lineHeight: 1.65,
            }}>
              {catatan}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default Dashboard;
