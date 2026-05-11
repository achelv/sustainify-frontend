import StatCard from "../components/ui/StatCard";
import ActivityItem from "../components/ui/ActivityItem";
import { CO2Icon, TransportIcon, HouseIcon } from "../components/icons/Icon";
import { stats, activities, weeklyChartData, catatan } from "../data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WelcomeBanner = () => (
  <div style={{
    background: "#166534",
    borderRadius: "20px",
    padding: "32px 36px",
    marginBottom: "24px",
    position: "relative",
    overflow: "hidden",
    minHeight: "110px",
    display: "flex",
    alignItems: "center",
  }}>
    <div style={{
      position: "absolute", top: "-30px", left: "-20px",
      width: "200px", height: "200px",
      background: "rgba(255,255,255,0.04)", borderRadius: "50%",
    }} />
    <p style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", position: "relative", zIndex: 2 }}>
      Selamat datang, Raina
    </p>
    {/* Illustration */}
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

const Dashboard = () => {
  return (
    <div style={{  width: "100%", padding: "0 8px" }}>
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
              onDetail={() => {}}
            />
          ))}
        </div>

        {/* Stats + Notes */}
        <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Chart */}
          <div style={{
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
              Statistik
            </h3>
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

          {/* Catatan */}
          <div style={{
            background: "#ffffff", borderRadius: "20px", padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
          }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>
              Catatan
            </h3>
            <div style={{
              background: "#f0fdf4", border: "1px solid #dcfce7",
              borderRadius: "12px", padding: "16px",
              fontSize: "13px", color: "#14532d", fontWeight: 500, lineHeight: 1.65,
            }}>
              {catatan}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
