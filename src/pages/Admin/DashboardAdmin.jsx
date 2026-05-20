import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const emisiData = [
  { bulan: "Januari", emisi: 35 },
  { bulan: "April", emisi: 55 },
  { bulan: "Juni", emisi: 40 },
  { bulan: "Agustus", emisi: 48 },
  { bulan: "Desember", emisi: 42 },
];

const daftarPengguna = [
  { id: "K00T21", nama: "Andi Rahma", email: "andi@gmail.com" },
  { id: "K00T32", nama: "Budi Pratama", email: "budi@email.com" },
  { id: "K00T02", nama: "Nabila Putri", email: "nabila@gmail.com" },
  { id: "K00T12", nama: "Rizky Hidayat", email: "rizky@gmail.com" },
  { id: "K00T05", nama: "Siti Rahma", email: "siti@gmail.com" },
  { id: "K00T29", nama: "Bobi", email: "bobi@gmail.com" },
  { id: "K00T15", nama: "Amara", email: "amara@gmail.com" },
  { id: "K00T13", nama: "Budi Hariyanto", email: "budi@gmail.com" },
];

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
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111827" }}>

      {/* Baris atas: Welcome card + Stat cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>

        {/* Welcome card */}
        <div style={{
          background: "linear-gradient(135deg, #14532d, #166534)",
          borderRadius: "16px", padding: "28px 32px",
          minWidth: "200px", flex: "0 0 220px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", width: "120px", height: "120px",
            borderRadius: "50%", border: "30px solid rgba(255,255,255,0.07)",
            bottom: "-30px", right: "-30px",
          }} />
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "8px", lineHeight: 1.3 }}>
            Selamat datang,<br />Admin!
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
            Aktivitas meningkat 8%<br />dari kemarin.
          </div>
        </div>

        {/* Stat cards */}
        <StatCard label="Total Pengguna" value="250" sub="+12 bulan ini" icon="👤" />

        <StatCard label="Total Emisi" value="12.5 ton" sub="+1.3 ton bulan ini" icon="📈" />
      </div>

      {/* Baris bawah: Tabel + Chart */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>

        {/* Tabel Daftar Pengguna */}
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "24px",
          flex: "1 1 400px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>Daftar Pengguna</div>
            <button style={{
              background: "#14532d", color: "#fff", border: "none",
              borderRadius: "8px", padding: "6px 16px", fontSize: "13px",
              fontWeight: 600, cursor: "pointer",
            }}>Kelola</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Nama", "Email"].map(h => (
                  <th key={h} style={{
                    padding: "10px 12px", textAlign: "left",
                    color: "#6b7280", fontWeight: 600, borderBottom: "1px solid #e5e7eb",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daftarPengguna.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 12px", color: "#374151", fontWeight: 500 }}>{u.id}</td>
                  <td style={{ padding: "10px 12px", color: i === 6 ? "#f97316" : "#374151" }}>{u.nama}</td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Kanan: Chart + Kesimpulan + Tips */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Chart */}
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Total Emisi Karbon Bulanan</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "16px" }}>Jumlah Emisi CO₂</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={emisiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} domain={[0, 70]} />
                <Tooltip
                  contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
                <Line
                  type="monotone" dataKey="emisi"
                  stroke="#14532d" strokeWidth={2}
                  dot={{ fill: "#14532d", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Kesimpulan + Tips */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{
              flex: 1, background: "#fff", borderRadius: "16px", padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                background: "#14532d", color: "#fff", borderRadius: "8px",
                padding: "4px 12px", fontSize: "13px", fontWeight: 700,
                display: "inline-block", marginBottom: "10px",
              }}>Kesimpulan</div>
              <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
                Emisi karbon mengalami fluktuasi, meningkat di awal dan pertengahan tahun, lalu menurun sebelum kembali naik di akhir tahun.
              </p>
            </div>

            <div style={{
              flex: 1, background: "#fff", borderRadius: "16px", padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                background: "#14532d", color: "#fff", borderRadius: "8px",
                padding: "4px 12px", fontSize: "13px", fontWeight: 700,
                display: "inline-block", marginBottom: "10px",
              }}>Tips</div>
              <ol style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.7, margin: 0, paddingLeft: "16px" }}>
                <li>Mengurangi penggunaan kendaraan pribadi dan beralih ke transportasi umum.</li>
                <li>Menghemat penggunaan listrik di rumah tangga.</li>
                <li>Menggunakan peralatan hemat energi.</li>
                <li>Meningkatkan kesadaran terhadap aktivitas yang menghasilkan emisi karbon.</li>
              </ol>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;