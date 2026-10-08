// trang thanh toán
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thanhToanLichHen, getInvoice } from "../services/api";
import InvoiceTable from "../components/InvoiceTable";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState({ soThe: "", tenChuThe: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thanhCong, setThanhCong] = useState(false);

  useEffect(() => {
    getInvoice(id)
      .then((res) => setInvoice(res.data))
      .catch((err) =>
        setLoadError(err.response?.data?.message || "Không tải được biên lai."),
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
      await thanhToanLichHen(id);
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
        <h1>Biên lai lịch hẹn #{id}</h1>
        <div className="alert alert-error">{loadError}</div>
        <Link to="/lich-hen-cua-toi">← Quay lại Lịch hẹn của tôi</Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="page">
        <p>Đang tải biên lai...</p>
      </div>
    );
  }

  const tongText = `${Number(invoice.tongCong).toLocaleString("vi-VN")} đ`;

  if (thanhCong) {
    return (
      <div className="page">
        <div className="payment-success-box">
          <div className="payment-success-icon">✓</div>
          <h2>Thanh toán thành công</h2>
          <p>
            Đã thanh toán {tongText} cho lịch hẹn #{id}.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ink-soft)" }}>
            Đang chuyển về trang Lịch hẹn của tôi...
          </p>
        </div>
      </div>
    );
  }

  const daHuy = invoice.trangThai === 3;

  return (
    <div className="page">
      <h1>
        {invoice.daThanhToan ? "Biên lai" : "Biên lai & thanh toán"} #{id}
      </h1>

      <InvoiceTable invoice={invoice} />

      {invoice.daThanhToan && (
        <div className="alert alert-success no-print">
          Lịch hẹn này đã được thanh toán.{" "}
          <button className="btn-small" onClick={() => window.print()}>
            In biên lai
          </button>
        </div>
      )}

      {daHuy && !invoice.daThanhToan && (
        <div className="alert alert-error">
          Lịch hẹn đã bị hủy nên không thể thanh toán.
        </div>
      )}

      {!invoice.daThanhToan && !daHuy && (
        <div className="no-print">
          <p style={{ color: "var(--color-ink-soft)", fontSize: "0.9rem" }}>
            Bác sĩ hoặc nhân viên có thể bổ sung thuốc, sản phẩm... vào biên lai
            trong quá trình phục vụ. Bạn nên thanh toán sau khi dịch vụ hoàn tất
            để có số tiền cuối cùng.
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
