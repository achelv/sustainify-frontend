import { useState } from "react";
import { DetailIcon, EditIcon, DeleteIcon, TransportIcon, HouseIcon } from "../../components/icons/icon";

const tEF    = { motor: 0.06, mobil: 0.21, bus: 0.09, ojek: 0.065, angkot: 0.07, sepeda: 0.00 };
const tLabel = { motor: "Motor", mobil: "Mobil pribadi", bus: "Bus kota", ojek: "Ojek online", angkot: "Angkot", sepeda: "Sepeda" };
const rEF    = { ac: 0.4, lampu: 0.01, tv: 0.05, kulkas: 0.1, ricecooker: 0.08, kipas: 0.03 };
const rLabel = { ac: "Penggunaan AC", lampu: "Lampu", tv: "TV", kulkas: "Kulkas", ricecooker: "Rice cooker", kipas: "Kipas angin" };

const dummyTransportasi = [
  { id: "ACT001", tanggal: "12 Juli 2025", waktu: "07.30", key: "motor",  nilai: 8,  emisi: 0.48 },
  { id: "ACT002", tanggal: "12 Juli 2025", waktu: "17.15", key: "motor",  nilai: 8,  emisi: 0.48 },
  { id: "ACT003", tanggal: "11 Juli 2025", waktu: "08.00", key: "mobil",  nilai: 25, emisi: 5.25 },
  { id: "ACT004", tanggal: "11 Juli 2025", waktu: "18.30", key: "mobil",  nilai: 25, emisi: 5.25 },
  { id: "ACT005", tanggal: "10 Juli 2025", waktu: "06.45", key: "bus",    nilai: 12, emisi: 1.08 },
  { id: "ACT006", tanggal: "10 Juli 2025", waktu: "14.00", key: "ojek",   nilai: 6,  emisi: 0.39 },
  { id: "ACT007", tanggal: "09 Juli 2025", waktu: "09.00", key: "angkot", nilai: 10, emisi: 0.70 },
  { id: "ACT008", tanggal: "09 Juli 2025", waktu: "16.20", key: "sepeda", nilai: 4,  emisi: 0.00 },
  { id: "ACT009", tanggal: "08 Juli 2025", waktu: "07.50", key: "motor",  nilai: 15, emisi: 0.90 },
  { id: "ACT010", tanggal: "08 Juli 2025", waktu: "13.00", key: "mobil",  nilai: 20, emisi: 4.20 },
];

const dummyRumah = [
  { id: "RT001", tanggal: "12 Juli 2025", waktu: "08.00", key: "ac",         nilai: 6,   emisi: 2.40 },
  { id: "RT002", tanggal: "12 Juli 2025", waktu: "19.30", key: "tv",         nilai: 4,   emisi: 0.20 },
  { id: "RT003", tanggal: "11 Juli 2025", waktu: "07.00", key: "lampu",      nilai: 8,   emisi: 0.08 },
  { id: "RT004", tanggal: "11 Juli 2025", waktu: "00.00", key: "kulkas",     nilai: 24,  emisi: 2.40 },
  { id: "RT005", tanggal: "10 Juli 2025", waktu: "06.30", key: "ricecooker", nilai: 1.5, emisi: 0.12 },
  { id: "RT006", tanggal: "10 Juli 2025", waktu: "13.00", key: "kipas",      nilai: 5,   emisi: 0.15 },
  { id: "RT007", tanggal: "09 Juli 2025", waktu: "09.00", key: "ac",         nilai: 8,   emisi: 3.20 },
  { id: "RT008", tanggal: "09 Juli 2025", waktu: "20.00", key: "tv",         nilai: 3,   emisi: 0.15 },
  { id: "RT009", tanggal: "08 Juli 2025", waktu: "07.00", key: "lampu",      nilai: 10,  emisi: 0.10 },
  { id: "RT010", tanggal: "08 Juli 2025", waktu: "00.00", key: "kulkas",     nilai: 24,  emisi: 2.40 },
];

const reindex = (arr, prefix) =>
  arr.map((item, i) => ({ ...item, id: prefix + String(i + 1).padStart(3, "0") }));

// ── Overlay & ModalHeader ────────────────────────────────────
const Overlay = ({ children, onClose }) => (
  <div
    onClick={onClose}
    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px", width: "340px", maxWidth: "95%" }}
    >
      {children}
    </div>
  </div>
);

const ModalHeader = ({ icon, title, sub, onClose }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#166534" }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{title}</p>
        <p style={{ fontSize: "11px", color: "#9ca3af" }}>{sub}</p>
      </div>
    </div>
    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#9ca3af", lineHeight: 1 }}>×</button>
  </div>
);

// ── Modal Detail ─────────────────────────────────────────────
const ModalDetail = ({ isTransportasi, row, onClose }) => {
  const labelMap  = isTransportasi ? tLabel : rLabel;
  const efMap     = isTransportasi ? tEF    : rEF;
  const unitKey   = isTransportasi ? "Jarak"   : "Jumlah";
  const unitLabel = isTransportasi ? "km"      : "jam";

  return (
    <Overlay onClose={onClose}>
      <ModalHeader
        icon={isTransportasi ? <TransportIcon size={18} /> : <HouseIcon size={18} />}
        title="Detail aktivitas"
        sub={row.id}
        onClose={onClose}
      />
      <div style={styles.dlBox}>
        {[
          ["Tanggal",                                          row.tanggal],
          ["Waktu",                                            row.waktu],
          [isTransportasi ? "Kendaraan" : "Aktivitas",        labelMap[row.key]],
          [unitKey,                                            `${row.nilai} ${unitLabel}`],
          ["Faktor emisi",                                     `${efMap[row.key]} kg/${unitLabel}`],
          ["Total emisi",                                      `${row.emisi.toFixed(2)} kg co₂`],
        ].map(([label, val], i, arr) => (
          <div key={i} style={{ ...styles.dlRow, borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <span style={{ color: "#9ca3af", fontSize: "13px" }}>{label}</span>
            <span style={{ fontWeight: 600, fontSize: i === arr.length - 1 ? "15px" : "13px", color: i === arr.length - 1 ? "#166534" : "#111827" }}>{val}</span>
          </div>
        ))}
      </div>
      <button style={styles.btnPrimary} onClick={onClose}>Tutup</button>
    </Overlay>
  );
};

// ── Modal Edit ───────────────────────────────────────────────
const ModalEdit = ({ isTransportasi, row, onSave, onClose }) => {
  const [key,   setKey]   = useState(row.key);
  const [nilai, setNilai] = useState(row.nilai);
  const labelMap  = isTransportasi ? tLabel : rLabel;
  const unitLabel = isTransportasi ? "km"   : "jam";

  const handleSave = () => {
    const ef = (isTransportasi ? tEF : rEF)[key];
    const n  = parseFloat(nilai);
    if (!key || isNaN(n) || n <= 0) return;
    onSave({ key, nilai: n, emisi: parseFloat((n * ef).toFixed(2)) });
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader
        icon={<EditIcon size={18} />}
        title="Edit aktivitas"
        sub={row.id}
        onClose={onClose}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
        <div>
          <label style={styles.label}>{isTransportasi ? "Kendaraan" : "Aktivitas"}</label>
          <select value={key} onChange={e => setKey(e.target.value)} style={styles.input}>
            {Object.entries(labelMap).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.label}>{isTransportasi ? "Jarak (km)" : "Jumlah (jam)"}</label>
          <input
            type="number" min="0" value={nilai}
            onChange={e => setNilai(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={styles.btnSecondary} onClick={onClose}>Batal</button>
        <button style={styles.btnPrimary}   onClick={handleSave}>Simpan</button>
      </div>
    </Overlay>
  );
};

// ── Modal Hapus ──────────────────────────────────────────────
const ModalHapus = ({ isTransportasi, row, onConfirm, onClose }) => {
  const labelMap = isTransportasi ? tLabel : rLabel;
  return (
    <Overlay onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#dc2626" }}>
          <DeleteIcon size={22} />
        </div>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>Hapus aktivitas?</p>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
          Aktivitas <strong>{labelMap[row.key]}</strong> akan dihapus dari daftar.
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={styles.btnSecondary} onClick={onClose}>Batal</button>
          <button style={{ ...styles.btnPrimary, background: "#dc2626" }} onClick={onConfirm}>Hapus</button>
        </div>
      </div>
    </Overlay>
  );
};

// ── Dropdown aksi per baris ──────────────────────────────────
const AksiMenu = ({ onDetail, onEdit, onHapus }) => {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: <DetailIcon size={14} />, label: "Detail", color: "#166534", action: onDetail },
    { icon: <EditIcon   size={14} />, label: "Edit",   color: "#166534", action: onEdit   },
    { icon: <DeleteIcon size={14} />, label: "Hapus",  color: "#dc2626", action: onHapus  },
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#f9fafb", border: "1px solid #e5e7eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#6b7280" }}
      >
        ⋮
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{ position: "absolute", right: 0, top: "32px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", zIndex: 100, minWidth: "130px", padding: "4px 0", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
            {items.map(({ icon, label, color, action }) => (
              <button
                key={label}
                onClick={() => { setOpen(false); action(); }}
                style={{ width: "100%", padding: "8px 14px", border: "none", background: "none", textAlign: "left", fontSize: "13px", color, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────
const HitungEmisi = ({ subPage = "transportasi" }) => {
  const isTransportasi = subPage !== "rumah-tangga";

  const [tData,  setTData]  = useState(dummyTransportasi);
  const [rData,  setRData]  = useState(dummyRumah);
  const [selKey, setSelKey] = useState("");
  const [input,  setInput]  = useState("");
  const [modal,  setModal]  = useState(null);

  const data      = isTransportasi ? tData   : rData;
  const setData   = isTransportasi ? setTData : setRData;
  const labelMap  = isTransportasi ? tLabel  : rLabel;
  const efMap     = isTransportasi ? tEF     : rEF;
  const prefix    = isTransportasi ? "ACT"   : "RT";
  const unitLabel = isTransportasi ? "km"    : "jam";
  const colUnit   = isTransportasi ? "Jarak" : "Jumlah";
  const limit     = 50;

  const total = data.reduce((s, a) => s + a.emisi, 0);
  const pct   = Math.min((total / limit) * 100, 100);

  const nowStr = () => {
    const now = new Date();
    return {
      tanggal: now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      waktu:   now.toTimeString().slice(0, 5).replace(":", "."),
    };
  };

  const handleTambah = () => {
    if (!selKey || !input || parseFloat(input) <= 0) {
      alert(`Pilih ${isTransportasi ? "kendaraan" : "aktivitas"} dan isi ${isTransportasi ? "jarak" : "jumlah jam"}!`);
      return;
    }
    const n  = parseFloat(input);
    const ef = efMap[selKey];
    const updated = reindex(
      [{ ...nowStr(), key: selKey, nilai: n, emisi: parseFloat((n * ef).toFixed(2)) }, ...data],
      prefix
    );
    setData(updated);
    setSelKey(""); setInput("");
  };

  const handleSaveEdit = (idx, patch) => {
    const updated = data.map((r, i) => i === idx ? { ...r, ...patch } : r);
    setData(reindex(updated, prefix));
    setModal(null);
  };

  const handleHapus = (idx) => {
    setData(reindex(data.filter((_, i) => i !== idx), prefix));
    setModal(null);
  };

  const modalRow = modal ? data[modal.idx] : null;

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>

      {/* Header: total emisi + form */}
      <div style={{ display: "flex", marginBottom: "16px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" }}>
        <div style={{ background: "#fff", padding: "24px 20px", minWidth: "190px", flexShrink: 0 }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Total emisi</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#166534", lineHeight: 1 }}>{total.toFixed(2)}</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>kg co₂</span>
          </div>
          <div style={{ height: "7px", background: "#dcfce7", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: `${pct.toFixed(1)}%`, height: "100%", background: "#166534", borderRadius: "99px", transition: "width 0.4s" }} />
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "5px" }}>{pct.toFixed(1)}% dari batas {limit} kg</p>
        </div>
        <div style={{ flex: 1, background: "#166534", padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", lineHeight: 1.6, marginBottom: "14px" }}>
            {isTransportasi
              ? "Hitung emisi karbon kendaraan anda untuk memantau dan menjaga lingkungan."
              : "Hitung emisi karbon aktivitas rumah tangga anda untuk menjaga lingkungan tetap sehat."}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <select
              value={selKey}
              onChange={e => setSelKey(e.target.value)}
              style={{ flex: "1 1 150px", padding: "9px 11px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", color: selKey ? "#fff" : "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "inherit" }}
            >
              <option value="" style={{ color: "#166534" }}>
                {isTransportasi ? "Pilih kendaraan" : "Pilih aktivitas"}
              </option>
              {Object.entries(labelMap).map(([v, l]) => (
                <option key={v} value={v} style={{ color: "#166534" }}>{l}</option>
              ))}
            </select>
            <input
              type="number" min="0"
              placeholder={isTransportasi ? "Jarak (km)" : "Jumlah (jam)"}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: "1 1 110px", padding: "9px 11px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", fontFamily: "inherit" }}
            />
            <button
              onClick={handleTambah}
              style={{ padding: "9px 18px", borderRadius: "8px", background: "#fff", border: "none", color: "#166534", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              + Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Aktivitas</span>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>{data.length} aktivitas</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0fdf4" }}>
                {["No", "ID", "Tanggal", "Waktu", isTransportasi ? "Kendaraan" : "Aktivitas", colUnit, "Emisi", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#166534", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Belum ada aktivitas</td></tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "11px 12px", fontSize: "13px", color: "#9ca3af" }}>{i + 1}.</td>
                    <td style={{ padding: "11px 12px", fontSize: "11px", color: "#9ca3af" }}>{row.id}</td>
                    <td style={{ padding: "11px 12px", fontSize: "13px", color: "#374151" }}>{row.tanggal}</td>
                    <td style={{ padding: "11px 12px", fontSize: "13px", color: "#9ca3af" }}>{row.waktu}</td>
                    <td style={{ padding: "11px 12px", fontSize: "13px", fontWeight: 600, color: "#111827" }}>{labelMap[row.key]}</td>
                    <td style={{ padding: "11px 12px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: "5px", background: "#f0fdf4", color: "#166534", fontSize: "12px", fontWeight: 600 }}>
                        {row.nilai} {unitLabel}
                      </span>
                    </td>
                    <td style={{ padding: "11px 12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#166534" }}>{row.emisi.toFixed(2)}</span>
                      <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "2px" }}>kg co₂</span>
                    </td>
                    <td style={{ padding: "11px 12px" }}>
                      <AksiMenu
                        onDetail={() => setModal({ mode: "detail", idx: i })}
                        onEdit={()   => setModal({ mode: "edit",   idx: i })}
                        onHapus={()  => setModal({ mode: "hapus",  idx: i })}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal && modalRow && modal.mode === "detail" && (
        <ModalDetail isTransportasi={isTransportasi} row={modalRow} onClose={() => setModal(null)} />
      )}
      {modal && modalRow && modal.mode === "edit" && (
        <ModalEdit
          isTransportasi={isTransportasi} row={modalRow}
          onSave={patch => handleSaveEdit(modal.idx, patch)}
          onClose={() => setModal(null)}
        />
      )}
      {modal && modalRow && modal.mode === "hapus" && (
        <ModalHapus
          isTransportasi={isTransportasi} row={modalRow}
          onConfirm={() => handleHapus(modal.idx)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default HitungEmisi;

// ── Shared styles ────────────────────────────────────────────
const styles = {
  input: {
    width: "100%", padding: "9px 11px", borderRadius: "8px",
    border: "1px solid #e5e7eb", background: "#fff",
    color: "#111827", fontSize: "13px", fontFamily: "inherit",
  },
  label: {
    fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "5px",
  },
  dlBox: {
    background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px",
  },
  dlRow: {
    display: "flex", justifyContent: "space-between", padding: "7px 0",
  },
  btnPrimary: {
    width: "100%", padding: "10px", borderRadius: "9px",
    background: "#166534", border: "none", color: "#fff",
    fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
  },
  btnSecondary: {
    flex: 1, padding: "10px", borderRadius: "9px",
    background: "#f9fafb", border: "1px solid #e5e7eb",
    color: "#6b7280", fontSize: "13px", fontFamily: "inherit", cursor: "pointer",
  },
};