import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";

/* ── Google Fonts: Poppins ── */
if (!document.querySelector('link[href*="Poppins"]')) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

/* ── DATA ── */
const lineData = [
  { name: "Jan", val: 30 }, { name: "Feb", val: 22 }, { name: "Mar", val: 34 },
  { name: "Apr", val: 26 }, { name: "Mei", val: 30 }, { name: "Jun", val: 20 },
  { name: "Jul", val: 36 }, { name: "Agt", val: 44 }, { name: "Sep", val: 38 },
  { name: "Okt", val: 50 }, { name: "Nov", val: 42 }, { name: "Des", val: 55 },
];


const transportOptions = [
  { value: "motor",   label: "Motor",         factor: 0.072 },
  { value: "mobil",   label: "Mobil Pribadi", factor: 0.210 },
  { value: "bus",     label: "Bus",           factor: 0.089 },
  { value: "kereta",  label: "Kereta",        factor: 0.041 },
  { value: "pesawat", label: "Pesawat",       factor: 0.255 },
  { value: "sepeda",  label: "Sepeda",        factor: 0.000 },
];

const rumahOptions = [
  { value: "ac",         label: "AC",          factor: 0.9  },
  { value: "lampu",      label: "Lampu",       factor: 0.04 },
  { value: "tv",         label: "TV",          factor: 0.1  },
  { value: "kulkas",     label: "Kulkas",      factor: 0.25 },
  { value: "ricecooker", label: "Rice Cooker", factor: 0.3  },
  { value: "kipas",      label: "Kipas Angin", factor: 0.05 },
];

const features = [
  {
    icon: "calculator",
    title: "Hitung Emisi Karbon",
    desc: "Hitung emisi karbon dari aktivitas harian secara mudah dan cepat.",
    dark: true,
  },
  {
    icon: "monitor",
    title: "Data Statistik",
    desc: "Lihat data statistik dari rekapan mingguan hingga bulanan secara lebih detail.",
    dark: false,
  },
  {
    icon: "trending-up",
    title: "Forecasting",
    desc: "Prediksi emisi karbon berdasarkan aktivitas dan penggunaan energi.",
    dark: false,
  },
  {
    icon: "bell",
    title: "Batas Pemakaian",
    desc: "Ketahui aktivitas yang melebihi batas penggunaan normal.",
    dark: true,
  },
  {
    icon: "leaf",
    title: "Saran",
    desc: "Dapatkan saran untuk mengurangi emisi karbon.",
    dark: false,
  },
];

/* ── ICONS (from Icon.jsx) ── */
const iconSz = (size) => ({ width: size, height: size });

const LeafIcon = ({ size = 20, color = "currentColor" }) => (
  <svg style={{ ...iconSz(size), color }} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const CarIconSvg = ({ size = 20 }) => (
  <svg style={{ width: size, height: size }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5Z" />
    <path d="M3 9h12l-2-4H5L3 9Z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="15" cy="17" r="2" />
    <path d="M19 9h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
  </svg>
);

const HouseIconSvg = ({ size = 20 }) => (
  <svg style={{ width: size, height: size }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5" />
    <path d="M9 21V12h6v9" />
    <path d="M3 9.5V21h18V9.5" />
  </svg>
);

const CalculatorIconSvg = ({ size = 22 }) => (
  <svg style={iconSz(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 10h8M8 14h4" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
    <circle cx="16" cy="18" r="1" fill="currentColor" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
    <circle cx="8" cy="18" r="1" fill="currentColor" />
  </svg>
);

const MonitorIconSvg = ({ size = 22 }) => (
  <svg style={iconSz(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const BellIconSvg = ({ size = 22 }) => (
  <svg style={iconSz(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// Map feature icon keys to components
const FeatureIcon = ({ type, size = 22 }) => {
  if (type === "calculator") return <CalculatorIconSvg size={size} />;
  if (type === "monitor")    return <MonitorIconSvg size={size} />;
  if (type === "bell")       return <BellIconSvg size={size} />;
  if (type === "leaf")       return <LeafIcon size={size} />;
  // trending-up fallback
  return (
    <svg style={iconSz(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
};

/* ── LOGO ── */
const Logo = ({ light = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{
      width: 38, height: 38, borderRadius: "50%",
      background: light ? "rgba(255,255,255,0.18)" : "#1a5c30",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <LeafIcon size={20} color="#fff" />
    </div>
    <div>
      <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "1.05rem", color: light ? "#fff" : "#1a5c30", lineHeight: 1.15 }}>Sustainify</div>
      <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.6rem", color: light ? "#b7f5c8" : "#2e8b57", fontWeight: 500, lineHeight: 1 }}>Langkah kecil, dampak besar</div>
    </div>
  </div>
);

/* ── NAVBAR ── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id, e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid #d1fae5" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 12px rgba(26,92,48,0.07)" : "none",
        transition: "all .3s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          {/* Desktop */}
          <div className="lp-nav-desk" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {[
              { label: "Beranda",  href: "#hero" },
              { label: "Fitur",    href: "#fitur" },
              { label: "Login",    href: "/login" },
              { label: "Daftar",   href: "/register" },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                onClick={href.startsWith("#") ? (e) => scrollTo(href.slice(1), e) : undefined}
                style={{
                  fontFamily: "Poppins,sans-serif", fontSize: "0.9rem", fontWeight: 600,
                  color: "#1a5c30", textDecoration: "none",
                  position: "relative", paddingBottom: "3px",
                }}
                className="lp-nav-link"
              >
                {label}
              </a>
            ))}
          </div>
          {/* Hamburger */}
          <button className="lp-nav-ham" onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 2.5, background: "#1a5c30", borderRadius: 2, transition: "all .3s",
                transform: open && i === 0 ? "rotate(45deg) translate(5px,5px)" : open && i === 1 ? "scaleX(0)" : open && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
              }} />
            ))}
          </button>
        </div>
        {open && (
          <div className="lp-nav-mob" style={{ background: "#fff", borderTop: "1px solid #d1fae5", padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Beranda", href: "#hero" },
              { label: "Fitur",   href: "#fitur" },
              { label: "Login",   href: "/login" },
              { label: "Daftar",  href: "/register" },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                onClick={href.startsWith("#") ? (e) => scrollTo(href.slice(1), e) : undefined}
                style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#1a5c30", textDecoration: "none" }}
              >{label}</a>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media(min-width:640px){.lp-nav-ham{display:none!important}.lp-nav-mob{display:none!important}}
        @media(max-width:639px){.lp-nav-desk{display:none!important}}

        .lp-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #1a5c30;
          border-radius: 2px;
          transition: width .25s ease;
        }
        .lp-nav-link:hover::after { width: 100%; }
      `}</style>
    </>
  );
};

/* ── HERO ── */
const Hero = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 60); return () => clearTimeout(t); }, []);
  return (
    <section id="hero" style={{
      background: "linear-gradient(135deg,#f0fdf4 0%,#e8f5e9 100%)",
      paddingTop: "7rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem",
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -100, right: -80, width: 340, height: 340, borderRadius: "50%", background: "rgba(26,92,48,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -70, width: 220, height: 220, borderRadius: "50%", background: "rgba(26,92,48,0.04)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="lp-hero-grid">
        {/* Left */}
        <div style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(28px)", transition: "all .7s cubic-bezier(.4,0,.2,1)" }}>
          <h1 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(2.1rem,5vw,3rem)", fontWeight: 800, color: "#1a5c30", lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.5px" }}>
            Hitung Emisimu,<br />
            <span style={{ color: "#2e8b57" }}>Mulai Perubahanmu</span>
          </h1>
          <p style={{ fontFamily: "Poppins,sans-serif", color: "#4a7c59", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2rem", maxWidth: 420 }}>
            Lihat bagaimana aktivitas sehari-hari memengaruhi lingkungan dan mulai perubahan kecil bersama Sustainify.
          </p>
          <a href="/register" style={{
            display: "inline-flex", alignItems: "center", gap: "0.55rem",
            background: "#1a5c30", color: "#fff", padding: "0.85rem 1.65rem",
            borderRadius: 50, fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.9rem",
            textDecoration: "none", boxShadow: "0 4px 18px rgba(26,92,48,0.32)", transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,92,48,0.42)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(26,92,48,0.32)"; }}
          >
            <LeafIcon size={18} color="#fff" />
            Mulai Sekarang
          </a>
        </div>

        {/* Right — Chart */}
        <div className="lp-hero-chart" style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(32px) scale(0.97)", transition: "all .8s .15s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", boxShadow: "0 8px 40px rgba(26,92,48,0.13)", border: "1px solid #e8f5e9" }}>
            <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Jumlah Emisi CO₂</div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={lineData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Poppins,sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Poppins,sans-serif" }} axisLine={false} tickLine={false} domain={[0, 60]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px #0001", fontSize: 12, fontFamily: "Poppins,sans-serif" }} />
                <Line type="monotone" dataKey="val" stroke="#1a5c30" strokeWidth={2.5} dot={{ fill: "#fff", stroke: "#1a5c30", strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: "#1a5c30" }} />
              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.lp-hero-grid{grid-template-columns:1fr!important}.lp-hero-chart{display:none!important}}
      `}</style>
    </section>
  );
};

/* ── FEATURES ── */
const Features = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="fitur" ref={ref} style={{ background: "#1a5c30", padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.72rem", color: "#86efac", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.6rem" }}>FITUR ANDALAN</div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>
            Semua yang kamu butuhkan dalam satu platform.
          </h2>
          <p style={{ fontFamily: "Poppins,sans-serif", color: "#86efac", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
            Solusi pintar untuk membantu memahami, memantau, dan mengurangi jejak karbon dalam aktivitas sehari-hari.
          </p>
        </div>

        {/* Row 1 — 3 cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1rem" }} className="lp-feat-r1">
          {features.slice(0, 3).map((f, i) => <FeatureCard key={i} f={f} i={i} vis={vis} />)}
        </div>
        {/* Row 2 — 2 cards centered / justified */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }} className="lp-feat-r2">
          {features.slice(3).map((f, i) => (
            <div key={i + 3} style={{ flex: "0 1 calc(33.333% - 0.67rem)", minWidth: 220 }}>
              <FeatureCard f={f} i={i + 3} vis={vis} fullHeight />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.lp-feat-r1{grid-template-columns:repeat(2,1fr)!important}.lp-feat-r2{flex-wrap:wrap!important}}
        @media(max-width:900px) .lp-feat-r2 > div{flex:0 1 calc(50% - 0.5rem)!important}
        @media(max-width:540px){.lp-feat-r1{grid-template-columns:1fr!important}.lp-feat-r2{flex-direction:column!important}.lp-feat-r2 > div{flex:unset!important;min-width:unset!important}}
      `}</style>
    </section>
  );
};

const FeatureCard = ({ f, i, vis, fullHeight }) => (
  <div style={{
    background: f.dark ? "#2e8b57" : "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16, padding: "1.5rem",
    height: fullHeight ? "100%" : "auto",
    opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
    transition: `all .5s ${i * 0.08}s ease`, cursor: "default",
    boxSizing: "border-box",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.22)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1fae5", marginBottom: "0.9rem" }}>
      <FeatureIcon type={f.icon} size={22} />
    </div>
    <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", marginBottom: "0.45rem" }}>{f.title}</div>
    <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.82rem", color: "#b7f5c8", lineHeight: 1.65 }}>{f.desc}</div>
  </div>
);

/* ── CALCULATOR ── */
const Calculator = () => {
  const [tab, setTab] = useState("transportasi");
  const [transport, setTransport] = useState("");
  const [jarak, setJarak] = useState("");
  const [aktivitas, setAktivitas] = useState("");
  const [durasi, setDurasi] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(false);  // true setelah sekali hitung

  const switchTab = (t) => { setTab(t); setResult(null); setTransport(""); setJarak(""); setAktivitas(""); setDurasi(""); };

  const hitung = () => {
    setLoading(true);
    setTimeout(() => {
      let emission = 0;
      if (tab === "transportasi") {
        const opt = transportOptions.find(t => t.value === transport);
        if (!opt || !jarak || isNaN(parseFloat(jarak))) { setLoading(false); return; }
        emission = parseFloat((opt.factor * parseFloat(jarak)).toFixed(3));
        setResult({ emission, label: opt.label, detail: `${jarak} km` });
      } else {
        const opt = rumahOptions.find(r => r.value === aktivitas);
        if (!opt || !durasi || isNaN(parseFloat(durasi))) { setLoading(false); return; }
        emission = parseFloat((opt.factor * parseFloat(durasi)).toFixed(3));
        setResult({ emission, label: opt.label, detail: `${durasi} jam` });
      }
      setUsed(true);
      setLoading(false);
    }, 550);
  };

  const level = result
    ? result.emission === 0 ? { text: "Nol Emisi 🌿", color: "#16a34a", bg: "#f0fdf4" }
      : result.emission < 1 ? { text: "Rendah 🌱", color: "#16a34a", bg: "#f0fdf4" }
        : result.emission < 5 ? { text: "Sedang ⚠️", color: "#d97706", bg: "#fffbeb" }
          : { text: "Tinggi 🔥", color: "#dc2626", bg: "#fef2f2" }
    : null;

  const canHitung = !used && (tab === "transportasi" ? (transport && jarak) : (aktivitas && durasi));

  const selectStyle = (hasValue) => ({
    width: "100%", padding: "0.8rem 2.2rem 0.8rem 1rem",
    borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff",
    color: hasValue ? "#1a5c30" : "#9ca3af",
    fontFamily: "Poppins,sans-serif", fontSize: "0.875rem", fontWeight: 500,
    appearance: "none", cursor: "pointer", outline: "none",
  });

  const inputStyle = {
    width: "100%", padding: "0.8rem 2.8rem 0.8rem 1rem",
    borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff",
    color: "#1a5c30", fontFamily: "Poppins,sans-serif", fontSize: "0.875rem", fontWeight: 500, outline: "none",
  };

  const chevron = (
    <span style={{ position: "absolute", right: "0.65rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#1a5c30" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
    </span>
  );

  return (
    <section id="kalkulator" style={{ background: "#f0fdf4", padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.72rem", color: "#2e8b57", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.6rem" }}>COBA SEKARANG</div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.1rem)", fontWeight: 800, color: "#1a5c30", marginBottom: "0.75rem" }}>
            Hitung Emisi Karbon Anda
          </h2>
          <p style={{ fontFamily: "Poppins,sans-serif", color: "#4a7c59", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            Pilih kategori aktivitas seperti transportasi atau rumah tangga, lalu masukkan detail penggunaan untuk mengetahui estimasi emisi karbon yang dihasilkan dari aktivitas sehari-hari Anda.
          </p>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ background: "#2e8b57", borderRadius: 20, padding: "2.25rem 2.25rem 1.75rem", boxShadow: "0 12px 40px rgba(26,92,48,0.18)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -35, right: -35, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -18, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <p style={{ fontFamily: "Poppins,sans-serif", color: "#d1fae5", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.25rem", position: "relative" }}>
              Ayo hitung emisi karbon anda, untuk memantau dan menjaga lingkungan.
            </p>

            {/* Tab switcher */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", background: "rgba(0,0,0,0.15)", borderRadius: 10, padding: "4px", position: "relative" }}>
              {[
                { key: "transportasi", label: <span style={{display:"flex",alignItems:"center",gap:"0.35rem"}}><CarIconSvg size={16}/>Transportasi</span> },
                { key: "rumah_tangga", label: <span style={{display:"flex",alignItems:"center",gap:"0.35rem"}}><HouseIconSvg size={16}/>Rumah Tangga</span> },
              ].map(t => (
                <button key={t.key} onClick={() => switchTab(t.key)} style={{
                  flex: 1, padding: "0.55rem 0.5rem",
                  borderRadius: 8, border: "none",
                  background: tab === t.key ? "#fff" : "transparent",
                  color: tab === t.key ? "#1a5c30" : "#d1fae5",
                  fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.82rem",
                  cursor: "pointer", transition: "all .2s",
                  boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                }}>{t.label}</button>
              ))}
            </div>

            {/* White card */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.25rem 1rem", position: "relative" }}>
              {/* Locked overlay */}
              {used && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 14, zIndex: 10,
                  background: "rgba(255,255,255,0.55)", backdropFilter: "blur(3px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }} />
              )}

              {tab === "transportasi" ? (
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "stretch" }}>
                  <div style={{ flex: "1 1 180px", position: "relative" }}>
                    <select value={transport} disabled={used} onChange={e => { setTransport(e.target.value); setResult(null); }} style={{ ...selectStyle(!!transport), opacity: used ? 0.5 : 1 }}>
                      <option value="">Pilih Transportasi</option>
                      {transportOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {chevron}
                  </div>
                  <div style={{ flex: "1 1 110px", position: "relative" }}>
                    <input type="number" min="0" placeholder="Jarak" value={jarak} disabled={used}
                      onChange={e => { setJarak(e.target.value); setResult(null); }}
                      onKeyDown={e => e.key === "Enter" && hitung()}
                      style={{ ...inputStyle, opacity: used ? 0.5 : 1 }} />
                    <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#1a5c30", fontWeight: 700, fontSize: "0.8rem", pointerEvents: "none" }}>km</span>
                  </div>
                  <HitungBtn onClick={hitung} loading={loading} disabled={!canHitung} />
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "stretch" }}>
                  <div style={{ flex: "1 1 180px", position: "relative" }}>
                    <select value={aktivitas} disabled={used} onChange={e => { setAktivitas(e.target.value); setResult(null); }} style={{ ...selectStyle(!!aktivitas), opacity: used ? 0.5 : 1 }}>
                      <option value="">Pilih Aktivitas</option>
                      {rumahOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {chevron}
                  </div>
                  <div style={{ flex: "1 1 110px", position: "relative" }}>
                    <input type="number" min="0" placeholder="Durasi" value={durasi} disabled={used}
                      onChange={e => { setDurasi(e.target.value); setResult(null); }}
                      onKeyDown={e => e.key === "Enter" && hitung()}
                      style={{ ...inputStyle, opacity: used ? 0.5 : 1 }} />
                    <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#1a5c30", fontWeight: 700, fontSize: "0.8rem", pointerEvents: "none" }}>jam</span>
                  </div>
                  <HitungBtn onClick={hitung} loading={loading} disabled={!canHitung} />
                </div>
              )}

              {result && (
                <div style={{ marginTop: "1rem", padding: "0.9rem 1rem", background: "#f0fdf4", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "lp-fu .35s ease" }}>
                  <div>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#1a5c30" }}>{result.emission}</span>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.8rem", color: "#9ca3af", marginLeft: 6 }}>kg CO₂</span>
                    <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
                      dari {result.label} · {result.detail}
                    </div>
                  </div>
                  <div style={{ background: level.bg, color: level.color, padding: "0.4rem 0.85rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, fontFamily: "Poppins,sans-serif" }}>
                    {level.text}
                  </div>
                </div>
              )}
            </div>

            {/* CTA after used */}
            {used ? (
              <div style={{ marginTop: "1.1rem", background: "rgba(0,0,0,0.18)", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", animation: "lp-fu .4s ease", position: "relative" }}>
                <div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>Mau hitung lebih banyak?</div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.77rem", color: "#b7f5c8", marginTop: 2 }}>Daftar untuk akses penuh tanpa batas.</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <a href="/login" style={{
                    padding: "0.5rem 1rem", borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.4)",
                    color: "#fff", fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: "0.8rem",
                    textDecoration: "none", transition: "all .2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >Login</a>
                  <a href="/register" style={{
                    padding: "0.5rem 1rem", borderRadius: 8, border: "none",
                    background: "#fff", color: "#1a5c30",
                    fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.8rem",
                    textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all .2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; }}
                  >Daftar →</a>
                </div>
              </div>
            ) : (
              <p style={{ fontFamily: "Poppins,sans-serif", textAlign: "center", color: "#b7f5c8", fontSize: "0.82rem", marginTop: "1.1rem", fontWeight: 500, position: "relative" }}>
                Ayo mulai aktivitas anda sekarang!
              </p>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes lp-fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
};

const HitungBtn = ({ onClick, loading, disabled }) => (
  <button onClick={onClick} disabled={loading || disabled} style={{
    flex: "0 0 auto", background: "#1a5c30", color: "#fff",
    border: "none", padding: "0.8rem 1.5rem", borderRadius: 10,
    fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.875rem",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
    transition: "all .2s", boxShadow: "0 3px 10px rgba(26,92,48,0.3)",
  }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#14532d"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "#1a5c30"; }}
  >{loading ? "..." : "Hitung"}</button>
);

/* ── CTA ── */
const CTA = () => (
  <section style={{ background: "linear-gradient(150deg,#1a5c30 0%,#2e8b57 100%)", padding: "6rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -70, left: "8%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -40, right: "12%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
    <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
      <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(1.9rem,4.5vw,2.6rem)", fontWeight: 800, color: "#fff", marginBottom: "1.1rem", lineHeight: 1.2 }}>
        Siap Memulai Jejak yang<br />Lebih Hijau?
      </h2>
      <p style={{ fontFamily: "Poppins,sans-serif", color: "#b7f5c8", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
        Bergabunglah dengan ribuan pengguna yang sudah memulai perubahan kecil untuk bumi yang baik.
      </p>
      <a href="/register" style={{
        display: "inline-block", background: "#fff", color: "#1a5c30",
        padding: "1rem 3.5rem", borderRadius: 50,
        fontFamily: "Poppins,sans-serif", fontWeight: 800, fontSize: "1.1rem",
        textDecoration: "none", boxShadow: "0 4px 22px rgba(0,0,0,0.18)", transition: "all .2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 22px rgba(0,0,0,0.18)"; }}
      >Daftar</a>
    </div>
  </section>
);

/* ── FOOTER ── */
const Footer = () => (
  <footer style={{ background: "#0d2b18", padding: "1.25rem 1.5rem" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
      <Logo light />
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "Poppins,sans-serif", color: "#2d6a4f", fontSize: "0.75rem" }}>© 2024 Sustainify. All rights reserved.</span>
        <span style={{ fontFamily: "Poppins,sans-serif", color: "#2d6a4f", fontSize: "0.75rem" }}>Made with 🌱 for the planet</span>
      </div>
    </div>
  </footer>
);

/* ── PAGE ── */
const LandingPage = () => (
  <div style={{ fontFamily: "Poppins,sans-serif", overflowX: "hidden" }}>
    <Navbar />
    <Hero />
    <Features />
    <Calculator />
    <CTA />
    <Footer />
  </div>
);

export default LandingPage;