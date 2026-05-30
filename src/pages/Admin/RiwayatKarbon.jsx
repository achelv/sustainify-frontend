import React, { useState, useEffect } from "react";
import api from "../../api";

// ── Icons ────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────
const formatTanggal = (str) => {
  const d = new Date(str);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

// ── Overlay ──────────────────────────────────────────────────
const Overlay = ({ onClose, children }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(2px)",
  }}>
    <div onClick={e => e.stopPropagation()}>{children}</div>
  </div>
);

const modalBox = {
  background: "#fff", borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  padding: "32px", width: "400px", maxWidth: "90vw",
};

// ── Modal Filter ─────────────────────────────────────────────
const FilterModal = ({ filter, onClose, onApply }) => {
  const [local, setLocal] = useState(filter);
  return (
    <Overlay onClose={onClose}>
      <div style={{ ...modalBox, width: "320px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#14532d" }}>Filter</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Aktivitas</label>
          {["Semua", "Transportasi", "Rumah Tangga"].map(a => (
            <label key={a} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", cursor: "pointer", fontSize: "13px" }}>
              <input type="radio" name="aktivitas" checked={local.aktivitas === a}
                onChange={() => setLocal(p => ({ ...p, aktivitas: a }))} style={{ accentColor: "#14532d" }} />
              {a}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
            Emisi maks: <strong>{local.maxEmisi} kg CO₂</strong>
          </label>
          <input type="range" min="0" max="100" step="0.1" value={local.maxEmisi}
            onChange={e => setLocal(p => ({ ...p, maxEmisi: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: "#14532d" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
            <span>0 kg</span><span>100 kg</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLocal({ aktivitas: "Semua", maxEmisi: 100 })} style={{
            flex: 1, padding: "10px", background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
          }}>Reset</button>
          <button onClick={() => { onApply(local); onClose(); }} style={{
            flex: 1, padding: "10px", background: "#14532d", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
          }}>Terapkan</button>
        </div>
      </div>
    </Overlay>
  );
};

// ── Main Component ───────────────────────────────────────────
const RiwayatKarbon = () => {
  const [records,  setRecords]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState({ aktivitas: "Semua", maxEmisi: 100 });
  const [page,     setPage]     = useState(1);
  const [modal,    setModal]    = useState(null);
  const perPage = 7;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/aktivitas");
      setRecords(res.data.data ?? []);
    } catch (err) {
      console.error("Gagal fetch aktivitas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Ambil semua tanggal unik ─────────────────────────────
  const allDates = [...new Set(records.map(r => {
    const d = new Date(r.tanggal);
    return d.toISOString().split("T")[0];
  }))].sort((a, b) => new Date(b) - new Date(a));

  const [dateIdx, setDateIdx] = useState(0);
  const selectedDate = allDates[dateIdx] || "";

  const filtered = records.filter(r => {
    const rDate = new Date(r.tanggal).toISOString().split("T")[0];
    const matchDate   = selectedDate ? rDate === selectedDate : true;
    const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.aktivitas.toLowerCase().includes(search.toLowerCase());
    const matchAkt    = filter.aktivitas === "Semua" || r.aktivitas === filter.aktivitas;
    const matchEmisi  = r.emisi <= filter.maxEmisi;
    return matchDate && matchSearch && matchAkt && matchEmisi;
  });

  const totalPages    = Math.ceil(filtered.length / perPage);
  const paginated     = filtered.slice((page - 1) * perPage, page * perPage);
  const totalEmisi    = records.reduce((s, r) => s + r.emisi, 0).toFixed(2);
  const totalAktivitas = records.length;
  const isFilterActive = filter.aktivitas !== "Semua" || filter.maxEmisi < 100;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{
          background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "14px",
          padding: "20px 28px", flex: "0 0 200px", boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Selamat datang,<br />Admin!</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>Data karbon pengguna.</div>
        </div>
        {[
          { label: "Total Emisi",     val: `${totalEmisi} kg CO₂`, sub: "Semua pengguna" },
          { label: "Total Aktivitas", val: totalAktivitas,          sub: "Semua aktivitas" },
        ].map(({ label, val, sub }) => (
          <div key={label} style={{
            background: "#fff", borderRadius: "14px", padding: "18px 22px",
            flex: 1, minWidth: "130px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#111827" }}>{val}</div>
            <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "4px" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Riwayat Data Karbon Pengguna</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><SearchIcon /></span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                style={{
                  padding: "8px 12px 8px 32px", border: "1.5px solid #e5e7eb",
                  borderRadius: "10px", fontSize: "13px", outline: "none", width: "160px", fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = "#14532d"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>
            <button onClick={() => setModal({ type: "filter" })} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
              background: isFilterActive ? "#dcfce7" : "#fff",
              color: "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 500,
            }}>
              <FilterIcon /> Filter {isFilterActive ? "✓" : ""}
            </button>
          </div>
        </div>

        {/* Date navigator */}
        {allDates.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#14532d", borderRadius: "10px", padding: "6px 14px",
              color: "#fff", fontSize: "13px", fontWeight: 600,
            }}>
              <button
                onClick={() => setDateIdx(p => Math.max(0, p - 1))}
                disabled={dateIdx === 0}
                style={{ background: "none", border: "none", cursor: dateIdx === 0 ? "not-allowed" : "pointer", color: "#fff", padding: 0, display: "flex", opacity: dateIdx === 0 ? 0.4 : 1 }}>
                <ChevronLeft />
              </button>
              <span>{selectedDate ? formatTanggal(selectedDate) : "—"}</span>
              <button
                onClick={() => setDateIdx(p => Math.min(allDates.length - 1, p + 1))}
                disabled={dateIdx >= allDates.length - 1}
                style={{ background: "none", border: "none", cursor: dateIdx >= allDates.length - 1 ? "not-allowed" : "pointer", color: "#fff", padding: 0, display: "flex", opacity: dateIdx >= allDates.length - 1 ? 0.4 : 1 }}>
                <ChevronRight />
              </button>
            </div>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              {filtered.length} aktivitas pada tanggal ini
            </span>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["NO", "Nama", "Tanggal", "Kategori", "Detail", "Jumlah", "Emisi Karbon"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", color: "#6b7280",
                    fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>Memuat data...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>Tidak ada data</td></tr>
              ) : paginated.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{(page - 1) * perPage + i + 1}.</td>
                  <td style={{ padding: "11px 14px", fontWeight: 500, color: "#111827" }}>{r.nama}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{formatTanggal(r.tanggal)}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                      background: r.aktivitas === "Transportasi" ? "#eff6ff" : "#fdf4ff",
                      color:      r.aktivitas === "Transportasi" ? "#1d4ed8" : "#7e22ce",
                    }}>{r.aktivitas}</span>
                  </td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{r.detail}</td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{r.jumlah}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#14532d" }}>{r.emisi}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>kg CO₂</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            Menampilkan {paginated.length} dari {filtered.length} data
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
                background: "#14532d", color: "#fff", cursor: page === 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: page === 1 ? 0.5 : 1,
              }}><ChevronLeft /></button>
            <button onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages}
              style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
                background: "#14532d", color: "#fff", cursor: page >= totalPages ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: page >= totalPages ? 0.5 : 1,
              }}><ChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "filter" && (
        <FilterModal filter={filter} onClose={() => setModal(null)} onApply={f => { setFilter(f); setPage(1); }} />
      )}
    </div>
  );
};

export default RiwayatKarbon;