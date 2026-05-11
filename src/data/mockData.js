export const activities = [
  { id: 1, type: "car", date: "12 April 2025, 09.30", emission: 0.06, category: "Transportasi" },
  { id: 2, type: "bus", date: "1 Januari 2025, 09.30", emission: 0.29, category: "Transportasi" },
  { id: 3, type: "monitor", date: "30 Januari 2025, 10.00", emission: 1.69, category: "Rumah Tangga" },
  { id: 4, type: "ev", date: "12 April 2025, 09.30", emission: 0.06, category: "Transportasi" },
  { id: 5, type: "car", date: "12 April 2025, 09.30", emission: 0.06, category: "Transportasi" },
];

export const tableData = Array.from({ length: 5 }, (_, i) => ({
  no: i + 1,
  id: "K00T21",
  tanggal: "21 April 2026",
  waktu: "07.30",
  aktivitas: "Mengendarai montor",
  jumlah: "3 km",
  emisi: 0.06,
}));

export const weeklyChartData = [
  { day: "Senin", value: 1.1 },
  { day: "Selasa", value: 2.3 },
  { day: "Rabu", value: 2.02 },
  { day: "Kamis", value: 1.9 },
  { day: "Jumat", value: 0.59 },
  { day: "Sabtu", value: 0.8 },
  { day: "Minggu", value: 1.3 },
];

export const stats = {
  totalEmisi: 3.275,
  transportasi: { value: 0.07, aktivitas: 3 },
  rumahTangga: { value: 0.06, aktivitas: 3 },
};

export const catatan = "Total konsumsi minggu ini 9.9 unit. Penggunaan tertinggi pada Selasa (2.3) dan paling efisien pada Jumat (0.58). Tren menurun mulai terlihat di akhir pekan.";

export const navMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  {
    id: "hitung-emisi", label: "Hitung emisi karbon", icon: "calculator",
    submenu: [
      { id: "hitung-transportasi", label: "Transportasi" },
      { id: "hitung-rumah-tangga", label: "Rumah Tangga" },
    ],
  },
  { id: "riwayat", label: "Riwayat Aktivitas", icon: "history" },
  { id: "eco-mingguan", label: "Eco mingguan", icon: "leaf" },
];