// trang thanh toán cho đơn hàng
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thanhToanDonHang } from "../services/api";

function OrderPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ soThe: "", tenChuThe: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thanhCong, setThanhCong] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      await thanhToanDonHang(id);
      setThanhCong(true);
      setTimeout(() => navigate("/don-hang-cua-toi"), 1800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Thanh toán thất bại, vui lòng thử lại.",
      );
      setLoading(false);
    }
  };

  if (thanhCong) {
    return (
      <div className="page">
        <div className="payment-success-box">
          <div className="payment-success-icon">✓</div>
          <h2>Thanh toán thành công</h2>
          <p>Đơn hàng #{id} đã được đánh dấu là đã thanh toán.</p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ink-soft)" }}>
            Đang chuyển về trang Đơn hàng của tôi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Thanh toán đơn hàng #{id}</h1>
      <div className="alert alert-success" style={{ marginBottom: 20 }}>
        Hãy điền thông tin để hoàn tất thanh toán
      </div>

      <div className="form-card">
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
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link to="/don-hang-cua-toi">← Quay lại Đơn hàng của tôi</Link>
      </p>
    </div>
  );
}

export default OrderPaymentPage;
