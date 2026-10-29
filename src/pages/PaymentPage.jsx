// Trang hóa đơn + thanh toán (id trên đường dẫn là mã HÓA ĐƠN)
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thanhToanHoaDon, getHoaDon } from "../services/api";
import HoaDonView from "../components/HoaDonView";
import { QRCodeSVG } from "qrcode.react";

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

  const handleSubmit = async (phuongThuc, maGiaoDich) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      await thanhToanHoaDon(id, { phuongThuc, maGiaoDich });
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
    <div className="page khach-khong-in">
      <h1>
        {hoaDon.daThanhToan ? "Hóa đơn" : "Hóa đơn & thanh toán"} #{id}
      </h1>

      <HoaDonView hoaDon={hoaDon} />

      {hoaDon.daThanhToan && (
        <div className="alert alert-success">
          Hóa đơn này đã được thanh toán. Nếu cần bản in, vui lòng liên hệ nhân
          viên tại quầy.
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
          <ThanhToanQR
            soTien={hoaDon.tongCong}
            maThamChieu={`HD${id}`}
            loading={loading}
            error={error}
            onThanhToan={handleSubmit}
          />
        </div>
      )}

      <p className="no-print" style={{ marginTop: 16 }}>
        <Link to="/lich-hen-cua-toi">← Quay lại Lịch hẹn của tôi</Link>
      </p>
    </div>
  );
}

export default PaymentPage;
// ===== Cổng thanh toán giả lập (VNPay QR / ví điện tử) =====
const DANH_SACH_VI = [
  {
    id: "VNPAY",
    ten: "VNPay QR",
    mau: "#0a4ea3",
    chu: "VN",
    moTa: "Quét bằng app ngân hàng",
  },
  {
    id: "MOMO",
    ten: "Ví MoMo",
    mau: "#a50064",
    chu: "Mo",
    moTa: "Quét bằng app MoMo",
  },
  {
    id: "ZALOPAY",
    ten: "ZaloPay",
    mau: "#0068ff",
    chu: "Zl",
    moTa: "Quét bằng app ZaloPay",
  },
  {
    id: "SHOPEEPAY",
    ten: "ShopeePay",
    mau: "#ee4d2d",
    chu: "Sp",
    moTa: "Quét bằng app Shopee",
  },
];

export function ThanhToanQR({
  soTien,
  maThamChieu,
  loading,
  error,
  onThanhToan,
}) {
  const [vi, setVi] = useState("VNPAY");
  const [buoc, setBuoc] = useState("chon"); // "chon" hoặc "qr"
  const [conLai, setConLai] = useState(300);
  const [maGD, setMaGD] = useState("");
  const [dangXacNhan, setDangXacNhan] = useState(false);

  useEffect(() => {
    if (buoc !== "qr" || conLai <= 0) return;
    const t = setTimeout(() => setConLai((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [buoc, conLai]);

  const viChon = DANH_SACH_VI.find((v) => v.id === vi);
  const tienText = `${Number(soTien).toLocaleString("vi-VN")} đ`;
  const phut = String(Math.floor(conLai / 60)).padStart(2, "0");
  const giay = String(conLai % 60).padStart(2, "0");
  const hetHan = conLai <= 0;

  const taoMa = () => {
    setMaGD("PC" + Date.now().toString().slice(-10));
    setConLai(300);
    setBuoc("qr");
  };

  const xacNhan = async () => {
    setDangXacNhan(true);
    await new Promise((r) => setTimeout(r, 1200));
    await onThanhToan(vi, maGD);
    setDangXacNhan(false);
  };

  const noiDungQR = `PETCARE|${vi}|${maThamChieu}|${soTien}|${maGD}`;

  return (
    <div className="form-card" style={{ maxWidth: "none" }}>
      {error && <div className="alert alert-error">{error}</div>}
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--color-ink-soft)",
          marginTop: 0,
        }}
      >
        Cổng thanh toán giả lập phục vụ đồ án, không phát sinh giao dịch thật.
      </p>

      {buoc === "chon" ? (
        <>
          <h3 style={{ marginTop: 0 }}>Chọn phương thức thanh toán</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
            }}
          >
            {DANH_SACH_VI.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVi(v.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 12,
                  background: "#fff",
                  border:
                    vi === v.id
                      ? `2px solid ${v.mau}`
                      : "2px solid var(--color-line)",
                }}
              >
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: v.mau,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {v.chu}
                </span>
                <span>
                  <strong style={{ display: "block" }}>{v.ten}</strong>
                  <small style={{ color: "var(--color-ink-soft)" }}>
                    {v.moTa}
                  </small>
                </span>
              </button>
            ))}
          </div>
          <p style={{ margin: "16px 0 8px" }}>
            Số tiền thanh toán: <strong>{tienText}</strong>
          </p>
          <button type="button" className="btn-primary" onClick={taoMa}>
            Tiếp tục với {viChon.ten}
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 999,
              background: viChon.mau,
              color: "#fff",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {viChon.ten}
          </div>

          <div
            style={{
              position: "relative",
              display: "inline-block",
              padding: 14,
              background: "#fff",
              border: "1px solid var(--color-line)",
              borderRadius: 14,
            }}
          >
            <QRCodeSVG value={noiDungQR} size={200} level="M" />
            {hetHan && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.93)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  padding: 12,
                }}
              >
                Mã QR đã hết hạn
              </div>
            )}
          </div>

          <h2 style={{ margin: "12px 0 2px" }}>{tienText}</h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: "var(--color-ink-soft)",
            }}
          >
            Nội dung: {maThamChieu} · Mã giao dịch: {maGD}
          </p>
          <p
            style={{
              margin: "8px 0",
              color: hetHan ? "var(--color-error)" : "var(--color-ink)",
            }}
          >
            {hetHan ? "Vui lòng tạo mã mới" : `Mã hết hạn sau ${phut}:${giay}`}
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-ink-soft)",
              maxWidth: 420,
              margin: "0 auto 14px",
            }}
          >
            Mở ứng dụng {viChon.ten}, chọn quét mã và đối chiếu số tiền. Khi
            demo, bấm nút bên dưới để mô phỏng việc đã quét và xác nhận thanh
            toán.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {hetHan ? (
              <button type="button" className="btn-primary" onClick={taoMa}>
                Tạo mã mới
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                disabled={dangXacNhan || loading}
                onClick={xacNhan}
              >
                {dangXacNhan || loading
                  ? "Đang chờ ngân hàng xác nhận..."
                  : "Mô phỏng: tôi đã quét và thanh toán"}
              </button>
            )}
            <button
              type="button"
              className="btn-outline"
              disabled={dangXacNhan || loading}
              onClick={() => setBuoc("chon")}
            >
              Đổi ví khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
