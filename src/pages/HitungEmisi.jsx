import { useState } from "react";

const transportasiOptions = [
  { label: "Mobil Bensin", value: "mobil_bensin", emissionFactor: 0.02 },
  { label: "Motor", value: "motor", emissionFactor: 0.01 },
  { label: "Bus", value: "bus", emissionFactor: 0.005 },
  { label: "Kendaraan Listrik", value: "ev", emissionFactor: 0.003 },
  { label: "Mengendarai montor", value: "montor", emissionFactor: 0.02 },
];

const rumahTanggaOptions = [
  { label: "Penggunaan AC", value: "ac", emissionFactor: 0.4 },
  { label: "Lampu", value: "lampu", emissionFactor: 0.01 },
  { label: "TV", value: "tv", emissionFactor: 0.05 },
  { label: "Kulkas", value: "kulkas", emissionFactor: 0.1 },
];

const generateId = () => "K00T" + Math.floor(Math.random() * 90 + 10);

const initialData = Array.from({ length: 5 }, (_, i) => ({
  no: i + 1, id: "K00T21", tanggal: "21 April 2026",
  waktu: "07.30", aktivitas: "Mengendarai montor", jumlah: "3 km", emisi: 0.06,
}));

const HitungEmisi = ({ subPage = "transportasi" }) => {
  const isTransportasi = subPage !== "rumah-tangga";
  const options = isTransportasi ? transportasiOptions : rumahTanggaOptions;
  const unitLabel = isTransportasi ? "km" : "jam";
  const inputPlaceholder = isTransportasi ? "Jarak" : "Jumlah";
  const dropdownPlaceholder = isTransportasi ? "Pilih Transportasi" : "Pilih Aktivitas";

  const [selected, setSelected] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalEmisi, setTotalEmisi] = useState(0.06);
  const [aktivitas, setAktivitas] = useState(initialData);

  const selectedOption = options.find(o => o.value === selected);
  const progressPct = Math.min((totalEmisi / 5) * 100, 100);

  const handleHitung = () => {
    if (!selectedOption || !jumlah) return;
    setTotalEmisi(parseFloat((parseFloat(jumlah) * selectedOption.emissionFactor).toFixed(2)));
  };

  const handleTambah = () => {
    if (!selectedOption || !jumlah) return;
    const emisi = parseFloat((parseFloat(jumlah) * selectedOption.emissionFactor).toFixed(2));
    const now = new Date();
    const tanggal = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const waktu = now.toTimeString().slice(0, 5).replace(":", ".");
    setAktivitas(prev => [...prev, {
      no: prev.length + 1, id: generateId(), tanggal, waktu,
      aktivitas: selectedOption.label, jumlah: `${jumlah} ${unitLabel}`, emisi,
    }]);
    setJumlah(""); setSelected("");
  };

  const card = { background: "#fff", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6" };

  return (
    <div style={{ width: "100%", padding: "0 8px"  }}>

      {/* Top section - tanpa overflow hidden */}
      <div style={{ display: "flex", marginBottom: "24px", borderRadius: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", position: "relative" }}>

        {/* Total Emisi */}
        <div style={{ background: "#fff", borderRadius: "16px 0 0 16px", padding: "32px 28px", minWidth: "250px", flex: "0 0 auto" }}>
          <p style={{ fontSize: "20px", fontWeight: 800, color: "#166534", marginBottom: "20px" }}>Total Emisi</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", marginBottom: "16px" }}>
            <span style={{ fontSize: "44px", fontWeight: 900, color: "#166534", lineHeight: 1, letterSpacing: "-1px" }}>{totalEmisi.toFixed(2)}</span>
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, marginBottom: "5px" }}>kg co₂</span>
          </div>
          <div style={{ width: "100%", height: "10px", background: "#dcfce7", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: "#16a34a", borderRadius: "99px", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Green panel */}
        <div style={{ flex: 1, background: "#166534", borderRadius: "0 16px 16px 0", padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", top: "-20px", right: "120px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "20px", right: "60px", width: "50px", height: "50px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

          <p style={{ color: "#fff", fontSize: "15px", fontWeight: 400, lineHeight: 1.6, marginBottom: "24px", position: "relative", zIndex: 1 }}>
            Ayo hitung emisi karbon anda, untuk memantau dan menjaga lingkungan.
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", position: "relative", zIndex: 10 }}>

            {/* Dropdown */}
            <div style={{ position: "relative", flex: "1 1 200px", zIndex: 999 }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.1)", color: selectedOption ? "#fff" : "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 500, fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span>{selectedOption ? selectedOption.label : dropdownPlaceholder}</span>
                <span style={{ fontSize: "18px" }}>›</span>
              </button>

              {showDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: "12px", boxShadow: "0 12px 32px rgba(0,0,0,0.25)", zIndex: 9999, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  {options.map(opt => (
                    <button key={opt.value}
                      onClick={() => { setSelected(opt.value); setShowDropdown(false); }}
                      style={{ width: "100%", padding: "12px 16px", border: "none", background: selected === opt.value ? "#f0fdf4" : "#fff", color: "#166534", fontSize: "14px", fontWeight: 500, fontFamily: "inherit", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #f3f4f6", display: "block" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                      onMouseLeave={e => e.currentTarget.style.background = selected === opt.value ? "#f0fdf4" : "#fff"}
                    >{opt.label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ flex: "1 1 140px", position: "relative", zIndex: 1 }}>
              <input type="number" placeholder={inputPlaceholder} value={jumlah} onChange={e => setJumlah(e.target.value)}
                style={{ width: "100%", padding: "13px 50px 13px 16px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
              />
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: 700 }}>{unitLabel}</span>
            </div>

            {/* Hitung */}
            <button onClick={handleHitung}
              style={{ padding: "13px 28px", borderRadius: "12px", background: "#fff", border: "none", color: "#166534", fontSize: "15px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Hitung</button>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div style={{ ...card, padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>Aktivitas</h3>
          <button onClick={handleTambah}
            style={{ padding: "10px 24px", borderRadius: "10px", background: "#166534", border: "none", color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
            onMouseLeave={e => e.currentTarget.style.background = "#166534"}
          >Tambah</button>
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
              {aktivitas.map((row, i) => (
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
                    <button style={{ width: "32px", height: "32px", background: "#dcfce7", border: "none", borderRadius: "8px", color: "#166534", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>▼</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HitungEmisi;