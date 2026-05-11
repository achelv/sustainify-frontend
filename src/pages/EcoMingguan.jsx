import { weeklyChartData, catatan } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const EcoMingguan = () => {
  const card = { background: "#fff", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" };
  const greenCard = { background: "#166534", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" };

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* LEFT */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={{ ...greenCard, padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <svg viewBox="0 0 56 56" fill="none" width="56" height="56" style={{ flexShrink: 0 }}>
                <circle cx="28" cy="28" r="28" fill="rgba(255,255,255,0.15)" />
                <path d="M14 30c0-5 3-9 7-10.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 18c2-3 5-5 8-5s6 2 8 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M36 19.5c4 1.5 7 5.5 7 10.5 0 6.1-4.9 11-11 11H16c-4.4 0-8-3.6-8-8 0-4 3-7.3 6.8-7.9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <text x="15" y="37" fontSize="9" fontWeight="bold" fill="#fff" fontFamily="serif">CO₂</text>
                <path d="M24 14c0-2 1-4 3-5 0 3 2 5 5 5-1 3-4 5-8 4" fill="rgba(255,255,255,0.3)" />
              </svg>
              <div>
                <p style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "4px" }}>Total Emisi Karbon</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "5px" }}>
                  <span style={{ fontSize: "36px", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>3.275</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", fontWeight: 600 }}>kg co₂</span>
                </div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "16px" }}>
              <p style={{ color: "#fff", fontSize: "14px", fontWeight: 500, lineHeight: 1.6 }}>
                Total emisi karbon Anda sedang, tetap jaga dan tingkatkan kebiasaan ramah lingkungan Anda.
              </p>
            </div>
          </div>

          <div style={{ ...greenCard, padding: "28px" }}>
            <p style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginBottom: "20px" }}>Eco Score</p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "14px", background: "rgba(255,255,255,0.2)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ width: "20%", height: "100%", background: "#4ade80", borderRadius: "99px" }} />
              </div>
              <span style={{ color: "#fff", fontSize: "18px", fontWeight: 800, whiteSpace: "nowrap" }}>20.0 %</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ color: "#fff", fontSize: "14px", fontWeight: 500 }}>Skor Anda sangat baik, pertahankan!</p>
              <span style={{ fontSize: "28px" }}>😊</span>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", borderRadius: "16px", padding: "28px", border: "1px solid #dcfce7", position: "relative", overflow: "hidden", minHeight: "140px" }}>
            <p style={{ fontSize: "16px", fontWeight: 800, color: "#166534", lineHeight: 1.5, maxWidth: "260px", position: "relative", zIndex: 2 }}>
              Ikuti tantangan minggu ini dan kurangi jejak karbonmu, serta dapatkan reward menarik
            </p>
            <div style={{ position: "absolute", right: "16px", bottom: 0, display: "flex", alignItems: "flex-end", gap: "3px", opacity: 0.6 }}>
              {[20, 32, 26, 40, 24, 36, 28].map((h, i) => (
                <div key={i} style={{ width: 10, height: h, background: "#4ade80", borderRadius: "3px 3px 0 0" }} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...card, padding: "24px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#166534", marginBottom: "16px" }}>Stastistik</h3>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 3]} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "none" }} cursor={{ fill: "#f0fdf4" }} />
                  <Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: "10px", fill: "#6b7280", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
              <div style={{ width: "14px", height: "14px", background: "#166534", borderRadius: "2px" }} />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>2020</span>
            </div>
          </div>

          <div style={{ ...card, padding: "24px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#166534", marginBottom: "12px" }}>Catatan</h3>
            <div style={{ background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "12px", padding: "16px", fontSize: "13px", color: "#14532d", fontWeight: 500, lineHeight: 1.65, textAlign: "center", marginBottom: "12px" }}>
              {catatan}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 2, background: "#166534", borderRadius: "12px", padding: "14px" }}>
                <p style={{ color: "#fff", fontSize: "12px", fontWeight: 500, lineHeight: 1.5 }}>
                  Batasi aktivitas berat di hari Selasa untuk menyeimbangkan grafik.
                </p>
              </div>
              <div style={{ flex: 1, background: "#166534", borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#4ade80", fontSize: "22px", fontWeight: 900 }}>+50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoMingguan;