import { useState, useEffect } from "react";
import api from "../../api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from "recharts";

// ── Helpers ──────────────────────────────────────────────────
const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const labelMap = { ac: "AC", lampu: "Lampu", tv: "TV", kulkas: "Kulkas", ricecooker: "Rice Cooker", kipas: "Kipas Angin" };
const batasNormal = { ac: 6*7, lampu: 12*7, tv: 5*7, kulkas: 24*7, ricecooker: 4*7, kipas: 8*7 };
const applianceIcon = { ac: "❄️", lampu: "💡", tv: "📺", kulkas: "🧊", ricecooker: "🍚", kipas: "💨" };

const rekomendasi = [
  "Atur timer AC maksimal 6 jam/hari untuk menghemat energi.",
  "Gunakan transportasi umum atau bersepeda untuk menghemat energi.",
];

const saran = [
  "Kurangi penggunaan AC pada malam hari",
  "Matikan perangkat yang tidak digunakan atau dalam keadaan standby.",
];

// ── Sub-components ───────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    ...style,
  }}>
    {children}
  </div>
);

const Badge = ({ status }) => (
  <span style={{
    padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
    background: status === "Melebihi" ? "#fef2f2" : "#f0fdf4",
    color: status === "Melebihi" ? "#dc2626" : "#16a34a",
  }}>
    {status}
  </span>
);

const ScoreRing = ({ percent }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="#16a34a" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill="#14532d">
        {percent}%
      </text>
    </svg>
  );
};

const InnerBox = ({ children, variant = "green", style = {} }) => {
  const variants = {
    green: { background: "#f0fdf4", border: "1px solid #bbf7d0" },
    gray:  { background: "#f9fafb", border: "1px solid #e5e7eb" },
  };
  return (
    <div style={{
      borderRadius: "10px",
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      marginTop: "12px",
      gap: "8px",
      ...variants[variant],
      ...style,
    }}>
      {children}
    </div>
  );
};

const KRow = ({ label, val, bold, last }) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0",
    borderBottom: last ? "none" : "1px solid #e5e7eb",
    fontSize: "12px",
    gap: "6px",
    flexWrap: "wrap",
  }}>
    <span style={{ color: "#6b7280" }}>{label}</span>
    <span style={{ fontWeight: bold ? 600 : 500, color: "#14532d" }}>{val}</span>
  </div>
);

const CustomDot = ({ cx, cy, payload }) => (
  <circle
    cx={cx} cy={cy} r={4}
    fill={payload.predicted ? "#dc2626" : "#14532d"}
    stroke="none"
  />
);

// ── Main Component ───────────────────────────────────────────
const EcoMingguan = () => {
  const [mode, setMode] = useState("mingguan");

  const [totalEmisi,  setTotalEmisi]  = useState(0);
  const [weeklyData,  setWeeklyData]  = useState(HARI.map(n => ({ name: n, value: 0 })));
  const [monthlyData, setMonthlyData] = useState([]);
  const [kData,       setKData]       = useState({
    mingguan: { title: "Keterangan minggu ini", rows: [], note: "" },
    bulanan:  { title: "Keterangan bulan ini",  rows: [], note: "" },
  });
  const [appliances,   setAppliances]  = useState([]);
  const [alerts,       setAlerts]      = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [score,        setScore]       = useState({ percent: 0, label: "Menghitung..." });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resT, resR] = await Promise.all([
          api.get("/aktivitas"),
          api.get("/rumah-tangga"),
        ]);
        const rawT = resT.data.data ?? [];
        const rawR = resR.data.data ?? [];

        // ── Minggu ini ───────────────────────────────────
        const now    = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const isThisWeek = d => d >= sevenDaysAgo && d <= now;
        const isThisMonth = d => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

        const tWeek = rawT.filter(i => isThisWeek(new Date(i.tanggal)));
        const rWeek = rawR.filter(i => isThisWeek(new Date(i.tanggal)));
        const allWeek = [...tWeek, ...rWeek];
        const total = allWeek.reduce((s, i) => s + parseFloat(i.emisi_karbon), 0);
        setTotalEmisi(total);

        // ── Weekly chart ─────────────────────────────────
        const byDay = Array(7).fill(0);
        allWeek.forEach(i => {
          const idx = (new Date(i.tanggal).getDay() + 6) % 7;
          byDay[idx] += parseFloat(i.emisi_karbon);
        });
        const wData = HARI.map((n, i) => ({ name: n, value: parseFloat(byDay[i].toFixed(2)) }));
        setWeeklyData(wData);

        // ── Monthly chart ────────────────────────────────
        const tMonth   = rawT.filter(i => isThisMonth(new Date(i.tanggal)));
        const rMonth   = rawR.filter(i => isThisMonth(new Date(i.tanggal)));
        const allMonth = [...tMonth, ...rMonth];
        const byDate   = {};
        allMonth.forEach(i => {
          const key = new Date(i.tanggal).getDate();
          byDate[key] = (byDate[key] || 0) + parseFloat(i.emisi_karbon);
        });
        const mData = Object.entries(byDate)
          .sort((a, b) => a[0] - b[0])
          .map(([d, v]) => ({
            name: `${d} ${now.toLocaleString("id-ID", { month: "short" })}`,
            value: parseFloat(v.toFixed(2)),
          }));
        setMonthlyData(mData);

        // ── Keterangan ───────────────────────────────────
        const maxDay  = wData.reduce((a, b) => b.value > a.value ? b : a, wData[0]);
        const minDay  = wData.filter(d => d.value > 0).reduce((a, b) => b.value < a.value ? b : a, wData.find(d => d.value > 0) || wData[0]);
        const avg     = total / 7;
        const totalMonth = allMonth.reduce((s, i) => s + parseFloat(i.emisi_karbon), 0);
        const maxDate = mData.length > 0 ? mData.reduce((a, b) => b.value > a.value ? b : a, mData[0]) : { name: "-", value: 0 };
        const minDate = mData.filter(d => d.value > 0).reduce((a, b) => b.value < a.value ? b : a, mData[0] || { name: "-", value: 0 });
        const avgMonth = mData.length > 0 ? totalMonth / mData.length : 0;
        const bulan    = now.toLocaleString("id-ID", { month: "long", year: "numeric" });

        setKData({
          mingguan: {
            title: "Keterangan minggu ini",
            rows: [
              { label: "Total emisi minggu ini", val: `${total.toFixed(2)} kg co₂`,                        bold: true },
              { label: "Emisi tertinggi",        val: `${maxDay?.name || "-"} · ${maxDay?.value.toFixed(2) || 0} kg` },
              { label: "Emisi terendah",         val: `${minDay?.name || "-"} · ${minDay?.value.toFixed(2) || 0} kg` },
              { label: "Rata-rata harian",       val: `${avg.toFixed(2)} kg` },
            ],
            note: `Hari ${maxDay?.name || "-"} memiliki emisi tertinggi minggu ini.`,
          },
          bulanan: {
            title: `Keterangan ${bulan}`,
            rows: [
              { label: "Total emisi bulan ini", val: `${totalMonth.toFixed(2)} kg co₂`,                        bold: true },
              { label: "Emisi tertinggi",       val: `${maxDate?.name || "-"} · ${maxDate?.value.toFixed(2) || 0} kg` },
              { label: "Emisi terendah",        val: `${minDate?.name || "-"} · ${minDate?.value.toFixed(2) || 0} kg` },
              { label: "Rata-rata harian",      val: `${avgMonth.toFixed(2)} kg` },
            ],
            note: `Total emisi bulan ${bulan} berdasarkan data aktivitas yang tercatat.`,
          },
        });

        // ── Appliances ───────────────────────────────────
        const jamPerJenis = {};
        rawR.forEach(i => {
          jamPerJenis[i.jenis_aktivitas] = (jamPerJenis[i.jenis_aktivitas] || 0) + parseFloat(i.durasi_jam);
        });
        const appList = Object.entries(jamPerJenis).map(([key, jam]) => {
          const batas  = batasNormal[key] || 999;
          const status = jam > batas ? "Melebihi" : "Normal";
          return {
            icon:   applianceIcon[key] || "🔌",
            name:   labelMap[key] || key,
            sub:    `Batasan normal: ${batas / 7} jam/hari`,
            hours:  jam,
            status,
          };
        });
        setAppliances(appList);
        setAlerts(appList.filter(a => a.status === "Melebihi"));

        // ── Forecasting ──────────────────────────────────
        const months = {};
        [...rawT, ...rawR].forEach(i => {
          const d   = new Date(i.tanggal);
          const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
          months[key] = (months[key] || 0) + parseFloat(i.emisi_karbon);
        });
        const fData = Object.entries(months)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, val]) => {
            const [y, m] = key.split("-");
            return { name: new Date(y, m).toLocaleString("id-ID", { month: "short" }), value: parseFloat(val.toFixed(2)) };
          });
        if (fData.length > 0) {
          const last = fData[fData.length - 1];
          const pred = parseFloat((last.value * 1.08).toFixed(2));
          const next = new Date(now.getFullYear(), now.getMonth() + 1);
          fData.push({ name: `${next.toLocaleString("id-ID", { month: "short" })} (pred)`, value: pred, predicted: true });
        }
        setForecastData(fData);

        // ── Score ────────────────────────────────────────
        const limit = 50;
        const pct   = Math.max(Math.min(Math.round(((limit - total) / limit) * 100), 100), 0);
        const label = pct >= 70 ? "Sangat Baik" : pct >= 40 ? "Baik" : pct >= 20 ? "Cukup" : "Perlu Perhatian";
        setScore({ percent: pct, label });

      } catch (err) {
        console.error("Gagal fetch eco mingguan:", err);
      }
    };
    fetchAll();
  }, []);

  const barData = mode === "mingguan" ? weeklyData : monthlyData;
  const k = kData[mode];

  const axisProps = {
    tick: { fontSize: 11, fill: "#9ca3af" },
    axisLine: false,
    tickLine: false,
  };

  const tooltipStyle = {
    contentStyle: {
      borderRadius: "8px", border: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "12px",
    },
    formatter: v => [`${v} kg co₂`, "Emisi"],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ROW 1: Total Emisi + Score */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>

        {/* Total Emisi */}
        <Card>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 40 40" width="36" height="36">
                <circle cx="20" cy="20" r="20" fill="#e8f5e9" />
                <text x="20" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14532d" fontFamily="serif">CO₂</text>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "2px" }}>Total Emisi</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "#14532d", lineHeight: 1 }}>{totalEmisi.toFixed(3)}</span>
                <span style={{ fontSize: "13px", color: "#6b7280" }}>kg<sub>co₂</sub></span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "14px", padding: "8px 12px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>📊</span>
            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Data minggu ini</span>
          </div>
        </Card>

        {/* Score */}
        <Card>
          <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", fontWeight: 600 }}>Score</div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ScoreRing percent={score.percent} />
            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#14532d" }}>{score.label}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>Penggunaan Energi minggu ini</div>
              <div style={{ padding: "4px 12px", borderRadius: "20px", background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: "11px", fontWeight: 600, color: "#16a34a", display: "inline-block" }}>
                {score.percent}% : {score.label}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ROW 2: Forecasting + Statistik + Appliances */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "stretch" }}>

        {/* Forecasting */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Forecasting</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Analisis berdasarkan data bulan terakhir</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={forecastData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="#14532d" strokeWidth={2} dot={<CustomDot />} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <InnerBox variant="green">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#14532d" }}>Ringkasan prediksi</span>
              <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", background: "#dcfce7", color: "#14532d", border: "1px solid #bbf7d0" }}>
                ⏱ Data real
              </span>
            </div>
            <p style={{ fontSize: "11px", color: "#166534", lineHeight: 1.6, margin: 0 }}>
              Emisi diperkirakan naik <strong>8%</strong> pada bulan depan jika pola penggunaan tidak berubah.
            </p>
            {forecastData.length > 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#6b7280" }}>Prediksi bulan depan</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#14532d", lineHeight: 1 }}>
                  {forecastData[forecastData.length - 1]?.value} <span style={{ fontSize: "12px", fontWeight: 400, color: "#9ca3af" }}>kg co₂</span>
                </div>
                <div style={{ fontSize: "11px", color: "#16a34a" }}>↑ 8% dari bulan ini</div>
              </div>
            )}
          </InnerBox>
        </div>

        {/* Statistik */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "6px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Statistik</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                {mode === "mingguan" ? "Emisi harian minggu ini" : "Emisi harian bulan ini"}
              </div>
            </div>
            <select value={mode} onChange={e => setMode(e.target.value)} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "8px", border: "1px solid #e5e7eb", color: "#374151", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              <option value="mingguan">Mingguan</option>
              <option value="bulanan">Bulanan</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={barData} barSize={16} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#14532d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <InnerBox variant="gray">
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>{k.title}</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {k.rows.map((row, i) => (
                <KRow key={i} label={row.label} val={row.val} bold={row.bold} last={i === k.rows.length - 1} />
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.5, margin: 0, paddingTop: "8px", borderTop: "1px solid #e5e7eb" }}>
              {k.note}
            </p>
          </InnerBox>
        </div>

        {/* Alerts + Appliances */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {alerts.length > 0 && alerts.map((a, i) => (
            <Card key={i} style={{ border: "1px solid #fde68a", background: "#fffbeb" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "16px" }}>⚠️</div>
                <div>
                  <p style={{ fontSize: "12px", color: "#92400e", margin: "0 0 8px", lineHeight: 1.5 }}>
                    Penggunaan {a.name} mencapai {a.hours} jam dan melebihi batas normal ({a.sub}).
                  </p>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>Status: Melebihi batas</div>
                </div>
              </div>
            </Card>
          ))}

          {appliances.length > 0 && (
            <Card style={{ padding: "16px" }}>
              {appliances.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < appliances.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>{item.sub}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#14532d" }}>{item.hours} jam</div>
                    <Badge status={item.status} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "10px", background: "#f0fdf4", fontSize: "11px", color: "#374151", lineHeight: 1.6 }}>
                Sedikit pengurangan penggunaan listrik dapat membantu mengurangi emisi karbon.
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ROW 3: Rekomendasi + Saran + Ilustrasi */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", alignItems: "start" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ fontSize: "16px" }}>⭐</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>Rekomendasi</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {rekomendasi.map((text, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d1fae5", border: "2px solid #16a34a", marginTop: "5px", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ fontSize: "16px" }}>⭐</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>Saran</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {saran.map((text, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d1fae5", border: "2px solid #16a34a", marginTop: "5px", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "120px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "32px" }}>
              🌿
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>CO₂ Karbon Emisi</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>Jaga bumi tetap hijau</div>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default EcoMingguan;