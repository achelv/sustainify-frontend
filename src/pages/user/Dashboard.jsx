import "../../styles/Dashboard.css";
import iconDashboard from "../../assets/icon-dashboard.png";
import iconEmisi from "../../assets/icon-emisi.png";
import iconRiwayat from "../../assets/icon-riwayat.png";
import iconEco from "../../assets/icon-daun eco.png";
import iconSetting from "../../assets/setting.png";

const Dashboard = () => {
  return (
    <div className="container">
      
      {/* SIDEBAR */}
<aside className="sidebar">
  <div>
    <h2 className="logo">Sustainafy</h2>

    <div className="menu">
      <p className="menu-title">Dashboard</p>
      <div className="menu-item active">
        <img src={iconDashboard} />
        Dashboard
      </div>

      <p className="menu-title">Menu</p>

      <div className="menu-item">
        <img src={iconEmisi} />
        Hitung emisi karbon
      </div>

      <div className="menu-item">
        <img src={iconRiwayat} />
        Riwayat Aktivitas
      </div>

      <div className="menu-item">
        <img src={iconEco} />
        Eco mingguan
      </div>
    </div>
  </div>

  {/* BOTTOM */}
  <div className="sidebar-bottom">
    <div className="menu-item">
      <img src={iconSetting} />
      Pengaturan
    </div>
  </div>

</aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <div className="header">
          <div className="left-header">
            <h1 className="title">Dashboard</h1>
          </div>

          <div className="notif">
            🔔
          </div>
        </div>


        {/* CONTENT */}
        <div className="main-content">

          <h3 className="welcome">Hi, Raina Saraswati</h3>

          {/* CARDS */}
          <div className="cards">

            <div className="card">
              <div className="card-title">
                <span>Eco Minggu ini</span>
              </div>

              <h2>0 <span>CO₂</span></h2>

              <div className="progress">
                <div className="bar"></div>
              </div>

              <p className="target">18/20</p>
            </div>


            <div className="card">
              <div className="card-title">
                <span>Transportasi</span>
              </div>

              <p>Total emisi: <b>0</b></p>
              <p>Aktivitas: <b>0</b></p>
            </div>


            <div className="card">
              <div className="card-title">
                <span>Rumah Tangga</span>
              </div>

              <p>Total emisi: <b>0</b></p>
              <p>Aktivitas: <b>0</b></p>
            </div>

          </div>


          {/* CHART + TIPS */}
          <div className="content">

            <div className="chart-box">
              <h3>Aktivitas CO₂</h3>
              <div className="chart-placeholder"></div>
            </div>

            <div className="tips">
              <h3>Tips Hari ini</h3>

              <p>
                Gunakan transportasi ramah lingkungan seperti berjalan kaki atau 
                bersepeda untuk mengurangi emisi karbon.
              </p>
            </div>

          </div>


          {/* ACTIVITY */}
          <div className="activity">

            <div className="activity-header">
              <h3>Aktivitas Terbaru</h3>
            </div>

            <div className="activity-body">
              <p>Belum ada aktivitas terakhir.</p>
              <p>Ayo hitung karbonmu sekarang!</p>

              <button>Hitung</button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;