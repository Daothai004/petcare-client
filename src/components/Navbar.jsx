import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const hoTen = localStorage.getItem("hoTen");
  const vaiTro = localStorage.getItem("vaiTro");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const dongMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-brand" onClick={dongMenu}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6" cy="8" r="2.2" />
            <circle cx="12" cy="5" r="2.2" />
            <circle cx="18" cy="8" r="2.2" />
            <path d="M12 12c-4 0-7 2.7-7 6 0 1.7 1.3 3 3 3 1.6 0 2-1 4-1s2.4 1 4 1c1.7 0 3-1.3 3-3 0-3.3-3-6-7-6z" />
          </svg>
          PetCare
        </Link>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
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
      </div>

      <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
        <Link to="/" onClick={dongMenu}>
          Trang chủ
        </Link>
        <Link to="/dat-lich" onClick={dongMenu}>
          Đặt lịch
        </Link>

        {token && vaiTro === "KhachHang" && (
          <Link to="/thu-cung-cua-toi" onClick={dongMenu}>
            Thú cưng của tôi
          </Link>
        )}
        {token && vaiTro === "KhachHang" && (
          <Link to="/lich-hen-cua-toi" onClick={dongMenu}>
            Lịch hẹn của tôi
          </Link>
        )}
        <Link to="/san-pham" onClick={dongMenu}>
          Sản phẩm
        </Link>
        {token && vaiTro === "KhachHang" && (
          <Link to="/don-hang-cua-toi" onClick={dongMenu}>
            Đơn hàng của tôi
          </Link>
        )}

        {token ? (
          <>
            <Link
              to="/ho-so"
              className="navbar-avatar"
              onClick={dongMenu}
              title={hoTen}
            >
              <span className="navbar-avatar-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
                </svg>
              </span>
              <span className="navbar-avatar-label">Hồ sơ của tôi</span>
            </Link>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Đăng xuất
            </a>
          </>
        ) : (
          <>
            <Link to="/dang-nhap" onClick={dongMenu}>
              Đăng nhập
            </Link>
            <Link to="/dang-ky" onClick={dongMenu}>
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
