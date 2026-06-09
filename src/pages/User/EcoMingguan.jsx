import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import api from "../../api";

// ── Helpers ──────────────────────────────────────────────────
const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

const toDateStr = (d) => d.toISOString().split("T")[0];
const pct = (val, batas) => Math.min((val / batas) * 100, 100);

const getIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("ac") || n.includes("pendingin")) return "❄️";
  if (n.includes("lampu") || n.includes("cahaya")) return "💡";
  if (n.includes("tv") || n.includes("televisi")) return "📺";
  if (n.includes("kulkas") || n.includes("lemari")) return "🧊";
  if (n.includes("rice") || n.includes("nasi")) return "🍚";
  if (n.includes("kipas")) return "🌀";
  if (n.includes("mesin cuci")) return "🫧";
  return "🔌";
};

const getIconTransportasi = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("motor") || n.includes("sepeda motor")) return "🏍️";
  if (n.includes("mobil") || n.includes("car")) return "🚗";
  if (n.includes("bus")) return "🚌";
  if (n.includes("sepeda")) return "🚲";
  if (n.includes("truk")) return "🚛";
  return "🚘";
};

// ── Sub-components ────────────────────────────────────────────
const ScoreGauge = ({ percent }) => {
  const r = 52, circ = Math.PI * r;
  const dash = (percent / 100) * circ;
  const color = percent >= 70 ? "#22c55e" : percent >= 40 ? "#f59e0b" : percent >= 20 ? "#f97316" : "#ef4444";
  const label = percent >= 70 ? "Sangat Baik" : percent >= 40 ? "Baik" : percent >= 20 ? "Cukup" : "Perlu Perhatian";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <svg width="130" height="75" viewBox="0 0 130 75">
        <path d="M 10 70 A 55 55 0 0 1 120 70" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
        <path d="M 10 70 A 55 55 0 0 1 120 70" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="65" y="68" textAnchor="middle" fontSize="20" fontWeight="800" fill="#14532d">{percent}%</text>
      </svg>
      <span style={{ fontSize: "15px", fontWeight: "700", color, marginTop: "-4px" }}>{label}</span>
    </div>
  );
};

const MiniBar = ({ values = [], max, color }) => (
  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "28px" }}>
    {values.map((v, i) => {
      const h = Math.max(4, (v / (max || 1)) * 28);
      return <div key={i} style={{ width: "5px", height: `${h}px`, borderRadius: "2px", background: color, opacity: 0.4 + (i / 7) * 0.6 }} />;
    })}
  </div>
);

const StatPill = ({ label, value, accent }) => (
  <div style={{ padding: "10px 14px", borderRadius: "12px", background: "#f9fafb", border: "1px solid #e5e7eb", flex: 1 }}>
    <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: "15px", fontWeight: "700", color: accent || "#14532d" }}>{value}</div>
  </div>
);

const Badge = ({ status }) => (
  <span style={{
    padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
    background: status === "Melebihi" ? "#fef2f2" : "#f0fdf4",
    color: status === "Melebihi" ? "#dc2626" : "#16a34a",
    border: `1px solid ${status === "Melebihi" ? "#fecaca" : "#bbf7d0"}`,
  }}>
    {status === "Melebihi" ? "↑ Melebihi" : "✓ Normal"}
  </span>
);

const KategoriBadge = ({ kategori }) => (
  <span style={{
    padding: "2px 8px", borderRadius: "20px", fontSize: "9px", fontWeight: 700,
    background: kategori === "Transportasi" ? "#eff6ff" : "#f0fdf4",
    color: kategori === "Transportasi" ? "#1d4ed8" : "#16a34a",
    border: `1px solid ${kategori === "Transportasi" ? "#bfdbfe" : "#bbf7d0"}`,
  }}>
    {kategori}
  </span>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#14532d", borderRadius: "10px", padding: "8px 14px", color: "#fff", fontSize: "12px", boxShadow: "0 8px 24px rgba(20,83,45,0.3)" }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ opacity: 0.85 }}>{payload[0].value} kg CO₂</div>
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────
const EcoMingguan = () => {
  const [mode, setMode] = useState("mingguan");
  const [filterKategori, setFilterKategori] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyData, setWeeklyData]     = useState([]);
  const [monthlyData, setMonthlyData]   = useState([]);
  const [appliances, setAppliances]     = useState([]);
  const [summary, setSummary]           = useState(null);
  const [totalEmisi, setTotalEmisi]     = useState(0);
  const [scorePercent, setScorePercent] = useState(0);

  const now = new Date();
  const { start, end } = getWeekRange();
  const bulanLabel = now.toLocaleString("id-ID", { month: "long", year: "numeric" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rtRes, trRes] = await Promise.all([
        api.get("/rumah-tangga"),
        api.get("/aktivitas"),
      ]);

      const rtData = rtRes.data?.data || rtRes.data || [];
      const trData = trRes.data?.data || trRes.data || [];
      const allAktivitas = [...rtData, ...trData];

      // ── Mingguan ──
      const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
      const weekMap = {};
      weekDays.forEach(d => weekMap[d] = 0);

      allAktivitas.forEach(item => {
        const tgl = new Date(item.tanggal || item.created_at);
        if (tgl >= start && tgl <= end) {
          const dayIdx = tgl.getDay();
          const dayName = weekDays[dayIdx === 0 ? 6 : dayIdx - 1];
          weekMap[dayName] = parseFloat(
            ((weekMap[dayName] || 0) + parseFloat(item.emisi_karbon || 0)).toFixed(2)
          );
        }
      });

      const weekly = weekDays.map(d => ({ name: d, value: weekMap[d] }));
      setWeeklyData(weekly);

      // ── Bulanan ──
      const monthMap = {};
      allAktivitas.forEach(item => {
        const tgl = new Date(item.tanggal || item.created_at);
        if (tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear()) {
          const key = `${tgl.getDate()} ${now.toLocaleString("id-ID", { month: "short" })}`;
          monthMap[key] = parseFloat(
            ((monthMap[key] || 0) + parseFloat(item.emisi_karbon || 0)).toFixed(2)
          );
        }
      });
      const monthly = Object.entries(monthMap)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([name, value]) => ({ name, value }));
      setMonthlyData(monthly);

      // ── Total & Score ──
      const totalMinggu = weekly.reduce((s, d) => s + d.value, 0);
      setTotalEmisi(parseFloat(totalMinggu.toFixed(2)));
      setScorePercent(Math.max(0, Math.min(100, Math.round((1 - totalMinggu / 100) * 100))));

      // ── Summary ──
      const activeWeek = weekly.filter(d => d.value > 0);
      const maxDay = activeWeek.reduce((a, b) => b.value > a.value ? b : a, activeWeek[0] || { name: "-", value: 0 });
      const minDay = activeWeek.reduce((a, b) => b.value < a.value ? b : a, activeWeek[0] || { name: "-", value: 0 });
      const avg = activeWeek.length ? (totalMinggu / activeWeek.length).toFixed(2) : "0.00";
      setSummary({ maxDay, minDay, avg, total: totalMinggu.toFixed(2) });

      // ── Perangkat: Rumah Tangga ──
      const deviceMap = {};

      rtData.forEach(item => {
        const tgl = new Date(item.tanggal || item.created_at);
        if (tgl >= start && tgl <= end) {
          const nama = item.jenis_aktivitas || item.nama_aktivitas || `Aktivitas ${item.aktivitas_id}`;
          if (!deviceMap[nama]) deviceMap[nama] = { name: nama, hours: 0, kategori: "Rumah Tangga" };
          deviceMap[nama].hours += parseFloat(item.durasi_jam || 0);
        }
      });

      // ── Perangkat: Transportasi ──
      trData.forEach(item => {
        const tgl = new Date(item.tanggal || item.created_at);
        if (tgl >= start && tgl <= end) {
          const nama = item.nama_kendaraan || item.jenis_kendaraan || `Kendaraan ${item.kendaraan_id}`;
          if (!deviceMap[nama]) deviceMap[nama] = { name: nama, hours: 0, kategori: "Transportasi" };
          deviceMap[nama].hours += parseFloat(item.jarak_km || 0);
        }
      });

      const BATAS_RT = 42;
      const BATAS_TR = 100;

      setAppliances(Object.values(deviceMap).map(d => ({
        name: d.name,
        icon: d.kategori === "Transportasi" ? getIconTransportasi(d.name) : getIcon(d.name),
        hours: parseFloat(d.hours.toFixed(1)),
        batas: d.kategori === "Transportasi" ? BATAS_TR : BATAS_RT,
        satuan: d.kategori === "Transportasi" ? "km" : "h",
        status: d.hours > (d.kategori === "Transportasi" ? BATAS_TR : BATAS_RT) ? "Melebihi" : "Normal",
        kategori: d.kategori,
      })));

    } catch (err) {
      console.error("Gagal fetch:", err);
      setError("Gagal memuat data. Pastikan kamu sudah login.");
    } finally {
      setLoading(false);
    }
  };

  const barData = mode === "mingguan" ? weeklyData : monthlyData;
  const maxVal  = Math.max(...barData.map(d => d.value), 1);
  const alerts  = appliances.filter(a => a.status === "Melebihi");
  const filteredAppliances = filterKategori === "semua"
    ? appliances
    : appliances.filter(a => a.kategori === filterKategori);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "12px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: "40px", height: "40px", border: "4px solid #d1fae5", borderTop: "4px solid #14532d", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <span style={{ color: "#6b7280", fontSize: "13px" }}>Memuat data minggu ini...</span>
    </div>
  );

  if (error) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
      <div style={{ fontWeight: 700 }}>{error}</div>
      <button onClick={fetchData} style={{ marginTop: "16px", padding: "8px 20px", borderRadius: "10px", background: "#14532d", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>
        Coba Lagi
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif", padding: "24px", background: "#f6faf7", minHeight: "100vh", color: "#111827" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f0fdf4; } ::-webkit-scrollbar-thumb { background: #86efac; border-radius: 99px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .card { animation: fadeUp .4s ease both; }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#14532d", letterSpacing: "-0.02em" }}>Eco Mingguan</h1>
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#6b7280" }}>
            Pantau jejak karbon & konsumsi energimu minggu ini
            <span style={{ marginLeft: "8px", fontSize: "11px", color: "#9ca3af" }}>
              ({toDateStr(start)} – {toDateStr(end)})
            </span>
          </p>
        </div>
        <div style={{ padding: "8px 16px", borderRadius: "10px", background: "#14532d", color: "#fff", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
          <span>📅</span> {bulanLabel}
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "20px" }}>

        {/* Total Emisi */}
        <div className="card" style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 100%)", borderRadius: "18px", padding: "20px", color: "#fff", animationDelay: "0ms", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -30, left: -10, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7, marginBottom: "8px" }}>Total Emisi Minggu Ini</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1 }}>{totalEmisi.toFixed(2)}</span>
            <span style={{ fontSize: "13px", opacity: 0.8 }}>kg CO₂</span>
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <MiniBar values={weeklyData.map(d => d.value)} max={maxVal} color="#fff" />
            <span style={{ fontSize: "11px", opacity: 0.7, marginLeft: "4px" }}>7 hari terakhir</span>
          </div>
        </div>

        {/* Eco Score */}
        <div className="card" style={{ background: "#fff", borderRadius: "18px", padding: "20px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", animationDelay: "60ms" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: "8px", alignSelf: "flex-start" }}>Eco Score</div>
          <ScoreGauge percent={scorePercent} />
          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>Penggunaan energi minggu ini</div>
        </div>

        {/* Status */}
        <div className="card" style={{ background: "#fff", borderRadius: "18px", padding: "20px", border: "1px solid #e5e7eb", animationDelay: "120ms" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: "12px" }}>Status Aktivitas</div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
            <div style={{ flex: 1, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#dc2626" }}>{alerts.length}</div>
              <div style={{ fontSize: "11px", color: "#ef4444" }}>Melebihi Batas</div>
            </div>
            <div style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#16a34a" }}>{appliances.length - alerts.length}</div>
              <div style={{ fontSize: "11px", color: "#16a34a" }}>Normal</div>
            </div>
          </div>
          {alerts.length === 0
            ? <div style={{ fontSize: "12px", color: "#16a34a", textAlign: "center" }}>Semua aktivitas normal ✓</div>
            : alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderTop: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: "14px" }}>{a.icon}</span>
                <span style={{ fontSize: "12px", color: "#374151", flex: 1 }}>{a.name}</span>
                <span style={{ fontSize: "10px", color: "#6b7280" }}>{a.kategori}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626" }}>+{(a.hours - a.batas).toFixed(1)}{a.satuan}</span>
              </div>
            ))
          }
        </div>

        {/* Statistik */}
        {summary && (
          <div className="card" style={{ background: "#fff", borderRadius: "18px", padding: "20px", border: "1px solid #e5e7eb", animationDelay: "180ms" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: "12px" }}>Statistik Mingguan</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <StatPill label="Rata-rata harian"                       value={`${summary.avg} kg`}                            accent="#14532d" />
              <StatPill label={`Tertinggi – ${summary.maxDay?.name}`} value={`${summary.maxDay?.value?.toFixed(2) || 0} kg`} accent="#dc2626" />
              <StatPill label={`Terendah – ${summary.minDay?.name}`}  value={`${summary.minDay?.value?.toFixed(2) || 0} kg`} accent="#16a34a" />
            </div>
          </div>
        )}
      </div>

      {/* CHART + AKTIVITAS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "20px" }}>

        {/* Chart */}
        <div className="card" style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e5e7eb", padding: "20px", animationDelay: "200ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Grafik Emisi Karbon</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                {mode === "mingguan" ? `Per hari – ${toDateStr(start)} s/d ${toDateStr(end)}` : `Per hari – ${bulanLabel}`}
              </div>
            </div>
            <div style={{ display: "flex", gap: "4px", background: "#f3f4f6", borderRadius: "10px", padding: "3px" }}>
              {["mingguan", "bulanan"].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{ padding: "5px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, background: mode === m ? "#14532d" : "transparent", color: mode === m ? "#fff" : "#6b7280", transition: "all .2s" }}>
                  {m === "mingguan" ? "Minggu" : "Bulan"}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#14532d" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#14532d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#14532d" strokeWidth={2.5} fill="url(#greenGrad)"
                dot={{ r: 3, fill: "#14532d", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#14532d" }} />
            </AreaChart>
          </ResponsiveContainer>

          {summary && (
            <div style={{ marginTop: "14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                {mode === "mingguan" ? "Ringkasan Minggu Ini" : "Ringkasan Bulan Ini"}
              </div>
              {[
                { label: "Total emisi",      val: `${summary.total} kg CO₂`, bold: true },
                { label: "Emisi tertinggi",  val: `${summary.maxDay?.name} · ${summary.maxDay?.value?.toFixed(2)} kg` },
                { label: "Emisi terendah",   val: `${summary.minDay?.name} · ${summary.minDay?.value?.toFixed(2)} kg` },
                { label: "Rata-rata harian", val: `${summary.avg} kg` },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < arr.length - 1 ? "1px solid #e5e7eb" : "none", fontSize: "12px" }}>
                  <span style={{ color: "#6b7280" }}>{row.label}</span>
                  <span style={{ fontWeight: row.bold ? 700 : 500, color: "#14532d" }}>{row.val}</span>
                </div>
              ))}
              <p style={{ margin: "10px 0 0", fontSize: "11px", color: "#9ca3af", borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
                {summary.maxDay?.name !== "-" ? `Hari ${summary.maxDay.name} memiliki emisi tertinggi minggu ini.` : "Belum ada data minggu ini."}
              </p>
            </div>
          )}
        </div>

        {/* Aktivitas Panel */}
        <div className="card" style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e5e7eb", padding: "20px", animationDelay: "240ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Aktivitas Minggu Ini</div>
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "12px" }}>Rumah tangga & transportasi</div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            {["semua", "Rumah Tangga", "Transportasi"].map(k => (
              <button key={k} onClick={() => setFilterKategori(k)} style={{
                padding: "4px 10px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 600,
                background: filterKategori === k
                  ? (k === "Transportasi" ? "#1d4ed8" : k === "Rumah Tangga" ? "#16a34a" : "#14532d")
                  : "#f3f4f6",
                color: filterKategori === k ? "#fff" : "#6b7280",
                transition: "all .2s",
              }}>
                {k === "semua" ? "Semua" : k}
              </button>
            ))}
          </div>

          {filteredAppliances.length === 0
            ? <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "20px" }}>Belum ada data minggu ini</div>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                {filteredAppliances.map((item, i) => {
                  const p = pct(item.hours, item.batas);
                  const over = item.status === "Melebihi";
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                        <span style={{ fontSize: "16px" }}>{item.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                          <KategoriBadge kategori={item.kategori} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: over ? "#dc2626" : "#16a34a", flexShrink: 0 }}>{item.hours}{item.satuan}</span>
                        <Badge status={item.status} />
                      </div>
                      <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p}%`, borderRadius: "99px", background: over ? "linear-gradient(90deg,#fca5a5,#ef4444)" : item.kategori === "Transportasi" ? "linear-gradient(90deg,#93c5fd,#1d4ed8)" : "linear-gradient(90deg,#86efac,#16a34a)", transition: "width 1s ease" }} />
                      </div>
                      <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "3px" }}>
                        Batas normal: {item.batas}{item.satuan} · {Math.round(p)}% terpakai
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>
      </div>

      {/* ALERTS */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>⚠️ Peringatan Penggunaan</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
            {alerts.map((a, i) => (
              <div key={i} className="card" style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "16px", display: "flex", gap: "14px", animationDelay: `${300 + i * 60}ms` }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400e", marginBottom: "2px" }}>{a.name} melebihi batas!</div>
                  <div style={{ fontSize: "10px", color: "#a16207", marginBottom: "4px" }}>{a.kategori}</div>
                  <div style={{ fontSize: "12px", color: "#a16207" }}>
                    {a.hours}{a.satuan} digunakan — batas normal {a.batas}{a.satuan}/minggu.
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "11px", fontWeight: 700, color: "#dc2626", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }} />
                    Kelebihan {(a.hours - a.batas).toFixed(1)}{a.satuan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REKOMENDASI + SARAN + ECO BADGE */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>

        <div className="card" style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e5e7eb", padding: "20px", animationDelay: "320ms" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⭐</div>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>Rekomendasi</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "⏱️", text: "Atur timer AC maksimal 6 jam/hari untuk menghemat energi." },
              { icon: "🚲", text: "Gunakan transportasi umum atau bersepeda untuk menghemat emisi." },
              { icon: "🌙", text: "Matikan perangkat elektronik sepenuhnya saat tidak digunakan." },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "10px", background: "#f9fafb", borderRadius: "10px" }}>
                <span style={{ fontSize: "16px" }}>{r.icon}</span>
                <p style={{ margin: 0, fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: "#fff", borderRadius: "18px", border: "1px solid #e5e7eb", padding: "20px", animationDelay: "360ms" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>💡</div>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>Saran Hemat Energi</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "🌡️", text: "Kurangi penggunaan AC pada malam hari, gunakan kipas angin." },
              { icon: "🔌", text: "Matikan perangkat yang tidak digunakan atau dalam keadaan standby." },
              { icon: "☀️",  text: "Manfaatkan cahaya alami di siang hari untuk mengurangi penggunaan lampu." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "10px", background: "#f9fafb", borderRadius: "10px" }}>
                <span style={{ fontSize: "16px" }}>{s.icon}</span>
                <p style={{ margin: 0, fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "18px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#fff", animationDelay: "400ms", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>🌿</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.01em" }}>CO₂ Karbon Emisi</div>
            <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "4px" }}>Jaga bumi tetap hijau 🌍</div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            {["💚", "🌱", "♻️"].map((e, i) => (
              <div key={i} style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{e}</div>
            ))}
          </div>
          <div style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center", fontSize: "11px", opacity: 0.85 }}>
            Setiap tindakan kecil berarti bagi lingkungan
          </div>
        </div>

      </div>
    </div>
  );
};

export default EcoMingguan;