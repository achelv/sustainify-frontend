function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Sustainify</h2>

      <ul>
        <li className="active">Dashboard</li>
        <li>Hitung emisi karbon</li>
        <li>Riwayat Aktivitas</li>
        <li>Eco Mingguan</li>
      </ul>

      <div className="setting">
        Pengaturan
      </div>
    </div>
  );
}

export default Sidebar;