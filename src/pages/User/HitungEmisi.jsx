import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../../api";
import { DetailIcon, EditIcon, DeleteIcon, TransportIcon, HouseIcon } from "../../components/icons/Icon";

const reindex = (arr, prefix) =>
  arr.map((item, i) => ({ ...item, id: prefix + String(i + 1).padStart(3, "0") }));

// ── ══════════════════════════════════════════════════════════
//    RUMUS EMISI KARBON — IPCC 2006 Tier 1
//
//    Referensi:
//      • IPCC Guidelines for National Greenhouse Gas Inventories (2006), Vol.2 Ch.1 & Ch.3
//      • Estimasi Emisi CO₂ Sektor Rumah Tangga, Photon: Jurnal Sain dan Kesehatan
//        UMRI (2020) — Metode IPCC 2006
//      • Analisis Potensi Emisi CO₂ Kendaraan Bermotor, JSAL UB, Sudarti et al. (2022)
//      • Pemetaan Emisi CO₂ Transportasi Kota Tegal, PKTJ Kemenhub (2018)
//      • Faktor emisi grid listrik Indonesia (DJLPE/Kementerian ESDM): 0,87 kg CO₂/kWh
//
//    RUMAH TANGGA:
//      Langkah 1 — Konsumsi Energi (kWh) = Daya (W) × Durasi (jam) ÷ 1000
//      Langkah 2 — Emisi CO₂ (kg)        = Konsumsi Energi (kWh) × 0,87 kg CO₂/kWh
//
//    TRANSPORTASI (Mobile Combustion IPCC 2006 Vol.2 Ch.3):
//      Langkah 1 — Konsumsi BBM (liter)  = Jarak (km) × Konsumsi per km (liter/km)
//      Langkah 2 — Emisi CO₂ (kg)        = Konsumsi BBM (liter) × Faktor Emisi BBM (kg CO₂/liter)
// ── ══════════════════════════════════════════════════════════

const FAKTOR_EMISI_LISTRIK = 0.87; // kg CO₂/kWh — DJLPE Kementerian ESDM (JAMALI)

/**
 * Faktor emisi bahan bakar (kg CO₂/liter)
 * Sumber: IPCC 2006 Vol.2 Ch.3 Table 3.2.1 — Default Emission Factors for Mobile Combustion
 */
const FAKTOR_EMISI_BBM = {
  bensin:   2.404,
  solar:    2.701,
  pertamax: 2.404,
};

/**
 * Konsumsi BBM rata-rata per jenis kendaraan (liter/km)
 */
const KONSUMSI_BBM_DEFAULT = {
  motor: 0.040,
  mobil: 0.083,
  bus:   0.200,
};

const DAYA_PERANGKAT = {
  ac:         900,
  lampu:       18,
  tv:         100,
  kulkas:      80,
  ricecooker: 400,
  kipas:       55,
};

// ── Fungsi hitung emisi ──────────────────────────────────────

const hitungEmisiRumahTangga = (jenisAktivitas, durasiJam) => {
  const daya      = DAYA_PERANGKAT[jenisAktivitas?.toLowerCase()] ?? 100;
  const energiKWh = (daya * durasiJam) / 1000;
  return parseFloat((energiKWh * FAKTOR_EMISI_LISTRIK).toFixed(4));
};

const hitungEmisiTransportasi = (jarakKm, konsumsiPerKm, jenisBBM = "bensin") => {
  const fe          = FAKTOR_EMISI_BBM[jenisBBM] ?? FAKTOR_EMISI_BBM.bensin;
  const konsumsiLtr = jarakKm * konsumsiPerKm;
  return parseFloat((konsumsiLtr * fe).toFixed(4));
};

// ── Popup Sukses ─────────────────────────────────────────────
const PopupSukses = ({ aktivitas, nilai, unitLabel, emisi, rumus, onClose }) => (
  <div style={{
    position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
    background: "#fff", borderRadius: "16px", border: "1px solid #dcfce7",
    padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "14px",
    zIndex: 99999, boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
    minWidth: "300px", maxWidth: "440px", animation: "slideDown 0.22s ease",
  }}>
    <style>{`@keyframes slideDown { from { opacity:0; transform: translateX(-50%) translateY(-18px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
      </svg>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Aktivitas berhasil ditambahkan!</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "#f0fdf4", borderRadius: "8px", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>{aktivitas}</span>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>{nilai} {unitLabel}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #f3f4f6", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "#9ca3af" }}>Total emisi</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "#166534" }}>{emisi}</span>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>kg CO₂</span>
        </div>
      </div>
      <div style={{ padding: "6px 10px", background: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a" }}>
        <span style={{ fontSize: "10px", color: "#92400e", fontFamily: "monospace" }}>📐 {rumus}</span>
      </div>
    </div>
    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#9ca3af", lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
  </div>
);

// ── Overlay & ModalHeader ────────────────────────────────────
const Overlay = ({ children, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px", width: "390px", maxWidth: "95%" }}>
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
  const namaAktivitas = isTransportasi ? row.aktivitas : row.namaAktivitas;

  const getRumusTransportasi = () => {
    const konsumsi = row.konsumsiPerKm ?? KONSUMSI_BBM_DEFAULT[row.jenisKendaraan ?? "motor"];
    const jenisBBM = row.jenisBBM ?? "bensin";
    const fe       = FAKTOR_EMISI_BBM[jenisBBM] ?? FAKTOR_EMISI_BBM.bensin;
    const liter    = (row.nilai * konsumsi).toFixed(4);
    const emisi    = (parseFloat(liter) * fe).toFixed(4);
    return {
      info: [
        ["Kendaraan",    namaAktivitas],
        ["Jarak",        `${row.nilai} km`],
        ["Jenis BBM",    jenisBBM],
        ["Konsumsi BBM", `${konsumsi} liter/km`],
        ["Total emisi",  `${emisi} kg CO₂`],
      ],
      langkah: [
        `Langkah 1 — Konsumsi BBM`,
        `  ${row.nilai} km × ${konsumsi} liter/km = ${liter} liter`,
        `Langkah 2 — Emisi CO₂`,
        `  ${liter} liter × ${fe} kg CO₂/liter = ${emisi} kg CO₂`,
        `  (Faktor emisi: IPCC 2006 Vol.2 Ch.3 Table 3.2.1)`,
      ],
    };
  };

  const getRumusRumahTangga = () => {
    const jenisKey = row.jenisKey?.toLowerCase() ?? "";
    const daya     = DAYA_PERANGKAT[jenisKey] ?? 100;
    const kwh      = ((daya * row.nilai) / 1000).toFixed(4);
    const emisi    = (parseFloat(kwh) * FAKTOR_EMISI_LISTRIK).toFixed(4);
    return {
      info: [
        ["Aktivitas",      namaAktivitas],
        ["Durasi",         `${row.nilai} jam`],
        ["Daya perangkat", `${daya} W`],
        ["Faktor emisi",   `${FAKTOR_EMISI_LISTRIK} kg CO₂/kWh`],
        ["Total emisi",    `${emisi} kg CO₂`],
      ],
      langkah: [
        `Langkah 1 — Konsumsi Energi`,
        `  ${daya} W × ${row.nilai} jam ÷ 1000 = ${kwh} kWh`,
        `Langkah 2 — Emisi CO₂`,
        `  ${kwh} kWh × ${FAKTOR_EMISI_LISTRIK} kg CO₂/kWh = ${emisi} kg CO₂`,
        `  (Faktor emisi: DJLPE Kementerian ESDM — Jaringan JAMALI)`,
      ],
    };
  };

  const { info, langkah } = isTransportasi ? getRumusTransportasi() : getRumusRumahTangga();

  return (
    <Overlay onClose={onClose}>
      <ModalHeader
        icon={isTransportasi ? <TransportIcon size={18} /> : <HouseIcon size={18} />}
        title="Detail aktivitas"
        sub={row.id}
        onClose={onClose}
      />
      <div style={styles.dlBox}>
        {[["Tanggal", row.tanggal], ["Waktu", row.waktu], ...info].map(([label, val], i, arr) => (
          <div key={i} style={{ ...styles.dlRow, borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <span style={{ color: "#9ca3af", fontSize: "13px" }}>{label}</span>
            <span style={{
              fontWeight: 600,
              fontSize: i === arr.length - 1 ? "15px" : "13px",
              color: i === arr.length - 1 ? "#166534" : "#111827",
            }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#92400e", marginBottom: "8px" }}>
          📐 Langkah Perhitungan (IPCC 2006 Tier 1)
        </p>
        {langkah.map((s, i) => (
          <p key={i} style={{
            fontSize: "11px",
            color: s.startsWith("Langkah") ? "#92400e" : "#78350f",
            fontFamily: "monospace",
            fontWeight: s.startsWith("Langkah") ? 700 : 400,
            margin: s.startsWith("Langkah") ? "6px 0 1px" : "1px 0",
          }}>{s}</p>
        ))}
      </div>
      <button style={styles.btnPrimary} onClick={onClose}>Tutup</button>
    </Overlay>
  );
};

// ── Modal Edit ───────────────────────────────────────────────
const ModalEdit = ({ isTransportasi, row, transportasiOptions, rumahTanggaOptions, onSave, onClose }) => {
  const [selKey, setSelKey] = useState(isTransportasi ? row.kendaraanId : row.aktivitasId);
  const [nilai,  setNilai]  = useState(row.nilai);
  const [error,  setError]  = useState("");

  const handleSave = () => {
    const n = parseFloat(nilai);
    if (!selKey || isNaN(n) || n <= 0) {
      setError("Isi semua field dengan benar.");
      return;
    }
    if (!isTransportasi && n > 24) {
      setError("Durasi maksimal 24 jam.");
      return;
    }
    setError("");
    if (isTransportasi) {
      const opt = transportasiOptions.find(o => String(o.value) === String(selKey));
      if (!opt) return;
      const konsumsi = opt.konsumsiPerKm ?? KONSUMSI_BBM_DEFAULT[opt.jenisKendaraan ?? "motor"];
      const jenisBBM = opt.jenisBBM ?? "bensin";
      const emisi    = hitungEmisiTransportasi(n, konsumsi, jenisBBM);
      onSave({ kendaraanId: opt.value, aktivitas: opt.label, konsumsiPerKm: konsumsi, jenisBBM, emissionFactor: FAKTOR_EMISI_BBM[jenisBBM], nilai: n, emisi });
    } else {
      const opt = rumahTanggaOptions.find(o => String(o.value) === String(selKey));
      if (!opt) return;
      const emisi = hitungEmisiRumahTangga(opt.jenisKey, n);
      onSave({ aktivitasId: opt.value, namaAktivitas: opt.label, jenisKey: opt.jenisKey, emissionFactor: FAKTOR_EMISI_LISTRIK, nilai: n, emisi });
    }
  };

  const options = isTransportasi ? transportasiOptions : rumahTanggaOptions;

  return (
    <Overlay onClose={onClose}>
      <ModalHeader icon={<EditIcon size={18} />} title="Edit aktivitas" sub={row.id} onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
        <div>
          <label style={styles.label}>{isTransportasi ? "Kendaraan" : "Aktivitas"}</label>
          <select value={selKey} onChange={e => setSelKey(e.target.value)} style={styles.input}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={styles.label}>{isTransportasi ? "Jarak (km)" : "Durasi (jam, maks. 24)"}</label>
          <input
            type="number" min="0" max={isTransportasi ? undefined : 24}
            value={nilai} onChange={e => setNilai(e.target.value)} style={styles.input}
          />
        </div>
        {error && <p style={{ fontSize: "12px", color: "#dc2626", margin: 0 }}>{error}</p>}
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
  const nama = isTransportasi ? row.aktivitas : row.namaAktivitas;
  return (
    <Overlay onClose={onClose}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#dc2626" }}>
          <DeleteIcon size={22} />
        </div>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>Hapus aktivitas?</p>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
          Aktivitas <strong>{nama}</strong> akan dihapus dari daftar.
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
  const [pos,  setPos]  = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);

  const items = [
    { icon: <DetailIcon size={14} />, label: "Detail", color: "#166534", action: onDetail },
    { icon: <EditIcon   size={14} />, label: "Edit",   color: "#166534", action: onEdit   },
    { icon: <DeleteIcon size={14} />, label: "Hapus",  color: "#dc2626", action: onHapus  },
  ];

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, right: window.innerWidth - rect.right });
    }
    setOpen(v => !v);
  };

  return (
    <div style={{ position: "relative" }}>
      <button ref={btnRef} onClick={handleOpen} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#f9fafb", border: "1px solid #e5e7eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#6b7280" }}>⋮</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div style={{ position: "fixed", top: pos.top, right: pos.right, background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", zIndex: 100, minWidth: "130px", padding: "4px 0", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
            {items.map(({ icon, label, color, action }) => (
              <button key={label} onClick={() => { setOpen(false); action(); }}
                style={{ width: "100%", padding: "8px 14px", border: "none", background: "none", textAlign: "left", fontSize: "13px", color, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >{icon}{label}</button>
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
  const unitLabel = isTransportasi ? "km"    : "jam";
  const colUnit   = isTransportasi ? "Jarak" : "Durasi";
  const limit     = 50;

  const [transportasiOptions, setTransportasiOptions] = useState([]);
  const [rumahTanggaOptions,  setRumahTanggaOptions]  = useState([]);
  const [tData,     setTData]     = useState([]);
  const [loadingT,  setLoadingT]  = useState(false);
  const [rData,     setRData]     = useState([]);
  const [loadingR,  setLoadingR]  = useState(false);
  const [selKey,    setSelKey]    = useState("");
  const [input,     setInput]     = useState("");
  const [inputError, setInputError] = useState("");
  const [modal,     setModal]     = useState(null);
  const [popup,     setPopup]     = useState(null);
  const popupTimer = useRef(null);

  const showPopup = useCallback((aktivitas, nilai, unitLbl, emisi, rumus) => {
    if (popupTimer.current) clearTimeout(popupTimer.current);
    setPopup({ aktivitas, nilai, unitLabel: unitLbl, emisi, rumus });
    popupTimer.current = setTimeout(() => setPopup(null), 5000);
  }, []);

  useEffect(() => () => { if (popupTimer.current) clearTimeout(popupTimer.current); }, []);

  const data  = isTransportasi ? tData : rData;
  const total = data.reduce((s, a) => s + a.emisi, 0);
  const pct   = Math.min((total / limit) * 100, 100);

  // ── Fetch transportasi ──
  const fetchAktivitasAPI = async (kOptions) => {
    const res = await api.get("/aktivitas");
    const raw = res.data.data ?? res.data ?? [];
    return raw.map((item, index) => {
      const date          = new Date(item.tanggal);
      const opt           = kOptions.find(o => String(o.value) === String(item.kendaraan_id)) || {};
      const jarak         = parseFloat(item.jarak_km);
      const konsumsiPerKm = (opt.konsumsiPerKm ?? parseFloat(item.kendaraan?.konsumsi_bbm ?? 0))
                            || KONSUMSI_BBM_DEFAULT[opt.jenisKendaraan ?? "motor"];
      const jenisBBM      = opt.jenisBBM ?? item.kendaraan?.jenis_bbm ?? "bensin";
      return {
        id:             `ACT${String(index + 1).padStart(3, "0")}`,
        apiId:          item.id,
        tanggal:        date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        waktu:          date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).replace(":", "."),
        aktivitas:      item.kendaraan?.nama_kendaraan || opt.label || "-",
        kendaraanId:    item.kendaraan_id,
        jenisKendaraan: opt.jenisKendaraan ?? "motor",
        konsumsiPerKm,
        jenisBBM,
        emissionFactor: FAKTOR_EMISI_BBM[jenisBBM] ?? FAKTOR_EMISI_BBM.bensin,
        nilai:          jarak,
        emisi:          hitungEmisiTransportasi(jarak, konsumsiPerKm, jenisBBM),
      };
    });
  };

  // ── Fetch rumah tangga ──
  const fetchRumahTanggaAPI = async (opts) => {
    const res = await api.get("/rumah-tangga");
    const raw = res.data.data ?? res.data ?? [];
    return raw.map((item, index) => {
      const date     = new Date(item.tanggal);
      const opt      = opts.find(o => String(o.value) === String(item.aktivitas_id)) || {};
      const durasi   = parseFloat(item.durasi_jam);
      const jenisKey = opt.jenisKey ?? item.jenis_aktivitas ?? "";
      return {
        id:             `RT${String(index + 1).padStart(3, "0")}`,
        apiId:          item.id,
        tanggal:        date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        waktu:          date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).replace(":", "."),
        aktivitasId:    item.aktivitas_id,
        namaAktivitas:  opt.label || item.rumah_tangga?.nama_aktivitas || "-",
        jenisKey,
        emissionFactor: FAKTOR_EMISI_LISTRIK,
        nilai:          durasi,
        emisi:          hitungEmisiRumahTangga(jenisKey, durasi),
      };
    });
  };

  useEffect(() => {
    if (isTransportasi) {
      const init = async () => {
        setLoadingT(true);
        try {
          const resK = await api.get("/kendaraan");
          const rawK = Array.isArray(resK.data) ? resK.data : resK.data.data ?? [];
          const kOpt = rawK.map(k => {
            const rawJ = (k.jenis_kendaraan ?? k.nama_kendaraan ?? "").toLowerCase();
            const jenis = rawJ.includes("bus") ? "bus"
                        : rawJ.includes("mobil") || rawJ.includes("car") ? "mobil"
                        : "motor";
            const jenisBBM = jenis === "bus" ? "solar" : "bensin";
            return {
              label:          k.nama_kendaraan,
              value:          k.id,
              jenisKendaraan: jenis,
              jenisBBM,
              konsumsiPerKm:  parseFloat(k.konsumsi_bbm ?? 0) || KONSUMSI_BBM_DEFAULT[jenis],
              emissionFactor: FAKTOR_EMISI_BBM[jenisBBM],
            };
          });
          setTransportasiOptions(kOpt);
          setTData(await fetchAktivitasAPI(kOpt));
        } catch (err) { console.error("Gagal fetch data transportasi:", err); }
        finally { setLoadingT(false); }
      };
      init();
    } else {
      const initR = async () => {
        setLoadingR(true);
        try {
          const resRT = await api.get("/rumah-tangga-list");
          const rawRT = resRT.data.data ?? resRT.data ?? [];
          const rtOpt = rawRT.map(r => ({
            value:    r.id,
            label:    r.nama_aktivitas,
            jenisKey: r.jenis_aktivitas ?? r.nama_aktivitas?.toLowerCase().replace(/\s+/g, "") ?? "",
            emissionFactor: FAKTOR_EMISI_LISTRIK,
          }));
          setRumahTanggaOptions(rtOpt);
          setRData(await fetchRumahTanggaAPI(rtOpt));
        } catch (err) { console.error("Gagal fetch data rumah tangga:", err); }
        finally { setLoadingR(false); }
      };
      initR();
    }
  }, [isTransportasi]);

  // ── Build temp row (optimistic UI) ──
  const buildTempRow = (namaAktivitas, keyOrId, opt, n, jenisKey = "") => {
    const now = new Date();
    const base = {
      id: "TEMP001", apiId: null,
      tanggal: now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      waktu:   now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).replace(":", "."),
      nilai: n,
    };
    if (isTransportasi) {
      const konsumsi = opt.konsumsiPerKm ?? KONSUMSI_BBM_DEFAULT[opt.jenisKendaraan ?? "motor"];
      const jenisBBM = opt.jenisBBM ?? "bensin";
      return {
        ...base,
        aktivitas:      namaAktivitas,
        kendaraanId:    keyOrId,
        jenisKendaraan: opt.jenisKendaraan ?? "motor",
        konsumsiPerKm:  konsumsi,
        jenisBBM,
        emissionFactor: FAKTOR_EMISI_BBM[jenisBBM],
        emisi:          hitungEmisiTransportasi(n, konsumsi, jenisBBM),
      };
    } else {
      return {
        ...base,
        namaAktivitas,
        aktivitasId:    keyOrId,
        jenisKey,
        emissionFactor: FAKTOR_EMISI_LISTRIK,
        emisi:          hitungEmisiRumahTangga(jenisKey, n),
      };
    }
  };

  // ── Rumus ringkas untuk popup ──
  const buatKeteranganRumus = (isTransp, opt, n) => {
    if (isTransp) {
      const konsumsi = opt.konsumsiPerKm ?? KONSUMSI_BBM_DEFAULT[opt.jenisKendaraan ?? "motor"];
      const jenisBBM = opt.jenisBBM ?? "bensin";
      const fe       = FAKTOR_EMISI_BBM[jenisBBM];
      const liter    = (n * konsumsi).toFixed(4);
      const emisi    = hitungEmisiTransportasi(n, konsumsi, jenisBBM);
      return `${n}km × ${konsumsi}L/km = ${liter}L  ×  ${fe} kg CO₂/L = ${emisi} kg CO₂`;
    }
    const daya  = DAYA_PERANGKAT[opt.jenisKey?.toLowerCase()] ?? 100;
    const kwh   = ((daya * n) / 1000).toFixed(4);
    const emisi = hitungEmisiRumahTangga(opt.jenisKey, n);
    return `(${daya}W × ${n}h ÷ 1000) = ${kwh}kWh  ×  ${FAKTOR_EMISI_LISTRIK} = ${emisi} kg CO₂`;
  };

  // ── Validasi input form ──
  const validateInput = (n) => {
    if (!selKey) return `Pilih ${isTransportasi ? "kendaraan" : "aktivitas"} terlebih dahulu!`;
    if (!input || isNaN(n) || n <= 0) return `Isi ${isTransportasi ? "jarak (km)" : "durasi (jam)"} dengan benar!`;
    if (!isTransportasi && n > 24) return "Durasi maksimal 24 jam!";
    return "";
  };

  const handleTambah = async () => {
    const n   = parseFloat(input);
    const err = validateInput(n);
    if (err) { setInputError(err); return; }
    setInputError("");

    if (isTransportasi) {
      const opt = transportasiOptions.find(o => String(o.value) === String(selKey));
      if (!opt) return;
      const tempRow = buildTempRow(opt.label, opt.value, opt, n);
      setTData(prev => reindex([tempRow, ...prev], "ACT"));
      setSelKey(""); setInput("");
      try {
        await api.post("/aktivitas", {
          kendaraan_id:  parseInt(opt.value),
          jarak_km:      n,
          emisi_karbon:  tempRow.emisi,
        });
        setTData(await fetchAktivitasAPI(transportasiOptions));
        showPopup(opt.label, n, "km", tempRow.emisi.toFixed(4), buatKeteranganRumus(true, opt, n));
      } catch (err) {
        console.error("Gagal tambah aktivitas:", err);
        console.error("Response:", err.response?.data);
        setTData(prev => reindex(prev.filter(r => r.apiId !== null), "ACT"));
      }
    } else {
      const opt = rumahTanggaOptions.find(o => String(o.value) === String(selKey));
      if (!opt) return;
      const tempRow = buildTempRow(opt.label, opt.value, opt, n, opt.jenisKey);
      setRData(prev => reindex([tempRow, ...prev], "RT"));
      setSelKey(""); setInput("");
      try {
        // FIX: hanya kirim field yang divalidasi backend
        // emisi_karbon dihitung di backend dari faktor_emisi tabel rumah_tangga
        // user_id & tanggal diisi otomatis di controller
        await api.post("/rumah-tangga", {
          aktivitas_id: parseInt(opt.value), // FIX: pastikan integer, bukan string
          durasi_jam:   n,                   // FIX: max 24, sudah divalidasi di atas
        });
        setRData(await fetchRumahTanggaAPI(rumahTanggaOptions));
        showPopup(opt.label, n, "jam", tempRow.emisi.toFixed(4), buatKeteranganRumus(false, opt, n));
      } catch (err) {
        console.error("Gagal tambah aktivitas rumah tangga:", err);
        console.error("Response:", err.response?.data); // lihat pesan validasi Laravel
        setRData(prev => reindex(prev.filter(r => r.apiId !== null), "RT"));
      }
    }
  };

  const handleSaveEdit = async (idx, patch) => {
    if (isTransportasi) {
      const row = tData[idx];
      try {
        await api.put(`/aktivitas/${row.apiId}`, {
          kendaraan_id: parseInt(patch.kendaraanId),
          jarak_km:     patch.nilai,
          emisi_karbon: patch.emisi,
        });
        setTData(await fetchAktivitasAPI(transportasiOptions));
      } catch {
        setTData(reindex(tData.map((r, i) => i === idx ? { ...r, ...patch } : r), "ACT"));
      }
    } else {
      const row = rData[idx];
      try {
        // FIX: sama seperti store — kirim aktivitas_id sebagai integer
        await api.put(`/rumah-tangga/${row.apiId}`, {
          aktivitas_id: parseInt(patch.aktivitasId),
          durasi_jam:   patch.nilai,
        });
        setRData(await fetchRumahTanggaAPI(rumahTanggaOptions));
      } catch {
        setRData(reindex(rData.map((r, i) => i === idx ? { ...r, ...patch } : r), "RT"));
      }
    }
    setModal(null);
  };

  const handleHapus = async (idx) => {
    if (isTransportasi) {
      const row = tData[idx];
      try {
        await api.delete(`/aktivitas/${row.apiId}`);
        setTData(await fetchAktivitasAPI(transportasiOptions));
      } catch {
        setTData(reindex(tData.filter((_, i) => i !== idx), "ACT"));
      }
    } else {
      const row = rData[idx];
      try {
        await api.delete(`/rumah-tangga/${row.apiId}`);
        setRData(await fetchRumahTanggaAPI(rumahTanggaOptions));
      } catch {
        setRData(reindex(rData.filter((_, i) => i !== idx), "RT"));
      }
    }
    setModal(null);
  };

  const modalRow    = modal ? data[modal.idx] : null;
  const isLoading   = isTransportasi ? loadingT : loadingR;
  const formOptions = isTransportasi ? transportasiOptions : rumahTanggaOptions;

  return (
    <div style={{ width: "100%", padding: "0 8px" }}>
      {popup && (
        <PopupSukses
          aktivitas={popup.aktivitas} nilai={popup.nilai} unitLabel={popup.unitLabel}
          emisi={popup.emisi} rumus={popup.rumus}
          onClose={() => { setPopup(null); if (popupTimer.current) clearTimeout(popupTimer.current); }}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", marginBottom: "16px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" }}>
        <div style={{ background: "#fff", padding: "24px 20px", minWidth: "190px", flexShrink: 0 }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Total emisi</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#166534", lineHeight: 1 }}>{total.toFixed(4)}</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>kg CO₂</span>
          </div>
          <div style={{ height: "7px", background: "#dcfce7", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: `${pct.toFixed(1)}%`, height: "100%", background: "#166534", borderRadius: "99px", transition: "width 0.4s" }} />
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "5px" }}>{pct.toFixed(1)}% dari batas {limit} kg</p>
          <div style={{ marginTop: "10px", padding: "4px 8px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px" }}>
            <p style={{ fontSize: "10px", color: "#92400e", margin: 0, fontWeight: 600 }}>📐 Metode: IPCC 2006 Tier 1</p>
          </div>
        </div>
        <div style={{ flex: 1, background: "#166534", padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", lineHeight: 1.6, marginBottom: "8px" }}>
              {isTransportasi
                ? "Hitung emisi karbon kendaraan anda untuk memantau dan menjaga lingkungan."
                : "Hitung emisi karbon aktivitas rumah tangga anda untuk menjaga lingkungan tetap sehat."}
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontFamily: "monospace", marginBottom: "14px" }}>
              {isTransportasi
                ? "Emisi = Jarak (km) × Konsumsi BBM (L/km) × Faktor Emisi BBM (kg CO₂/L)"
                : `Emisi = (Daya (W) × Durasi (jam) ÷ 1000) × ${FAKTOR_EMISI_LISTRIK} kg CO₂/kWh`}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <select value={selKey} onChange={e => { setSelKey(e.target.value); setInputError(""); }}
                style={{ flex: "1 1 150px", padding: "9px 11px", borderRadius: "8px", border: inputError && !selKey ? "1.5px solid #fca5a5" : "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", color: selKey ? "#fff" : "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "inherit" }}>
                <option value="" style={{ color: "#166534" }}>{isTransportasi ? "Pilih kendaraan" : "Pilih aktivitas"}</option>
                {formOptions.map(o => <option key={o.value} value={o.value} style={{ color: "#166534" }}>{o.label}</option>)}
              </select>
              <input
                type="number" min="0" max={isTransportasi ? undefined : 24}
                placeholder={isTransportasi ? "Jarak (km)" : "Durasi (jam, maks. 24)"}
                value={input}
                onChange={e => { setInput(e.target.value); setInputError(""); }}
                style={{ flex: "1 1 110px", padding: "9px 11px", borderRadius: "8px", border: inputError && input && parseFloat(input) > 0 ? "1.5px solid #fca5a5" : "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", fontFamily: "inherit" }}
              />
              <button onClick={handleTambah}
                style={{ padding: "9px 18px", borderRadius: "8px", background: "#fff", border: "none", color: "#166534", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap" }}>
                + Tambah
              </button>
            </div>
            {/* Pesan error validasi */}
            {inputError && (
              <p style={{ fontSize: "11px", color: "#fca5a5", margin: 0, paddingLeft: "2px" }}>
                ⚠ {inputError}
              </p>
            )}
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
                {["No", "ID", "Tanggal", "Waktu", isTransportasi ? "Kendaraan" : "Aktivitas", colUnit, "Emisi (kg CO₂)", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#166534", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>Belum ada aktivitas</td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id}
                  style={{ borderBottom: "1px solid #f3f4f6", background: row.apiId === null ? "#f0fdf4" : "transparent", transition: "background 0.3s" }}
                  onMouseEnter={e => { if (row.apiId !== null) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (row.apiId !== null) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "11px 12px", fontSize: "13px", color: "#9ca3af" }}>{i + 1}.</td>
                  <td style={{ padding: "11px 12px", fontSize: "11px", color: "#9ca3af" }}>{row.id}</td>
                  <td style={{ padding: "11px 12px", fontSize: "13px", color: "#374151" }}>{row.tanggal}</td>
                  <td style={{ padding: "11px 12px", fontSize: "13px", color: "#9ca3af" }}>{row.waktu}</td>
                  <td style={{ padding: "11px 12px", fontSize: "13px", fontWeight: 600, color: "#111827" }}>
                    {isTransportasi ? row.aktivitas : row.namaAktivitas}
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "5px", background: "#f0fdf4", color: "#166534", fontSize: "12px", fontWeight: 600 }}>
                      {row.nilai} {unitLabel}
                    </span>
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#166534" }}>{row.emisi.toFixed(4)}</span>
                      <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "2px" }}>kg CO₂</span>
                    </div>
                    <div style={{ fontSize: "9px", color: "#d1d5db", marginTop: "1px" }}>
                      {isTransportasi
                        ? `${row.nilai}km × ${row.konsumsiPerKm}L/km × ${row.emissionFactor}`
                        : `(${DAYA_PERANGKAT[row.jenisKey?.toLowerCase()] ?? 100}W × ${row.nilai}h ÷ 1000) × ${FAKTOR_EMISI_LISTRIK}`}
                    </div>
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <AksiMenu
                      onDetail={() => setModal({ mode: "detail", idx: i })}
                      onEdit={()   => setModal({ mode: "edit",   idx: i })}
                      onHapus={()  => setModal({ mode: "hapus",  idx: i })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && modalRow && modal.mode === "detail" && (
        <ModalDetail isTransportasi={isTransportasi} row={modalRow} onClose={() => setModal(null)} />
      )}
      {modal && modalRow && modal.mode === "edit" && (
        <ModalEdit
          isTransportasi={isTransportasi} row={modalRow}
          transportasiOptions={transportasiOptions} rumahTanggaOptions={rumahTanggaOptions}
          onSave={patch => handleSaveEdit(modal.idx, patch)} onClose={() => setModal(null)}
        />
      )}
      {modal && modalRow && modal.mode === "hapus" && (
        <ModalHapus isTransportasi={isTransportasi} row={modalRow}
          onConfirm={() => handleHapus(modal.idx)} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default HitungEmisi;

const styles = {
  input:        { width: "100%", padding: "9px 11px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#111827", fontSize: "13px", fontFamily: "inherit" },
  label:        { fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "5px" },
  dlBox:        { background: "#f9fafb", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px" },
  dlRow:        { display: "flex", justifyContent: "space-between", padding: "7px 0" },
  btnPrimary:   { width: "100%", padding: "10px", borderRadius: "9px", background: "#166534", border: "none", color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" },
  btnSecondary: { flex: 1, padding: "10px", borderRadius: "9px", background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", fontSize: "13px", fontFamily: "inherit", cursor: "pointer" },
};