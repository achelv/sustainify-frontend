import { useState, useEffect } from "react";
import api from "../../api";
import StatCard from "../../components/ui/StatCard";
import ActivityItem from "../../components/ui/ActivityItem";
import { CO2Icon, TransportIcon, HouseIcon } from "../../components/icons/Icon";
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
  const emissionVal = typeof activity.emission === "number" ? activity.emission : parseFloat(activity.emission) || 0;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        zIndex: 300, backdropFilter: "blur(4px)",
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "420px", maxWidth: "calc(100vw - 32px)", background: "#ffffff",
        borderRadius: "24px", zIndex: 301, boxShadow: "0 32px 72px rgba(0,0,0,0.18)", overflow: "hidden",
      }}>
        <div style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 100%)", padding: "22px 22px 20px", position: "relative" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "14px", right: "14px", background: "rgba(255,255,255,0.15)",
            border: "none", borderRadius: "8px", width: "32px", height: "32px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>×</button>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px", background: cfg.bg,
              display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0,
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
        <div style={{ padding: "22px 24px 24px" }}>
          <div style={{ marginBottom: "4px" }}>
            {activity.aktivitas && <DetailRow label={activity.type === "transportasi" ? "Kendaraan" : "Aktivitas"} value={activity.aktivitas} />}
            {activity.jumlah    && <DetailRow label={activity.type === "transportasi" ? "Jarak" : "Durasi"} value={activity.jumlah} />}
            {activity.tanggal   && <DetailRow label="Tanggal" value={activity.tanggal} />}
          </div>
          <EmissionBar value={emissionVal} />
          <button onClick={onClose} style={{
            marginTop: "20px", width: "100%", padding: "12px", borderRadius: "14px",
            border: "none", background: "linear-gradient(135deg, #15803d, #166534)",
            color: "#fff", fontSize: "13.5px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>
            Tutup
          </button>
        </div>
      </div>
    </>
  );
};

// ─── WelcomeBanner ────────────────────────────────────────────────────────────
const WelcomeBanner = ({ nama }) => (
  <div style={{
    background: "#166534", borderRadius: "20px", padding: "32px 36px",
    marginBottom: "24px", position: "relative", overflow: "hidden",
    minHeight: "110px", display: "flex", alignItems: "center",
  }}>
    <p style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", position: "relative", zIndex: 2 }}>
      Selamat datang, {nama}
    </p>
    <div style={{ position: "absolute", right: "32px", bottom: 0, display: "flex", alignItems: "flex-end", gap: "3px", opacity: 0.7 }}>
      {[28, 44, 36, 52, 32, 48, 38].map((h, i) => (
        <div key={i} style={{ width: 14, height: h, background: "#4ade80", borderRadius: "3px 3px 0 0", opacity: 0.5 + i * 0.07 }} />
      ))}
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [stats,          setStats]          = useState({ totalEmisi: 0, transportasi: { value: 0, aktivitas: 0 }, rumahTangga: { value: 0, aktivitas: 0 } });
  const [activities,     setActivities]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [nama,           setNama]           = useState("...");
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [catatan,        setCatatan]        = useState("");

  const labelMap = { ac: "Penggunaan AC", lampu: "Lampu", tv: "TV", kulkas: "Kulkas", ricecooker: "Rice Cooker", kipas: "Kipas Angin" };
  const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.name) setNama(user.name);

        // Fetch transportasi
        const resT  = await api.get("/aktivitas");
        const rawT  = resT.data.data ?? [];
        const totalT = rawT.reduce((s, i) => s + parseFloat(i.emisi_karbon), 0);
        const mappedT = rawT.map((item) => {
          const date = new Date(item.tanggal);
          return {
            id:        item.id,
            type:      "transportasi",
            aktivitas: item.kendaraan?.nama_kendaraan || "-",
            jumlah:    `${item.jarak_km} km`,
            tanggal:   date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            date:      date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) + ", " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).replace(":", "."),
            emission:  parseFloat(item.emisi_karbon),
            _date:     date,
          };
        });

        // Fetch rumah tangga
        const resR  = await api.get("/rumah-tangga");
        const rawR  = resR.data.data ?? [];
        const totalR = rawR.reduce((s, i) => s + parseFloat(i.emisi_karbon), 0);
        const mappedR = rawR.map((item) => {
          const date = new Date(item.tanggal);
          return {
            id:        item.id,
            type:      "rumah_tangga",
            aktivitas: labelMap[item.jenis_aktivitas?.toLowerCase()?.replace(/\s+/g, "")]
            || item.rumah_tangga?.nama_aktivitas
            || item.jenis_aktivitas
            || "-",
            jumlah:    `${item.durasi_jam} jam`,
            tanggal:   date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            date:      date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) + ", " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).replace(":", "."),
            emission:  parseFloat(item.emisi_karbon),
            _date:     date,
          };
        });

        // Gabungkan, urutkan terbaru, ambil 5 terakhir
        const combined = [...mappedT, ...mappedR]
          .sort((a, b) => b._date - a._date)
          .slice(0, 5);

        setActivities(combined);
        setStats({
          totalEmisi:   totalT + totalR,
          transportasi: { value: totalT, aktivitas: rawT.length },
          rumahTangga:  { value: totalR, aktivitas: rawR.length },
        });

        // ── Weekly chart - 7 hari terakhir ──────────────────
            const now = new Date();
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const byDay = Array(7).fill(0);
            [...mappedT, ...mappedR].forEach(item => {
              if (item._date >= sevenDaysAgo) {
                const idx = (item._date.getDay() + 6) % 7;
                byDay[idx] += item.emission;
              }
            });
            const wData = HARI.map((day, i) => ({ day, value: parseFloat(byDay[i].toFixed(2)) }));
            setWeeklyChartData(wData);

        // ── Catatan otomatis ─────────────────────────────
        const totalEmisi = totalT + totalR;
        const maxDay = wData.reduce((a, b) => b.value > a.value ? b : a, wData[0]);
        const minDay = wData.filter(d => d.value > 0).reduce((a, b) => b.value < a.value ? b : a, wData.find(d => d.value > 0) || wData[0]);
        const avg = (totalEmisi / 7).toFixed(2);

        if (totalEmisi === 0) {
          setCatatan("Belum ada aktivitas. Mulai catat aktivitasmu!");
        } else {
          setCatatan(`Total emisi minggu ini ${totalEmisi.toFixed(2)} kg CO₂. Emisi tertinggi pada hari ${maxDay?.day || "-"} dan terendah pada ${minDay?.day || "-"}. Rata-rata harian ${avg} kg.`);
        }

      } catch (err) {
        console.error("Gagal fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const limit = 50;
  const progress = Math.min((stats.totalEmisi / limit) * 100, 100);

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>
      <WelcomeBanner nama={nama} />

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard
          variant="total"
          icon={<CO2Icon />}
          value={stats.totalEmisi.toFixed(3)}
          unit="kg co₂"
          progress={progress}
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
          {loading ? (
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>Memuat data...</p>
          ) : activities.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>Belum ada aktivitas</p>
          ) : activities.map((activity) => (
            <ActivityItem
              key={`${activity.type}-${activity.id}`}
              type={activity.type}
              date={activity.date}
              emission={activity.emission}
              nama={activity.aktivitas}
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
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#111827", marginBottom: "12px" }}>Statistik Emisi Mingguan</h3>
            {weeklyChartData.every(d => d.value === 0) ? (
              <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>Belum ada data statistik</p>
            ) : (
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
            )}
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
              {catatan || "Belum ada catatan."}
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