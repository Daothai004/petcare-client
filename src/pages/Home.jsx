// trang chủ
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices, getStaff } from "../services/api";
import Carousel from "../components/Carousel";

const heroImages = [
  "https://images.pexels.com/photos/1436139/pexels-photo-1436139.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/19145894/pexels-photo-19145894.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/6816855/pexels-photo-6816855.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/28730603/pexels-photo-28730603.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/6131580/pexels-photo-6131580.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

function Home() {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);
  const [nhanSuDangXem, setNhanSuDangXem] = useState(null); // nhân sự đang mở modal, null = đang đóng

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch((err) => setError(err.message));

    getStaff().then((res) => setStaff(res.data));
  }, []);

  return (
    <>
      <section className="hero-section">
        <Carousel images={heroImages} />
        <div className="hero-overlay">
          <div className="hero-overlay-content">
            <h1>Chăm sóc thú cưng, đặt lịch chỉ trong 1 phút</h1>
            <p>
              Xem giá dịch vụ rõ ràng, chọn đúng nhân sự bạn tin tưởng và đặt
              lịch hẹn ngay trên trình duyệt — không cần gọi điện, không cần chờ
              xác nhận thủ công.
            </p>
            <div className="hero-actions">
              <Link to="/dat-lich" className="btn-accent">
                Đặt lịch ngay
              </Link>
              <a href="#dich-vu" className="btn-outline">
                Xem dịch vụ
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ===== GIỚI THIỆU CƠ SỞ ===== */}
      <section className="section about-section">
        <div className="about-content">
          <h2 className="section-title" style={{ textAlign: "left" }}>
            Về PetCare
          </h2>
          <p>
            PetCare là cơ sở chăm sóc thú cưng ra đời với mong muốn đơn giản:
            giúp việc chăm sóc chó mèo trở nên thuận tiện và đáng tin cậy hơn
            cho mọi gia đình. Chúng tôi cung cấp đầy đủ các dịch vụ từ tắm gội,
            cắt tỉa lông, spa thư giãn đến khám sức khỏe định kỳ, với đội ngũ
            nhân viên spa và bác sĩ thú y giàu kinh nghiệm.
          </p>
          <p>
            Thay vì phải gọi điện, chờ xác nhận thủ công như trước đây, khách
            hàng của PetCare giờ đây có thể tự đặt lịch, theo dõi và quản lý hồ
            sơ thú cưng của mình mọi lúc mọi nơi, ngay trên nền tảng Web này.
          </p>
        </div>
      </section>
      <section className="features">
        <div className="feature-item">
          <svg
            className="feature-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          <h3>Đặt lịch chủ động</h3>
          <p>
            Xem ngay khung giờ còn trống của từng nhân sự, không cần gọi điện
            hỏi lại.
          </p>
        </div>
        <div className="feature-item">
          <svg
            className="feature-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          </svg>
          <h3>Không lo trùng lịch</h3>
          <p>
            Hệ thống tự kiểm tra và chặn trùng lịch ngay khi bạn xác nhận đặt
            hẹn.
          </p>
        </div>
        <div className="feature-item">
          <svg
            className="feature-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
          </svg>
          <h3>Đúng người thực hiện</h3>
          <p>
            Chọn đúng nhân viên hoặc bác sĩ thú y bạn muốn cho từng lượt hẹn.
          </p>
        </div>
      </section>

      <section id="dich-vu" className="section">
        <h2 className="section-title">Dịch vụ của chúng tôi</h2>
        <p className="section-subtitle">
          Giá đã bao gồm mọi chi phí, không phát sinh thêm
        </p>

        {error && (
          <div className="alert alert-error">Chưa gọi được API: {error}</div>
        )}
        {!error && services.length === 0 && (
          <p style={{ textAlign: "center" }}>Đang tải danh sách dịch vụ...</p>
        )}

        <div className="service-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <span className="service-name">{s.tenDichVu}</span>
              <span className="service-duration">{s.thoiLuongPhut} phút</span>
              <span className="service-price">
                {Number(s.gia).toLocaleString("vi-VN")} đ
              </span>
              <Link to="/dat-lich">Đặt lịch dịch vụ này →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Đội ngũ của chúng tôi</h2>
        <p className="section-subtitle">
          Nhân viên spa và bác sĩ thú y giàu kinh nghiệm
        </p>

        <div className="staff-grid">
          {staff.map((n) => (
            <div
              key={n.id}
              className="staff-card staff-card-clickable"
              onClick={() => setNhanSuDangXem(n)}
            >
              <div className="staff-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>
              <span className="staff-name">{n.hoTen}</span>
              <span className="staff-role">{n.chucVu}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Modal hiện thông tin chi tiết khi bấm vào 1 nhân sự - bấm ra ngoài
          nền tối hoặc nút X để đóng lại */}
      {nhanSuDangXem && (
        <div className="modal-overlay" onClick={() => setNhanSuDangXem(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setNhanSuDangXem(null)}
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="staff-avatar staff-avatar-lg">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>

            <h2>{nhanSuDangXem.hoTen}</h2>
            <p className="staff-role">{nhanSuDangXem.chucVu}</p>

            <div className="staff-detail-list">
              <div className="staff-detail-row">
                <span className="staff-detail-label">Trình độ</span>
                <span>{nhanSuDangXem.trinhDo || "Đang cập nhật"}</span>
              </div>
              <div className="staff-detail-row">
                <span className="staff-detail-label">Kinh nghiệm</span>
                <span>{nhanSuDangXem.kinhNghiem || "Đang cập nhật"}</span>
              </div>
              {nhanSuDangXem.gioiThieu && (
                <p className="staff-detail-bio">{nhanSuDangXem.gioiThieu}</p>
              )}
            </div>

            <Link
              to="/dat-lich"
              className="btn-accent"
              style={{ marginTop: 20, display: "inline-block" }}
            >
              Đặt lịch với {nhanSuDangXem.hoTen}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
