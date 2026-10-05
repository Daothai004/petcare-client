// bố cục trang admin
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const vaiTro = localStorage.getItem("vaiTro");
  const hoTen = localStorage.getItem("hoTen");
  const isAdmin = vaiTro === "QuanTriVien";
  const isBacSi = vaiTro === "BacSiThuY";
  const isNhanVien = vaiTro === "NhanVien";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/dang-nhap");
  };

  const tenVaiTro = () => {
    if (isAdmin) return "Quản trị viên";
    if (isBacSi) return "Bác sĩ thú y";
    return "Nhân viên";
  };

  return (
    <div className="admin-layout">
      <div className="admin-mobile-bar">
        <button
          className="navbar-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Mở menu quản trị"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <span>PetCare Admin</span>
      </div>

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : ""}`}
      >
        <div className="admin-sidebar-brand">PetCare Admin</div>

        <nav className="admin-nav" onClick={() => setSidebarOpen(false)}>
          <Link to="/admin">Tổng quan</Link>
          <Link to="/admin/lich-hen">Lịch hẹn</Link>
          {(isBacSi || isAdmin) && <Link to="/admin/benh-an">Bệnh án</Link>}
          {(isBacSi || isNhanVien) && (
            <Link to="/admin/lich-lam-viec-cua-toi">Lịch làm việc của tôi</Link>
          )}
          {isAdmin && (
            <Link to="/admin/lich-lam-viec">Lịch làm việc nhân sự</Link>
          )}
          {(isBacSi || isAdmin) && (
            <Link to="/admin/tiem-phong">Tiêm phòng</Link>
          )}
          {(isBacSi || isAdmin) && (
            <Link to="/admin/phau-thuat">Phẫu thuật</Link>
          )}
          {(isNhanVien || isAdmin) && (
            <Link to="/admin/san-pham">Sản phẩm</Link>
          )}
          {(isNhanVien || isAdmin) && (
            <Link to="/admin/don-hang">Đơn hàng</Link>
          )}
          {isAdmin && <Link to="/admin/dich-vu">Dịch vụ</Link>}
          {isAdmin && <Link to="/admin/nhan-su">Nhân sự</Link>}
          {isAdmin && <Link to="/admin/khach-hang">Khách hàng</Link>}
          {isAdmin && <Link to="/admin/thu-cung">Thú cưng</Link>}
          {isAdmin && <Link to="/admin/tai-khoan">Tài khoản nhân viên</Link>}
          {isAdmin && <Link to="/admin/chatbot-logs">Lịch sử Chatbot</Link>}
          {isAdmin && <Link to="/admin/phan-hoi">Phản hồi</Link>}
        </nav>

        <div className="admin-user">
          <p>
            <strong>{hoTen}</strong>
          </p>
          <p className="admin-role">{tenVaiTro()}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
