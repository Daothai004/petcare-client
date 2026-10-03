// bảng điều khiển admin
import { useEffect, useState } from "react";
import { getDashboard, getRevenueByService } from "../../services/api";

// Biểu đồ cột doanh thu theo dịch vụ - vẽ bằng SVG thuần, không cần cài thêm
// thư viện chart nào (recharts, chart.js...), tránh phải npm install thêm.
function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="chart-empty">
        Chưa có lịch hẹn hoàn tất nào trong 30 ngày gần đây để thống kê.
      </p>
    );
  }

  const max = Math.max(...data.map((d) => d.doanhThu), 1);
  const chartHeight = 220;

  return (
    <div className="revenue-chart">
      {data.map((d) => {
        const heightPct = (d.doanhThu / max) * 100;
        return (
          <div className="revenue-bar-col" key={d.tenDichVu}>
            <div className="revenue-bar-value">
              {Number(d.doanhThu).toLocaleString("vi-VN")} đ
            </div>
            <div className="revenue-bar-track" style={{ height: chartHeight }}>
              <div
                className="revenue-bar-fill"
                style={{ height: `${heightPct}%` }}
                title={`${d.soLuot} lượt`}
              />
            </div>
            <div className="revenue-bar-label">{d.tenDichVu}</div>
          </div>
        );
      })}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));

    getRevenueByService()
      .then((res) => setRevenue(res.data))
      .catch(() => setRevenue([])); // biểu đồ không quan trọng bằng số liệu chính, lỗi thì để rỗng
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return <p>Đang tải dữ liệu...</p>;
  const laAdmin = localStorage.getItem("vaiTro") === "QuanTriVien";

  return (
    <div>
      <h1>Tổng quan</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Lịch hẹn hôm nay</span>
          <span className="stat-value">{stats.lichHenHomNay}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Chờ xác nhận</span>
          <span className="stat-value">{stats.choXacNhan}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Doanh thu tháng này</span>
          <span className="stat-value">
            {Number(stats.doanhThuThang).toLocaleString("vi-VN")} đ
          </span>
        </div>
        {laAdmin && (
          <div className="stat-card">
            <span className="stat-label">Tổng khách hàng</span>
            <span className="stat-value">{stats.tongKhachHang}</span>
          </div>
        )}
      </div>

      <div className="chart-card">
        <h2>Doanh thu theo dịch vụ (30 ngày gần nhất)</h2>
        <RevenueChart data={revenue} />
      </div>
    </div>
  );
}

export default AdminDashboard;
