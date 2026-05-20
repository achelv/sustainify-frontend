import { useState } from "react";

const initialUsers = [
  { id: "K00T21", nama: "Andi Rahma", email: "andi@gmail.com", emisi: 24.5, status: "Aktif" },
  { id: "K00T32", nama: "Budi Pratama", email: "budi@email.com", emisi: 12, status: "Aktif" },
  { id: "K00T02", nama: "Nabila Putri", email: "nabila@email.com", emisi: 13.7, status: "Aktif" },
  { id: "K00T12", nama: "Rizky Hidayat", email: "rizky@gmail.com", emisi: 20, status: "Nonaktif" },
  { id: "K00T05", nama: "Siti Rahma", email: "siti@gmail.com", emisi: 18.4, status: "Aktif" },
  { id: "K00T29", nama: "Bobi", email: "bobi@gmail.com", emisi: 11, status: "Aktif" },
  { id: "K00T15", nama: "Amara", email: "amara@gmail.com", emisi: 19.2, status: "Nonaktif" },
  { id: "K00T13", nama: "Budi Hariyanto", email: "budihar@gmail.com", emisi: 15, status: "Aktif" },
];

// ── Icons ────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// ── Overlay/Modal wrapper ────────────────────────────────────
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
  padding: "32px", width: "420px", maxWidth: "90vw",
};

// ── Modal: Detail User ───────────────────────────────────────
const DetailModal = ({ user, onClose }) => (
  <Overlay onClose={onClose}>
    <div style={modalBox}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#14532d" }}>Detail Pengguna</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#14532d", marginBottom: "12px",
        }}><UserIcon /></div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>{user.nama}</div>
        <div style={{
          marginTop: "6px", padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
          background: user.status === "Aktif" ? "#dcfce7" : "#fee2e2",
          color: user.status === "Aktif" ? "#14532d" : "#dc2626",
        }}>{user.status}</div>
      </div>
      {[
        ["ID Pengguna", user.id],
        ["Email", user.email],
        ["Emisi Karbon", `${user.emisi} kg CO₂`],
        ["Status", user.status],
      ].map(([label, val]) => (
        <div key={label} style={{
          display: "flex", justifyContent: "space-between",
          padding: "10px 0", borderBottom: "1px solid #f3f4f6", fontSize: "14px",
        }}>
          <span style={{ color: "#6b7280" }}>{label}</span>
          <span style={{ fontWeight: 600, color: "#111827" }}>{val}</span>
        </div>
      ))}
      <button onClick={onClose} style={{
        marginTop: "24px", width: "100%", padding: "11px",
        background: "#14532d", color: "#fff", border: "none",
        borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "14px",
      }}>Tutup</button>
    </div>
  </Overlay>
);

// ── Modal: Tambah/Edit User ──────────────────────────────────
const FormModal = ({ user, onClose, onSave }) => {
  const isEdit = !!user;
  const [form, setForm] = useState(user || { id: "", nama: "", email: "", emisi: "", status: "Aktif" });

  const handleChange = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSave = () => {
    if (!form.nama || !form.email) return;
    onSave({
      ...form,
      emisi: parseFloat(form.emisi) || 0,
      id: form.id || `K00T${Math.floor(Math.random() * 90 + 10)}`,
    });
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "10px", fontSize: "13px", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <Overlay onClose={onClose}>
      <div style={modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#14532d" }}>
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
        </div>

        {[
          { label: "Nama", field: "nama", type: "text", placeholder: "Nama lengkap" },
          { label: "Email", field: "email", type: "email", placeholder: "email@gmail.com" },
          { label: "Emisi Karbon (kg CO₂)", field: "emisi", type: "number", placeholder: "0.0" },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field} style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{label}</label>
            <input
              type={type} value={form[field]} placeholder={placeholder}
              onChange={e => handleChange(field, e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#14532d"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
        ))}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Status</label>
          <select value={form.status} onChange={e => handleChange("status", e.target.value)}
            style={{ ...inputStyle, background: "#fff" }}>
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "14px",
          }}>Batal</button>
          <button onClick={handleSave} style={{
            flex: 1, padding: "11px", background: "#14532d", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "14px",
          }}>Simpan</button>
        </div>
      </div>
    </Overlay>
  );
};

// ── Modal: Konfirmasi Hapus ──────────────────────────────────
const DeleteModal = ({ user, onClose, onConfirm }) => (
  <Overlay onClose={onClose}>
    <div style={{ ...modalBox, width: "360px", textAlign: "center" }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "50%",
        background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px", color: "#dc2626",
      }}>
        <TrashIcon />
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700, color: "#111827" }}>Hapus Pengguna?</h3>
      <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
        Kamu yakin ingin menghapus <strong>{user.nama}</strong>? Aksi ini tidak bisa dibatalkan.
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "11px", background: "#f3f4f6", color: "#374151",
          border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
        }}>Batal</button>
        <button onClick={() => { onConfirm(user.id); onClose(); }} style={{
          flex: 1, padding: "11px", background: "#dc2626", color: "#fff",
          border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
        }}>Hapus</button>
      </div>
    </div>
  </Overlay>
);

// ── Modal: Filter ────────────────────────────────────────────
const FilterModal = ({ filter, onClose, onApply }) => {
  const [local, setLocal] = useState(filter);
  return (
    <Overlay onClose={onClose}>
      <div style={{ ...modalBox, width: "340px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#14532d" }}>Filter</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Status</label>
          {["Semua", "Aktif", "Nonaktif"].map(s => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
              <input type="radio" name="status" checked={local.status === s}
                onChange={() => setLocal(p => ({ ...p, status: s }))} />
              {s}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
            Emisi Karbon maks: <strong>{local.maxEmisi} kg</strong>
          </label>
          <input type="range" min="0" max="50" value={local.maxEmisi}
            onChange={e => setLocal(p => ({ ...p, maxEmisi: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: "#14532d" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
            <span>0 kg</span><span>50 kg</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => { setLocal({ status: "Semua", maxEmisi: 50 }); }} style={{
            flex: 1, padding: "11px", background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
          }}>Reset</button>
          <button onClick={() => { onApply(local); onClose(); }} style={{
            flex: 1, padding: "11px", background: "#14532d", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer",
          }}>Terapkan</button>
        </div>
      </div>
    </Overlay>
  );
};

// ── Main Component ───────────────────────────────────────────
const ManajemenUser = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ status: "Semua", maxEmisi: 50 });
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [modal, setModal] = useState(null); // { type: "detail"|"edit"|"delete"|"tambah"|"filter", user? }

  const filtered = users.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter.status === "Semua" || u.status === filter.status;
    const matchEmisi = u.emisi <= filter.maxEmisi;
    return matchSearch && matchStatus && matchEmisi;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const totalAktif = users.filter(u => u.status === "Aktif").length;
  const totalNonaktif = users.filter(u => u.status === "Nonaktif").length;

  const handleSave = (data) => {
    if (users.find(u => u.id === data.id)) {
      setUsers(prev => prev.map(u => u.id === data.id ? data : u));
    } else {
      setUsers(prev => [...prev, data]);
    }
  };

  const handleDelete = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const StatCard = ({ label, value, sub, color, bg }) => (
    <div style={{
      background: "#fff", borderRadius: "14px", padding: "18px 22px",
      flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>{value}</div>
      <div style={{ fontSize: "11px", color, marginTop: "4px" }}>{sub}</div>
    </div>
  );

  const btnAksi = (bg, hoverBg, onClick, children, title) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button title={title} onClick={onClick}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          width: "30px", height: "30px", borderRadius: "8px", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          background: hovered ? hoverBg : bg, transition: "background 0.15s",
          color: hovered ? "#fff" : "#374151",
        }}>
        {children}
      </button>
    );
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{
          background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "14px",
          padding: "20px 28px", flex: "0 0 200px", boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Selamat datang,<br />Admin!</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>Aktivitas meningkat 8%<br />dari kemarin.</div>
        </div>
        <StatCard label="Total Pengguna" value={users.length} sub="+12 bulan ini" color="#22c55e" />
        <StatCard label="Aktif" value={totalAktif} sub="↑ 6% dari bulan lalu" color="#22c55e" />
        <StatCard label="Nonaktif" value={totalNonaktif} sub="↓ 10% dari bulan lalu" color="#ef4444" />
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>Manajemen User</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><SearchIcon /></span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                style={{
                  padding: "8px 12px 8px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
                  fontSize: "13px", outline: "none", width: "180px", fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = "#14532d"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
            {/* Filter */}
            <button onClick={() => setModal({ type: "filter" })} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
              background: filter.status !== "Semua" || filter.maxEmisi < 50 ? "#dcfce7" : "#fff",
              color: "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 500,
            }}>
              <FilterIcon /> Filter {filter.status !== "Semua" || filter.maxEmisi < 50 ? "✓" : ""}
            </button>
            {/* Tambah */}
            <button onClick={() => setModal({ type: "tambah" })} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "36px", height: "36px", background: "#14532d", color: "#fff",
              border: "none", borderRadius: "10px", cursor: "pointer",
            }}><PlusIcon /></button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Nama", "Email", "Emisi Karbon", "Status", "Aksi"].map(h => (
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
              ) : paginated.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "11px 14px", color: "#6b7280", fontWeight: 500 }}>{u.id}</td>
                  <td style={{ padding: "11px 14px", color: "#111827", fontWeight: 500 }}>{u.nama}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{u.email}</td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{u.emisi} kg CO₂</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                      background: u.status === "Aktif" ? "#dcfce7" : "#fee2e2",
                      color: u.status === "Aktif" ? "#14532d" : "#dc2626",
                    }}>{u.status}</span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {/* Detail */}
                      <button title="Detail" onClick={() => setModal({ type: "detail", user: u })}
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                        onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
                      ><EyeIcon /></button>
                      {/* Edit */}
                      <button title="Edit" onClick={() => setModal({ type: "edit", user: u })}
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#fefce8", color: "#ca8a04", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#ca8a04"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fefce8"}
                      ><EditIcon /></button>
                      {/* Hapus */}
                      <button title="Hapus" onClick={() => setModal({ type: "delete", user: u })}
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fee2e2"}
                      ><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
                background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", color: "#374151",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
              }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid",
                borderColor: page === n ? "#14532d" : "#e5e7eb",
                background: page === n ? "#14532d" : "#fff",
                color: page === n ? "#fff" : "#374151",
                cursor: "pointer", fontSize: "13px", fontWeight: 600,
              }}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{
                width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb",
                background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", color: "#374151",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
              }}>›</button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "detail" && <DetailModal user={modal.user} onClose={() => setModal(null)} />}
      {modal?.type === "edit" && <FormModal user={modal.user} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "tambah" && <FormModal user={null} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === "delete" && <DeleteModal user={modal.user} onClose={() => setModal(null)} onConfirm={handleDelete} />}
      {modal?.type === "filter" && <FilterModal filter={filter} onClose={() => setModal(null)} onApply={f => { setFilter(f); setPage(1); }} />}
    </div>
  );
};

export default ManajemenUser;
