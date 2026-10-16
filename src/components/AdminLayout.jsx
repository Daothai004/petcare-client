// bố cục trang admin
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

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

  // Menu chia nhóm. Mỗi mục có điều kiện "hien" theo vai trò;
  // nhóm nào không có mục nào hiện thì ẩn luôn cả tiêu đề nhóm.
  const nhomMenu = [
    {
      ten: null,
      muc: [{ to: "/admin", nhan: "Tổng quan", hien: true, end: true }],
    },
    {
      ten: "Lịch hẹn & ca làm",
      muc: [
        { to: "/admin/lich-hen", nhan: "Lịch hẹn", hien: true },
        {
          to: "/admin/lich-lam-viec-cua-toi",
          nhan: "Lịch làm việc của tôi",
          hien: isBacSi || isNhanVien,
        },
        {
          to: "/admin/lich-lam-viec",
          nhan: "Lịch làm việc nhân sự",
          hien: isAdmin,
        },
      ],
    },
    {
      ten: "Khám chữa bệnh",
      muc: [
        { to: "/admin/benh-an", nhan: "Bệnh án", hien: isBacSi || isAdmin },
        {
          to: "/admin/tiem-phong",
          nhan: "Tiêm phòng",
          hien: isBacSi || isAdmin,
        },
        {
          to: "/admin/phau-thuat",
          nhan: "Phẫu thuật",
          hien: isBacSi || isAdmin,
        },
        {
          to: "/admin/kho-vat-tu",
          nhan: "Kho thuốc & vật tư",
          hien: isBacSi || isAdmin,
        },
      ],
    },
    {
      ten: "Bán hàng",
      muc: [
        {
          to: "/admin/san-pham",
          nhan: "Sản phẩm",
          hien: isNhanVien || isAdmin,
        },
        {
          to: "/admin/don-hang",
          nhan: "Đơn hàng",
          hien: isNhanVien || isAdmin,
        },
      ],
    },
    {
      ten: "Quản lý",
      muc: [
        { to: "/admin/dich-vu", nhan: "Dịch vụ", hien: isAdmin },
        { to: "/admin/nhan-su", nhan: "Nhân sự", hien: isAdmin },
        { to: "/admin/tai-khoan", nhan: "Tài khoản nhân viên", hien: isAdmin },
        { to: "/admin/khach-hang", nhan: "Khách hàng", hien: isAdmin },
        { to: "/admin/thu-cung", nhan: "Thú cưng", hien: isAdmin },
      ],
    },
    {
      ten: "Báo cáo & hệ thống",
      muc: [
        { to: "/admin/bao-cao", nhan: "Báo cáo & Excel", hien: true },
        { to: "/admin/phan-hoi", nhan: "Phản hồi", hien: isAdmin },
        { to: "/admin/chatbot-logs", nhan: "Lịch sử Chatbot", hien: isAdmin },
      ],
    },
  ];

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
          {nhomMenu.map((nhom) => {
            const mucHien = nhom.muc.filter((m) => m.hien);
            if (mucHien.length === 0) return null;
            return (
              <div key={nhom.ten || "dau"} className="admin-nav-group">
                {nhom.ten && <div className="admin-nav-title">{nhom.ten}</div>}
                {mucHien.map((m) => (
                  <NavLink
                    key={m.to}
                    to={m.to}
                    end={m.end}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {m.nhan}
                  </NavLink>
                ))}
              </div>
            );
          })}
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
