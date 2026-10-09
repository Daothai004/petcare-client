// Trang hóa đơn + thanh toán (id trên đường dẫn là mã HÓA ĐƠN)
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thanhToanHoaDon, getHoaDon } from "../services/api";
import HoaDonView from "../components/HoaDonView";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hoaDon, setHoaDon] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState({ soThe: "", tenChuThe: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thanhCong, setThanhCong] = useState(false);

  useEffect(() => {
    getHoaDon(id)
      .then((res) => setHoaDon(res.data))
      .catch((err) =>
        setLoadError(err.response?.data?.message || "Không tải được hóa đơn."),
      );
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      await thanhToanHoaDon(id);
      setThanhCong(true);
      setTimeout(() => navigate("/lich-hen-cua-toi"), 2200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Thanh toán thất bại, vui lòng thử lại.",
      );
      setLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="page">
        <h1>Hóa đơn #{id}</h1>
        <div className="alert alert-error">{loadError}</div>
        <Link to="/lich-hen-cua-toi">← Quay lại Lịch hẹn của tôi</Link>
      </div>
    );
  }

  if (!hoaDon) {
    return (
      <div className="page">
        <p>Đang tải hóa đơn...</p>
      </div>
    );
  }

  const tongText = `${Number(hoaDon.tongCong).toLocaleString("vi-VN")} đ`;

  if (thanhCong) {
    return (
      <div className="page">
        <div className="payment-success-box">
          <div className="payment-success-icon">✓</div>
          <h2>Thanh toán thành công</h2>
          <p>
            Đã thanh toán {tongText} cho hóa đơn #{id}.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ink-soft)" }}>
            Đang chuyển về trang Lịch hẹn của tôi...
          </p>
        </div>
      </div>
    );
  }

  const khongCoKhoan = hoaDon.chiTiet.length === 0;

  return (
    <div className="page">
      <h1>
        {hoaDon.daThanhToan ? "Hóa đơn" : "Hóa đơn & thanh toán"} #{id}
      </h1>

      <HoaDonView hoaDon={hoaDon} />

      {hoaDon.daThanhToan && (
        <div className="alert alert-success no-print">
          Hóa đơn này đã được thanh toán.{" "}
          <button className="btn-small" onClick={() => window.print()}>
            In hóa đơn
          </button>
        </div>
      )}

      {!hoaDon.daThanhToan && khongCoKhoan && (
        <div className="alert alert-error">
          Hóa đơn chưa có khoản nào cần thanh toán (các lịch hẹn có thể đã bị
          hủy).
        </div>
      )}

      {!hoaDon.daThanhToan && !khongCoKhoan && (
        <div className="no-print">
          <p style={{ color: "var(--color-ink-soft)", fontSize: "0.9rem" }}>
            Bác sĩ hoặc nhân viên có thể bổ sung thuốc, vật tư vào hóa đơn trong
            quá trình phục vụ, nên bạn thanh toán sau khi dịch vụ hoàn tất để có
            số tiền cuối cùng. Muốn mua thêm sản phẩm và thanh toán chung,{" "}
            <Link to="/san-pham">chọn sản phẩm</Link> rồi ở bước đặt hàng chọn{" "}
            <strong>&quot;Gộp vào hóa đơn #{id}&quot;</strong>.
          </p>

          <div className="form-card" style={{ maxWidth: "none" }}>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="soThe">Số thẻ</label>
                <input
                  id="soThe"
                  name="soThe"
                  value={form.soThe}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="tenChuThe">Tên chủ thẻ</label>
                <input
                  id="tenChuThe"
                  name="tenChuThe"
                  value={form.tenChuThe}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Đang xử lý..." : `Thanh toán ${tongText}`}
              </button>
            </form>
          </div>
        </div>
      )}

      <p className="no-print" style={{ marginTop: 16 }}>
        <Link to="/lich-hen-cua-toi">← Quay lại Lịch hẹn của tôi</Link>
      </p>
    </div>
  );
}

export default PaymentPage;
