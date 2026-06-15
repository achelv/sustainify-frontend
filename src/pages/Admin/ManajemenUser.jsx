import React, { useState, useEffect } from "react";
import api from "../../api";

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
  padding: "32px", width: "420px", maxWidth: "90vw",
};

// ── Modal Detail ─────────────────────────────────────────────
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
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>{user.name}</div>
      </div>
      {[
        ["ID Pengguna",  user.id],
        ["Email",        user.email],
        ["Emisi Karbon", `${user.emisi} kg CO₂`],
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

// ── Modal Edit ────────────────────────────────────────────────
const FormModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      await api.put(`/admin/users/${user.id}`, { name: form.name, email: form.email });
      onSave();
      onClose();
    } catch (err) {
      console.error("Gagal simpan user:", err);
    } finally {
      setLoading(false);
    }
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
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#14532d" }}>Edit Pengguna</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
        </div>
        {[
          { label: "Nama",  field: "name",  type: "text",  placeholder: "Nama lengkap" },
          { label: "Email", field: "email", type: "email", placeholder: "email@gmail.com" },
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
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "14px",
          }}>Batal</button>
          <button onClick={handleSave} disabled={loading} style={{
            flex: 1, padding: "11px", background: "#14532d", color: "#fff",
            border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "14px",
            opacity: loading ? 0.7 : 1,
          }}>{loading ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </div>
    </Overlay>
  );
};

// ── Modal Hapus ──────────────────────────────────────────────
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
        Kamu yakin ingin menghapus <strong>{user.name}</strong>? Aksi ini tidak bisa dibatalkan.
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

// ── Modal Filter ─────────────────────────────────────────────
const FilterModal = ({ filter, onClose, onApply }) => {
  const [local, setLocal] = useState(filter);
  return (
    <Overlay onClose={onClose}>
      <div style={{ ...modalBox, width: "340px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#14532d" }}>Filter</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><CloseIcon /></button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
            Emisi Karbon maks: <strong>{local.maxEmisi} kg</strong>
          </label>
          <input type="range" min="0" max="500" value={local.maxEmisi}
            onChange={e => setLocal(p => ({ ...p, maxEmisi: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: "#14532d" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af" }}>
            <span>0 kg</span><span>500 kg</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLocal({ maxEmisi: 500 })} style={{
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
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState({ maxEmisi: 500 });
  const [page,    setPage]    = useState(1);
  const perPage = 8;
  const [modal, setModal] = useState(null);

  // ✅ Fix: fetch users + emisi dari stats lalu gabungkan
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [resUsers, resStats] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stats"),
      ]);

      // Handle berbagai format response
      const userData = resUsers.data?.data ?? resUsers.data ?? [];

      // Buat map emisi per user dari stats
      const emisiMap = {};
      (resStats.data?.emisi_per_user ?? []).forEach(e => {
        emisiMap[e.id] = e.total_emisi;
      });

      // Gabungkan emisi ke data user
      const usersWithEmisi = (Array.isArray(userData) ? userData : []).map(u => ({
        ...u,
        emisi: emisiMap[u.id] ?? 0,
      }));

      setUsers(usersWithEmisi);
    } catch (err) {
      console.error("Gagal fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search);
    const matchEmisi = (u.emisi ?? 0) <= filter.maxEmisi;
    return matchSearch && matchEmisi;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      await fetchUsers();
    } catch (err) {
      console.error("Gagal hapus user:", err);
    }
  };

  const StatCard = ({ label, value, sub, color }) => (
    <div style={{
      background: "#fff", borderRadius: "14px", padding: "18px 22px",
      flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>{value}</div>
      <div style={{ fontSize: "11px", color, marginTop: "4px" }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{
          background: "linear-gradient(135deg, #14532d, #166534)", borderRadius: "14px",
          padding: "20px 28px", flex: "0 0 200px", boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
        }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Selamat datang,<br />Admin!</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>Kelola data pengguna.</div>
        </div>
        <StatCard
          label="Total Pengguna"
          value={users.length}
          sub="Pengguna terdaftar"
          color="#22c55e"
        />
        <StatCard
          label="Total Emisi"
          value={`${users.reduce((s, u) => s + (u.emisi ?? 0), 0).toFixed(2)} kg`}
          sub="Semua pengguna"
          color="#22c55e"
        />
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>Manajemen User</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><SearchIcon /></span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                style={{
                  padding: "8px 12px 8px 36px", border: "1.5px solid #e5e7eb",
                  borderRadius: "10px", fontSize: "13px", outline: "none",
                  width: "180px", fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = "#14532d"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
            <button onClick={() => setModal({ type: "filter" })} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
              background: filter.maxEmisi < 500 ? "#dcfce7" : "#fff",
              color: "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 500,
            }}>
              <FilterIcon /> Filter {filter.maxEmisi < 500 ? "✓" : ""}
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Nama", "Email", "Emisi Karbon", "Aksi"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", color: "#6b7280",
                    fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>Memuat data...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>Tidak ada data</td></tr>
              ) : paginated.map(u => (
                <tr key={u.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "11px 14px", color: "#6b7280", fontWeight: 500 }}>{u.id}</td>
                  <td style={{ padding: "11px 14px", color: "#111827", fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{u.email}</td>
                  <td style={{ padding: "11px 14px", color: "#14532d", fontWeight: 700 }}>{u.emisi} kg CO₂</td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button title="Detail" onClick={() => setModal({ type: "detail", user: u })}
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb"; }}
                      ><EyeIcon /></button>
                      <button title="Edit" onClick={() => setModal({ type: "edit", user: u })}
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#fefce8", color: "#ca8a04", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#ca8a04"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fefce8"; e.currentTarget.style.color = "#ca8a04"; }}
                      ><EditIcon /></button>
                      <button title="Hapus" onClick={() => setModal({ type: "delete", user: u })}
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
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
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>‹</button>
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
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e5e7eb", background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>›</button>
          </div>
        )}

        <div style={{ marginTop: "12px", fontSize: "12px", color: "#9ca3af" }}>
          Menampilkan {paginated.length} dari {filtered.length} pengguna
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "detail" && <DetailModal user={modal.user} onClose={() => setModal(null)} />}
      {modal?.type === "edit"   && <FormModal   user={modal.user} onClose={() => setModal(null)} onSave={fetchUsers} />}
      {modal?.type === "delete" && <DeleteModal user={modal.user} onClose={() => setModal(null)} onConfirm={handleDelete} />}
      {modal?.type === "filter" && <FilterModal filter={filter}   onClose={() => setModal(null)} onApply={f => { setFilter(f); setPage(1); }} />}
    </div>
  );
};

export default ManajemenUser;