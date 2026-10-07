// Trang chi tiết một dịch vụ
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getServices } from "../services/api";
import { layNoiDung } from "../data/serviceContent";

function ServiceDetail() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  // Chuyển sang dịch vụ khác thì cuộn lên đầu trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  const dichVu = services.find((s) => String(s.id) === id);

  if (error || !dichVu) {
    return (
      <div className="page">
        <h1>Không tìm thấy dịch vụ</h1>
        <p>
          {error
            ? `Chưa tải được dữ liệu: ${error}`
            : "Dịch vụ này không tồn tại hoặc đã ngừng cung cấp."}
        </p>
        <Link to="/">← Về trang chủ</Link>
      </div>
    );
  }

  const nd = layNoiDung(dichVu);
  const giaText = `${Number(dichVu.gia).toLocaleString("vi-VN")} đ`;
  const dichVuKhac = services.filter((s) => s.id !== dichVu.id);

  return (
    <div>
      <section className="sd-hero">
        <img
          className="sd-hero-img"
          src={nd.anh}
          alt={dichVu.tenDichVu}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="sd-hero-overlay" />
        <div className="sd-hero-text">
          <p className="sd-breadcrumb">
            <Link to="/">Trang chủ</Link> / Dịch vụ / {dichVu.tenDichVu}
          </p>
          <h1>{dichVu.tenDichVu}</h1>
          <p>{nd.tomTat}</p>
        </div>
      </section>

      <div className="sd-body">
        <div className="sd-main">
          <h2>Tổng quan</h2>
          {nd.tongQuan.map((doan, i) => (
            <p key={i}>{doan}</p>
          ))}

          <h2>Quy trình thực hiện</h2>
          <ol className="sd-steps">
            {nd.quyTrinh.map((b, i) => (
              <li key={i}>
                <strong>{b.tieuDe}</strong>
                {b.noiDung}
              </li>
            ))}
          </ol>

          <h2>Lợi ích</h2>
          <ul className="sd-check">
            {nd.loiIch.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>

          <h2>Lưu ý trước khi đến</h2>
          <ul className="sd-notes">
            {nd.luuY.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>

          {nd.cauHoi.length > 0 && (
            <>
              <h2>Câu hỏi thường gặp</h2>
              <div className="sd-faq">
                {nd.cauHoi.map((c, i) => (
                  <details key={i}>
                    <summary>{c.hoi}</summary>
                    <p>{c.traLoi}</p>
                  </details>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="sd-side">
          <div className="sd-price-card">
            <span className="sd-price-label">
              {nd.ghiChuGia ? "Giá tham khảo" : "Giá dịch vụ"}
            </span>
            <strong className="sd-price">{giaText}</strong>
            <span>Thời gian: khoảng {dichVu.thoiLuongPhut} phút</span>
            <Link className="sd-btn" to="/dat-lich">
              Đặt lịch ngay
            </Link>
            <p className="sd-note">
              {nd.ghiChuGia ||
                "Giá đã bao gồm mọi chi phí, không phát sinh thêm."}
            </p>
          </div>
        </aside>
      </div>

      {dichVuKhac.length > 0 && (
        <section className="section">
          <h2 className="section-title">Dịch vụ khác</h2>
          <div className="service-grid">
            {dichVuKhac.map((s) => (
              <div key={s.id} className="service-card">
                <span className="service-name">{s.tenDichVu}</span>
                <span className="service-duration">{s.thoiLuongPhut} phút</span>
                <span className="service-price">
                  {Number(s.gia).toLocaleString("vi-VN")} đ
                </span>
                <Link to={`/dich-vu/${s.id}`}>Xem chi tiết →</Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ServiceDetail;
