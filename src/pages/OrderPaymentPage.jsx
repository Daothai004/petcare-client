// trang thanh toán cho đơn hàng
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMyOrders, thanhToanDonHang } from "../services/api";
import { ThanhToanQR } from "./PaymentPage";

function OrderPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ soThe: "", tenChuThe: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thanhCong, setThanhCong] = useState(false);
  const [donHang, setDonHang] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((res) =>
        setDonHang(res.data.find((d) => d.id === Number(id)) || null),
      )
      .catch(() => {});
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
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
        Chọn ví hoặc quét mã QR để hoàn tất thanh toán
      </div>
      {donHang ? (
        <ThanhToanQR
          soTien={donHang.tongTien}
          maThamChieu={`DH${id}`}
          loading={loading}
          error={error}
          onThanhToan={handleSubmit}
        />
      ) : (
        <p>Đang tải đơn hàng...</p>
      )}
      <p style={{ marginTop: 16 }}>
        <Link to="/don-hang-cua-toi">← Quay lại Đơn hàng của tôi</Link>
      </p>
    </div>
  );
}

export default OrderPaymentPage;
