import { useState, useEffect } from "react";
import api from "../../api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const StatCard = ({ label, value, sub, icon }) => (
  <div style={{
    background: "#fff", borderRadius: "16px", padding: "20px 24px",
    flex: 1, minWidth: "140px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{icon}</div>
    <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>{value}</div>
    <div style={{ fontSize: "12px", color: "#22c55e", fontWeight: 500 }}>{sub}</div>
  </div>
);

const DashboardAdmin = () => {
  const [stats,   setStats]   = useState({ total_users: 0, total_emisi: 0, chart_data: [], emisi_per_user: [] });
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resStats, resUsers] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
        ]);

        setStats(resStats.data);

        // ✅ Fix: response langsung array, bukan { data: [...] }
        const userData = resUsers.data?.data ?? resUsers.data ?? [];
        
        // ✅ Gabungkan emisi dari stats ke data user
        const emisiMap = {};
        (resStats.data?.emisi_per_user ?? []).forEach(e => {
          emisiMap[e.id] = e.total_emisi;
        });

        const usersWithEmisi = (Array.isArray(userData) ? userData : []).map(u => ({
          ...u,
          emisi: emisiMap[u.id] ?? 0,
        }));

        setUsers(usersWithEmisi);
      } catch (err) {
        console.error("Gagal fetch admin dashboard:", err);
        setError("Gagal memuat data. Coba refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Buat chart data dari emisi_per_user jika chart_data kosong
  const chartData = stats.chart_data?.length > 0
    ? stats.chart_data
    : (stats.emisi_per_user ?? []).map(u => ({
        bulan: u.name,
        emisi: u.total_emisi,
      }));

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111827" }}>

      {/* Baris atas */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{
          background: "linear-gradient(135deg, #14532d, #166534)",
          borderRadius: "16px", padding: "28px 32px",
          minWidth: "200px", flex: "0 0 220px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "8px", lineHeight: 1.3 }}>
            Selamat datang,<br />Admin!
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
            Kelola data pengguna dan emisi karbon.
          </div>
        </div>

        {/* ✅ Fix: total_users (ada s) */}
        <StatCard label="Total Pengguna" value={stats.total_users ?? 0}    sub="Pengguna terdaftar" icon="👤" />
        <StatCard label="Total Emisi"    value={`${stats.total_emisi ?? 0} kg`} sub="Semua pengguna"    icon="📈" />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#dc2626" }}>
          {error}
        </div>
      )}

      {/* Baris bawah */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>

        {/* Tabel */}
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "24px",
          flex: "1 1 400px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Daftar Pengguna</div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Memuat data...</p>
          ) : users.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Tidak ada pengguna ditemukan.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["ID", "Nama", "Email", "Emisi"].map(h => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: "left",
                      color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 12px", color: "#374151" }}>{u.id}</td>
                    <td style={{ padding: "10px 12px", color: "#374151" }}>{u.name}</td>
                    <td style={{ padding: "10px 12px", color: "#6b7280" }}>{u.email}</td>
                    <td style={{ padding: "10px 12px", color: "#14532d", fontWeight: 700 }}>{u.emisi} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Kanan */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Chart */}
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Total Emisi Karbon Bulanan</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "16px" }}>Jumlah Emisi CO₂</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="emisi" stroke="#14532d" strokeWidth={2}
                  dot={{ fill: "#14532d", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Kesimpulan + Tips */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ background: "#14532d", color: "#fff", borderRadius: "8px", padding: "4px 12px", fontSize: "13px", fontWeight: 700, display: "inline-block", marginBottom: "10px" }}>Kesimpulan</div>
              <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
                Total emisi karbon seluruh pengguna mencapai <strong>{stats.total_emisi ?? 0} kg CO₂</strong> dengan <strong>{stats.total_users ?? 0}</strong> pengguna terdaftar.
              </p>
            </div>

            <div style={{ flex: 1, background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ background: "#14532d", color: "#fff", borderRadius: "8px", padding: "4px 12px", fontSize: "13px", fontWeight: 700, display: "inline-block", marginBottom: "10px" }}>Tips</div>
              <ol style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.7, margin: 0, paddingLeft: "16px" }}>
                <li>Mengurangi penggunaan kendaraan pribadi.</li>
                <li>Menghemat penggunaan listrik di rumah tangga.</li>
                <li>Menggunakan peralatan hemat energi.</li>
                <li>Meningkatkan kesadaran terhadap emisi karbon.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;