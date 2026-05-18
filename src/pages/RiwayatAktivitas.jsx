import { useState, useEffect } from "react";
import api from "../api";

const RiwayatAktivitas = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAktivitas = await api.get('/aktivitas');
        const aData = resAktivitas.data.data.map((item, index) => {
          const date = new Date(item.tanggal);
          return {
            no: index + 1,
            id: `ACT${item.id}`,
            tanggal: date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            waktu: date.toTimeString().slice(0, 5).replace(":", "."),
            aktivitas: item.kendaraan?.nama || '-',
            jumlah: `${item.jarak_km} km`,
            emisi: parseFloat(item.emisi_karbon),
          };
        });
        setData(aData);
      } catch (error) {
        console.error("Gagal mengambil data riwayat:", error);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter(row =>
    row.aktivitas.toLowerCase().includes(search.toLowerCase()) ||
    row.id.toLowerCase().includes(search.toLowerCase())
  );

  const card = { background: "#fff", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" };

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>
      <div style={{ ...card, padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>Riwayat Aktivitas</h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔍</span>
              <input type="text" placeholder="Cari" value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "10px 16px 10px 36px", borderRadius: "10px", border: "1.5px solid #d1fae5", background: "#fff", fontSize: "14px", fontFamily: "inherit", color: "#374151", outline: "none", width: "200px" }}
              />
            </div>
            <button style={{ padding: "10px 20px", borderRadius: "10px", border: "1.5px solid #d1fae5", background: "#fff", color: "#166534", fontSize: "14px", fontWeight: 600, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              ⚡ Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0fdf4" }}>
                {["No", "ID", "Tanggal", "Waktu", "Aktivitas", "Jumlah", "Emisi", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: 700, color: "#166534", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151", fontWeight: 500 }}>{row.no}.</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>{row.id}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>{row.tanggal}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>{row.waktu}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151", fontWeight: 500 }}>{row.aktivitas}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151", fontWeight: 700 }}>{row.jumlah}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#166534" }}>{row.emisi.toFixed(2)}</span>
                    <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600 }}>kg co₂</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{ width: "32px", height: "32px", background: "#dcfce7", border: "none", borderRadius: "8px", color: "#166534", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>▼</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Tidak ada data ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatAktivitas;