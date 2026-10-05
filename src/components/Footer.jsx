import { Link } from "react-router-dom";

// ===== SỬA THÔNG TIN LIÊN HỆ CỦA BẠN Ở ĐÂY =====
const THONG_TIN = {
  diaChi: "Số 1, đường ABC, quận XYZ, Hà Nội",
  dienThoai: "0900 000 000",
  email: "hotro@petcarebooking.vn",
  gioMoCua: "8:00 - 20:00, tất cả các ngày trong tuần",
  zalo: "https://zalo.me/0900000000",
  facebook: "https://www.facebook.com/",
  maps: "https://www.google.com/maps",
};

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="8" r="2.2" />
              <circle cx="12" cy="5" r="2.2" />
              <circle cx="18" cy="8" r="2.2" />
              <path d="M12 12c-4 0-7 2.7-7 6 0 1.7 1.3 3 3 3 1.6 0 2-1 4-1s2.4 1 4 1c1.7 0 3-1.3 3-3 0-3.3-3-6-7-6z" />
            </svg>
            PetCare
          </div>
          <p>
            Hệ thống đặt lịch dịch vụ chăm sóc thú cưng: tắm gội, spa, khám
            bệnh, tiêm phòng và cửa hàng sản phẩm cho thú cưng của bạn.
          </p>
        </div>

        <div>
          <h4>Liên kết nhanh</h4>
          <ul className="footer-list">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/dat-lich">Đặt lịch hẹn</Link>
            </li>
            <li>
              <Link to="/san-pham">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/dang-nhap">Đăng nhập</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Dịch vụ</h4>
          <ul className="footer-list">
            <li>Tắm gội &amp; Spa thư giãn</li>
            <li>Cắt tỉa lông</li>
            <li>Khám tổng quát</li>
            <li>Tiêm phòng</li>
            <li>Phẫu thuật</li>
          </ul>
        </div>

        <div>
          <h4>Liên hệ</h4>
          <ul className="footer-list footer-contact">
            <li>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>{THONG_TIN.diaChi}</span>
            </li>
            <li>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1z" />
              </svg>
              <a href={`tel:${THONG_TIN.dienThoai.replace(/\s/g, "")}`}>
                {THONG_TIN.dienThoai}
              </a>
            </li>
            <li>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.5 7v1.6l7.5 5.1 7.5-5.1V7z" />
              </svg>
              <a href={`mailto:${THONG_TIN.email}`}>{THONG_TIN.email}</a>
            </li>
            <li>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.2l4 2.4-.8 1.3L11 13V7z" />
              </svg>
              <span>{THONG_TIN.gioMoCua}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 PetCare. Mọi quyền được bảo lưu.</span>
        <div className="footer-social">
          <a href={THONG_TIN.zalo} target="_blank" rel="noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5L5 21l3.4-1.8c1.1.3 2.4.5 3.6.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
            </svg>
            Zalo
          </a>
          <a href={THONG_TIN.facebook} target="_blank" rel="noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.5V11H7v4h2.5v6h4v-6H16l.5-4h-3V8.7c0-.5.3-.7 1-.7z" />
            </svg>
            Facebook
          </a>
          <a href={THONG_TIN.maps} target="_blank" rel="noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
            Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
