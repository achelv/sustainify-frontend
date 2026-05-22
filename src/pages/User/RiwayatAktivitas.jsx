import { useState, useEffect } from "react";
import api from "../../api";

const dummyData = [
  { no: 1, id: "ACT001", tanggal: "12 Juli 2025", waktu: "08.30", aktivitas: "Motor",        kategori: "Transportasi",  jumlah: "15 km",  emisi: 2.10 },
  { no: 2, id: "ACT002", tanggal: "12 Juli 2025", waktu: "12.00", aktivitas: "AC",           kategori: "Rumah Tangga", jumlah: "6 jam",  emisi: 1.80 },
  { no: 3, id: "ACT003", tanggal: "11 Juli 2025", waktu: "07.15", aktivitas: "Mobil",        kategori: "Transportasi",  jumlah: "22 km",  emisi: 3.52 },
  { no: 4, id: "ACT004", tanggal: "11 Juli 2025", waktu: "18.45", aktivitas: "Rice Cooker",  kategori: "Rumah Tangga", jumlah: "2 jam",  emisi: 0.42 },
  { no: 5, id: "ACT005", tanggal: "10 Juli 2025", waktu: "09.00", aktivitas: "Bus",          kategori: "Transportasi",  jumlah: "30 km",  emisi: 1.95 },
  { no: 6, id: "ACT006", tanggal: "10 Juli 2025", waktu: "20.00", aktivitas: "TV",           kategori: "Rumah Tangga", jumlah: "4 jam",  emisi: 0.60 },
  { no: 7, id: "ACT007", tanggal: "9 Juli 2025",  waktu: "08.00", aktivitas: "Sepeda Motor", kategori: "Transportasi",  jumlah: "10 km",  emisi: 1.40 },
  { no: 8, id: "ACT008", tanggal: "9 Juli 2025",  waktu: "19.30", aktivitas: "Kulkas",       kategori: "Rumah Tangga", jumlah: "24 jam", emisi: 0.96 },
];

// ── Overlay ──────────────────────────────────────────────────
const Overlay = ({ children, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.38)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div onClick={e => e.stopPropagation()} style={{
      background: "#fff", borderRadius: "16px",
      border: "1px solid #e5e7eb", padding: "24px",
      width: "360px", maxWidth: "95%",
    }}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ icon, title, sub, onClose }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: "38px", height: "38px", borderRadius: "10px",
        background: "#dcfce7", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "18px",
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</p>
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{sub}</p>
      </div>
    </div>
    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#9ca3af", lineHeight: 1, padding: 0 }}>×</button>
  </div>
);

// ── Modal Detail ─────────────────────────────────────────────
const ModalDetail = ({ row, onClose }) => (
  <Overlay onClose={onClose}>
    <ModalHeader
      icon={row.kategori === "Transportasi" ? "🚗" : "🏠"}
      title="Detail aktivitas"
      sub={row.id}
      onClose={onClose}
    />
    <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
      {[
        ["ID Aktivitas", row.id],
        ["Tanggal",      row.tanggal],
        ["Waktu",        row.waktu],
        ["Aktivitas",    row.aktivitas],
        ["Kategori",     row.kategori],
        ["Jumlah",       row.jumlah],
        ["Emisi",        `${row.emisi.toFixed(2)} kg co₂`],
      ].map(([label, val], i, arr) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "7px 0",
          borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
        }}>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{label}</span>
          <span style={{
            fontSize: i === arr.length - 1 ? "15px" : "13px",
            fontWeight: i === arr.length - 1 ? 800 : 600,
            color: i === arr.length - 1 ? "#166534" : "#111827",
          }}>{val}</span>
        </div>
      ))}
    </div>
    <button
      onClick={onClose}
      style={{ width: "100%", padding: "10px", borderRadius: "9px", background: "#166534", border: "none", color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}
    >
      Tutup
    </button>
  </Overlay>
);

// ── Modal Edit ───────────────────────────────────────────────
const ModalEdit = ({ row, onSave, onClose }) => {
  const [aktivitas, setAktivitas] = useState(row.aktivitas);
  const [jumlah,    setJumlah]    = useState(row.jumlah);
  const [kategori,  setKategori]  = useState(row.kategori);

  return (
    <Overlay onClose={onClose}>
      <ModalHeader icon="✏️" title="Edit aktivitas" sub={row.id} onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
        {[
          { label: "Tanggal", value: row.tanggal, disabled: true },
          { label: "Waktu",   value: row.waktu,   disabled: true },
        ].map(({ label, value, disabled }) => (
          <div key={label}>
            <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "5px" }}>{label}</label>
            <input value={value} disabled style={{ ...inpStyle, background: "#f9fafb", color: "#9ca3af", cursor: "not-allowed" }} />
          </div>
        ))}

        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "5px" }}>Kategori</label>
          <select value={kategori} onChange={e => setKategori(e.target.value)} style={inpStyle}>
            <option>Transportasi</option>
            <option>Rumah Tangga</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "5px" }}>Aktivitas</label>
          <input value={aktivitas} onChange={e => setAktivitas(e.target.value)} style={inpStyle} />
        </div>

        <div>
          <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "5px" }}>Jumlah</label>
          <input value={jumlah} onChange={e => setJumlah(e.target.value)} style={inpStyle} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onClose} style={btnSecondary}>Batal</button>
        <button onClick={() => onSave({ ...row, aktivitas, jumlah, kategori })} style={btnPrimary}>Simpan</button>
      </div>
    </Overlay>
  );
};

// ── Modal Hapus ──────────────────────────────────────────────
const ModalHapus = ({ row, onConfirm, onClose }) => (
  <Overlay onClose={onClose}>
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "14px",
        background: "#fef2f2", display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 14px", fontSize: "24px",
      }}>🗑️</div>
      <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>Hapus aktivitas?</p>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
        Aktivitas <strong>{row.aktivitas}</strong> ({row.id})
      </p>
      <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "22px" }}>
        Data yang dihapus tidak dapat dikembalikan.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onClose}   style={btnSecondary}>Batal</button>
        <button onClick={onConfirm} style={{ ...btnPrimary, background: "#dc2626" }}>Hapus</button>
      </div>
    </div>
  </Overlay>
);

// ── Dropdown aksi ⋮ ─────────────────────────────────────────
const AksiMenu = ({ onDetail, onEdit, onHapus }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "30px", height: "30px", borderRadius: "7px",
          background: "#f9fafb", border: "1px solid #e5e7eb",
          cursor: "pointer", fontSize: "17px", color: "#6b7280",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >⋮</button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{
            position: "absolute", right: 0, top: "34px",
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: "10px", zIndex: 100,
            minWidth: "130px", padding: "4px 0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}>
            {[
              { icon: "👁️", label: "Detail", color: "#166534", action: onDetail },
              { icon: "✏️", label: "Edit",   color: "#166534", action: onEdit   },
              { icon: "🗑️", label: "Hapus",  color: "#dc2626", action: onHapus  },
            ].map(({ icon, label, color, action }) => (
              <button
                key={label}
                onClick={() => { setOpen(false); action(); }}
                style={{
                  width: "100%", padding: "8px 14px",
                  border: "none", background: "none",
                  textAlign: "left", fontSize: "13px", color,
                  cursor: "pointer", display: "flex",
                  alignItems: "center", gap: "8px",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Badge kategori ───────────────────────────────────────────
const KategoriBadge = ({ kat }) => {
  const map = {
    Transportasi:   { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
    "Rumah Tangga": { background: "#fdf4ff", color: "#7e22ce", border: "1px solid #e9d5ff" },
  };
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, padding: "3px 10px",
      borderRadius: "20px", whiteSpace: "nowrap",
      ...(map[kat] || { background: "#f3f4f6", color: "#6b7280" }),
    }}>
      {kat}
    </span>
  );
};

// ── Main ─────────────────────────────────────────────────────
const RiwayatAktivitas = () => {
  const [search,         setSearch]         = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [showFilter,     setShowFilter]     = useState(false);
  const [data,           setData]           = useState([]);
  const [modal,          setModal]          = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transportasi
        const resT   = await api.get("/aktivitas");
        const labelMap = { ac: "Penggunaan AC", lampu: "Lampu", tv: "TV", kulkas: "Kulkas", ricecooker: "Rice Cooker", kipas: "Kipas Angin" };
        const mappedT = (resT.data.data ?? []).map((item) => {
          const date = new Date(item.tanggal);
          return {
            id:       `ACT${String(item.id).padStart(3, "0")}`,
            apiId:    item.id,
            tanggal:  date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            waktu:    date.toTimeString().slice(0, 5).replace(":", "."),
            aktivitas: item.kendaraan?.nama_kendaraan || "-",
            kategori: "Transportasi",
            jumlah:   `${item.jarak_km} km`,
            emisi:    parseFloat(item.emisi_karbon),
            _date:    new Date(item.tanggal),
          };
        });

        // Fetch rumah tangga
        const resR   = await api.get("/rumah-tangga");
        const mappedR = (resR.data.data ?? []).map((item) => {
          const date = new Date(item.tanggal);
          return {
            id:       `RT${String(item.id).padStart(3, "0")}`,
            apiId:    item.id,
            tanggal:  date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            waktu:    date.toTimeString().slice(0, 5).replace(":", "."),
            aktivitas: labelMap[item.jenis_aktivitas] || item.jenis_aktivitas,
            kategori: "Rumah Tangga",
            jumlah:   `${item.durasi_jam} jam`,
            emisi:    parseFloat(item.emisi_karbon),
            _date:    new Date(item.tanggal),
          };
        });

        // Gabungkan, urutkan terbaru, kasih nomor urut
        const combined = [...mappedT, ...mappedR]
          .sort((a, b) => b._date - a._date)
          .map((r, i) => ({ ...r, no: i + 1 }));

        setData(combined);
      } catch (err) {
        console.error("Gagal fetch data:", err);
        setData(dummyData);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter(row => {
    const matchSearch =
      row.aktivitas.toLowerCase().includes(search.toLowerCase()) ||
      row.id.toLowerCase().includes(search.toLowerCase());
    const matchKategori =
      filterKategori === "Semua" || row.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const handleSaveEdit = (updated) => {
    setData(prev => prev.map(r => r.id === updated.id ? updated : r));
    setModal(null);
  };

  const handleHapus = (id) => {
    setData(prev => prev.filter(r => r.id !== id).map((r, i) => ({ ...r, no: i + 1 })));
    setModal(null);
  };

  const kategoriOptions = ["Semua", "Transportasi", "Rumah Tangga"];

  const thStyle = {
    padding: "12px 16px", textAlign: "center",
    fontSize: "13px", fontWeight: 700,
    color: "#166534", whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "13px 16px", fontSize: "13px",
    color: "#374151", textAlign: "center",
  };

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>
      <div style={{
        background: "#fff", borderRadius: "16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        border: "1px solid #f3f4f6", padding: "28px",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>Riwayat Aktivitas</h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" placeholder="Cari aktivitas..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "9px 16px 9px 36px", borderRadius: "10px", border: "1.5px solid #d1fae5", background: "#fff", fontSize: "13px", fontFamily: "inherit", color: "#374151", outline: "none", width: "200px" }}
              />
            </div>

            {/* Filter */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowFilter(p => !p)}
                style={{ padding: "9px 16px", borderRadius: "10px", border: "1.5px solid #d1fae5", background: filterKategori !== "Semua" ? "#f0fdf4" : "#fff", color: "#166534", fontSize: "13px", fontWeight: 600, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                {filterKategori === "Semua" ? "Filter" : filterKategori}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showFilter && (
                <>
                  <div onClick={() => setShowFilter(false)} style={{ position: "fixed", inset: 0, zIndex: 80 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "6px", zIndex: 100, minWidth: "160px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                    {kategoriOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setFilterKategori(opt); setShowFilter(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", border: "none", borderRadius: "8px", background: filterKategori === opt ? "#f0fdf4" : "transparent", color: filterKategori === opt ? "#166534" : "#374151", fontSize: "13px", fontWeight: filterKategori === opt ? 700 : 400, fontFamily: "inherit", cursor: "pointer", textAlign: "left" }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Filter badge aktif */}
        {filterKategori !== "Semua" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Filter aktif:</span>
            <KategoriBadge kat={filterKategori} />
            <button onClick={() => setFilterKategori("Semua")} style={{ fontSize: "11px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
              ✕ Hapus filter
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0fdf4" }}>
                {["No", "ID", "Tanggal", "Waktu", "Aktivitas", "Kategori", "Jumlah", "Emisi", "Aksi"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...tdStyle, color: "#9ca3af" }}>{row.no}.</td>
                    <td style={{ ...tdStyle, fontSize: "11px", color: "#9ca3af" }}>{row.id}</td>
                    <td style={tdStyle}>{row.tanggal}</td>
                    <td style={tdStyle}>{row.waktu}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "#111827" }}>{row.aktivitas}</td>
                    <td style={tdStyle}><KategoriBadge kat={row.kategori} /></td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.jumlah}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#166534" }}>{row.emisi.toFixed(2)}</span>
                      <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "2px" }}>kg co₂</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <AksiMenu
                          onDetail={() => setModal({ mode: "detail", row })}
                          onEdit={()   => setModal({ mode: "edit",   row })}
                          onHapus={()  => setModal({ mode: "hapus",  row })}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#9ca3af" }}>
          Menampilkan {filtered.length} dari {data.length} data
        </div>
      </div>

      {/* Modals */}
      {modal?.mode === "detail" && (
        <ModalDetail row={modal.row} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "edit" && (
        <ModalEdit row={modal.row} onSave={handleSaveEdit} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "hapus" && (
        <ModalHapus row={modal.row} onConfirm={() => handleHapus(modal.row.id)} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default RiwayatAktivitas;

// ── Shared styles ────────────────────────────────────────────
const inpStyle = {
  width: "100%", padding: "9px 11px", borderRadius: "8px",
  border: "1px solid #e5e7eb", background: "#fff",
  color: "#111827", fontSize: "13px", fontFamily: "inherit",
};
const btnPrimary = {
  flex: 1, padding: "10px", borderRadius: "9px",
  background: "#166534", border: "none", color: "#fff",
  fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
};
const btnSecondary = {
  flex: 1, padding: "10px", borderRadius: "9px",
  background: "#f9fafb", border: "1px solid #e5e7eb",
  color: "#6b7280", fontSize: "13px", fontFamily: "inherit", cursor: "pointer",
};