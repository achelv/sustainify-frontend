import { useState } from "react";

const initialData = [
  { id: 1, nama: "Budi Pratama", tanggal: "2026-05-06", aktivitas: "Transportasi", emisi: 0.4 },
  { id: 2, nama: "Nabila Putri", tanggal: "2026-05-06", aktivitas: "Transportasi", emisi: 1.0 },
  { id: 3, nama: "Rizky Hidayat", tanggal: "2026-05-06", aktivitas: "Rumah Tangga", emisi: 1.2 },
  { id: 4, nama: "Siti Rahma", tanggal: "2026-05-06", aktivitas: "Transportasi", emisi: 0.8 },
  { id: 5, nama: "Bobi", tanggal: "2026-05-06", aktivitas: "Transportasi", emisi: 1.0 },
  { id: 6, nama: "Amara", tanggal: "2026-05-06", aktivitas: "Rumah Tangga", emisi: 0.7 },
  { id: 7, nama: "Budi Hariyanto", tanggal: "2026-05-06", aktivitas: "Rumah Tangga", emisi: 0.9 },
  { id: 8, nama: "Andi Rahma", tanggal: "2026-04-07", aktivitas: "Transportasi", emisi: 0.5 },
  { id: 9, nama: "Nabila Putri", tanggal: "2026-04-07", aktivitas: "Rumah Tangga", emisi: 1.1 },
];

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
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
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

const uniqueDates = [...new Set(initialData.map(d => d.tanggal))].sort((a, b) => new Date(b) - new Date(a));

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

// ── Modal Form Tambah/Edit ───────────────────────────────────
const FormModal = ({ data, onClose, onSave }) => {
  const isEdit = !!data;
  const [form, setForm] = useState(data || { nama: "", tanggal: "", aktivitas: "Transportasi", emisi: "" });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = () => {
    if (!form.nama || !form.tanggal) return;
    onSave({ ...form, emisi: parseFloat(form.emisi) || 0, id: form.id || Date.now() });
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "10px", fontSize: "13px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
  };

  return (
    <Overlay onClose={onClose}>
      <div style={modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#14532d" }}>
            {isEdit ? "Edit Data Karbon" : "Tambah Data Karbon"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
        </div>

        {[
          { label: "Nama Pengguna", field: "nama", type: "text", placeholder: "Nama lengkap" },
          { label: "Tanggal", field: "tanggal", type: "date", placeholder: "" },
          { label: "Emisi Karbon (kg CO₂)", field: "emisi", type: "number", placeholder: "0.0" },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field} style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{label}</label>
            <input type={type} value={form[field]} placeholder={placeholder}
              onChange={e => set(field, e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#14532d"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
          </div>
        ))}

        <div style={{ marginBottom: "22px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Aktivitas</label>
          <select value={form.aktivitas} onChange={e => set("aktivitas", e.target.value)}
            style={{ ...inputStyle, background: "#fff" }}>
            <option>Transportasi</option>
            <option>Rumah Tangga</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
          }}>Batal</button>
          <button onClick={handleSave} style={{
            flex: 1, padding: "11px", background: "#14532d", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
          }}>Simpan</button>
        </div>
      </div>
    </Overlay>
  );
};

// ── Modal Konfirmasi Hapus ───────────────────────────────────
const DeleteModal = ({ data, onClose, onConfirm }) => (
  <Overlay onClose={onClose}>
    <div style={{ ...modalBox, width: "340px", textAlign: "center" }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "50%", background: "#fee2e2",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px", color: "#dc2626",
      }}><TrashIcon /></div>
      <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 700 }}>Hapus Data?</h3>
      <p style={{ margin: "0 0 22px", fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
        Hapus data karbon milik <strong>{data.nama}</strong>?<br />Aksi ini tidak bisa dibatalkan.
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "10px", background: "#f3f4f6", color: "#374151",
          border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
        }}>Batal</button>
        <button onClick={() => { onConfirm(data.id); onClose(); }} style={{
          flex: 1, padding: "10px", background: "#dc2626", color: "#fff",
          border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
        }}>Hapus</button>
      </div>
    </div>
  </Overlay>
);

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
          <input type="range" min="0" max="5" step="0.1" value={local.maxEmisi}
            onChange={e => setLocal(p => ({ ...p, maxEmisi: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: "#14532d" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
            <span>0 kg</span><span>5 kg</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLocal({ aktivitas: "Semua", maxEmisi: 5 })} style={{
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
  const [records, setRecords] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ aktivitas: "Semua", maxEmisi: 5 });
  const [dateIdx, setDateIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const perPage = 7;

  const allDates = [...new Set(records.map(d => d.tanggal))].sort((a, b) => new Date(b) - new Date(a));
  const selectedDate = allDates[dateIdx] || "";

  const filtered = records.filter(r => {
    const matchDate = r.tanggal === selectedDate;
    const matchSearch = r.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.aktivitas.toLowerCase().includes(search.toLowerCase());
    const matchAkt = filter.aktivitas === "Semua" || r.aktivitas === filter.aktivitas;
    const matchEmisi = r.emisi <= filter.maxEmisi;
    return matchDate && matchSearch && matchAkt && matchEmisi;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalEmisi = records.reduce((s, r) => s + r.emisi, 0).toFixed(1);
  const totalAktivitas = records.length;

  const handleSave = (data) => {
    if (records.find(r => r.id === data.id)) {
      setRecords(prev => prev.map(r => r.id === data.id ? data : r));
    } else {
      setRecords(prev => [...prev, data]);
    }
  };

  const handleDelete = (id) => setRecords(prev => prev.filter(r => r.id !== id));

  const isFilterActive = filter.aktivitas !== "Semua" || filter.maxEmisi < 5;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{
          background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "14px",
          padding: "20px 28px", flex: "0 0 200px", boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Selamat datang,<br />Admin!</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>Aktivitas meningkat 8%<br />dari kemarin.</div>
        </div>
        {[
          { label: "Total Pengguna", val: "250", sub: "+12 bulan ini" },
          { label: "Total Emisi", val: `${totalEmisi} kg CO₂`, sub: "↑ 8% dari kemarin" },
          { label: "Total Aktivitas", val: totalAktivitas, sub: "↓ 2% dari kemarin" },
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
            <button onClick={() => setModal({ type: "tambah" })} style={{
              width: "36px", height: "36px", background: "#14532d", color: "#fff",
              border: "none", borderRadius: "10px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><PlusIcon /></button>
          </div>
        </div>

        {/* Date navigator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "#14532d", borderRadius: "10px", padding: "6px 14px",
            color: "#fff", fontSize: "13px", fontWeight: 600,
          }}>
            <span>{selectedDate ? formatTanggal(selectedDate) : "—"}</span>
            <button onClick={() => setDateIdx(p => Math.min(allDates.length - 1, p + 1))}
              disabled={dateIdx >= allDates.length - 1}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}>
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["NO", "Nama", "Tanggal", "Aktivitas", "Emisi Karbon", "Aksi"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", color: "#6b7280",
                    fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>Tidak ada data</td></tr>
              ) : paginated.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{(page - 1) * perPage + i + 1}.</td>
                  <td style={{ padding: "11px 14px", fontWeight: 500, color: "#111827" }}>{r.nama}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{formatTanggal(r.tanggal)}</td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{r.aktivitas}</td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{r.emisi} kg CO₂</td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button title="Edit" onClick={() => setModal({ type: "edit", data: r })}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#14532d", padding: "4px", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#166534"}
                        onMouseLeave={e => e.currentTarget.style.color = "#14532d"}>
                        <EditIcon />
                      </button>
                      <span style={{ color: "#e5e7eb" }}>|</span>
                      <button title="Hapus" onClick={() => setModal({ type: "delete", data: r })}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "4px", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#b91c1c"}
                        onMouseLeave={e => e.currentTarget.style.color = "#dc2626"}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{
              width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
              background: "#14532d", color: "#fff", cursor: page === 1 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><ChevronLeft /></button>
          <button onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages}
            style={{
              width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
              background: "#14532d", color: "#fff", cursor: page >= totalPages ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><ChevronRight /></button>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "tambah" && <FormModal data={null} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "edit" && <FormModal data={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "delete" && <DeleteModal data={modal.data} onClose={() => setModal(null)} onConfirm={handleDelete} />}
      {modal?.type === "filter" && <FilterModal filter={filter} onClose={() => setModal(null)} onApply={f => { setFilter(f); setPage(1); }} />}
    </div>
  );
};

export default RiwayatKarbon;
