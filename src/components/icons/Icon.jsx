const iconStyle = (style) => ({ width: "20px", height: "20px", ...style });

export const HomeIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

export const CalculatorIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 10h8M8 14h4" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
    <circle cx="16" cy="18" r="1" fill="currentColor" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
    <circle cx="8" cy="18" r="1" fill="currentColor" />
  </svg>
);

export const HistoryIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

export const LeafIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const SettingsIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export const BellIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const CarIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5Z" />
    <path d="M3 9h12l-2-4H5L3 9Z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="15" cy="17" r="2" />
    <path d="M19 9h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
  </svg>
);

export const BusIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-4.3c.3-2.7.2-6.5.2-6.5L16 5H4L2 7.3C1.7 10 1.6 13.7 1.9 16.4 2.2 19 3 20 3 20h2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="15" cy="18" r="2" />
  </svg>
);

export const MonitorIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

export const EVIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h11l4 4v4a2 2 0 0 1-2 2h-2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="15" cy="17" r="2" />
    <path d="M13 8l-2 3h3l-2 3" />
  </svg>
);

export const CO2Icon = ({ style }) => (
  <svg style={{ width: "48px", height: "48px", ...style }} viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="28" fill="#e8f5e9" />
    <path d="M14 30c0-5 3-9 7-10.5" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 18c2-3 5-5 8-5s6 2 8 5" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 19.5c4 1.5 7 5.5 7 10.5 0 6.1-4.9 11-11 11H16c-4.4 0-8-3.6-8-8 0-4 3-7.3 6.8-7.9" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
    <text x="18" y="37" fontSize="10" fontWeight="bold" fill="#1b5e20" fontFamily="serif">CO₂</text>
    <path d="M24 14c0-2 1-4 3-5 0 3 2 5 5 5-1 3-4 5-8 4" fill="#4caf50" opacity="0.5" />
  </svg>
);

export const TransportIcon = ({ style }) => (
  <svg style={{ width: "36px", height: "36px", ...style }} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#e8f5e9" />
    <path d="M6 20h20M8 14h16l-2-5H10L8 14Z" stroke="#2e7d32" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="11" cy="22" r="2" stroke="#2e7d32" strokeWidth="1.8" />
    <circle cx="21" cy="22" r="2" stroke="#2e7d32" strokeWidth="1.8" />
    <path d="M6 20V14M26 20V14" stroke="#2e7d32" strokeWidth="1.8" />
  </svg>
);

export const HouseIcon = ({ style }) => (
  <svg style={{ width: "36px", height: "36px", ...style }} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#e8f5e9" />
    <path d="M5 16l11-10 11 10" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 13.5V25h6v-5h4v5h6V13.5" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DetailIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12h6M9 16h4M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9L13 3Z" />
    <path d="M13 3v6h6" />
  </svg>
);

export const DeleteIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const EditIcon = ({ style }) => (
  <svg style={iconStyle(style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
);
