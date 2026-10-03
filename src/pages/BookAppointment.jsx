// trang đặt lịch
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getServices,
  getMyPets,
  getStaff,
  createAppointment,
} from "../services/api";

function BookAppointment() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);

  const [form, setForm] = useState({
    thuCungId: "",
    dichVuId: "",
    nhanSuId: "",
    thoiGianBatDau: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Chỉ gọi API cần đăng nhập khi ĐÃ CÓ token - tránh gọi rồi mới nhận lỗi 401
    if (!token) return;

    Promise.all([getServices(), getMyPets(), getStaff()])
      .then(([resServices, resPets, resStaff]) => {
        setServices(resServices.data);
        setPets(resPets.data);
        setStaff(resStaff.data);
      })
      .catch((err) => setError("Không tải được dữ liệu: " + err.message));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await createAppointment({
        thuCungId: Number(form.thuCungId),
        dichVuId: Number(form.dichVuId),
        nhanSuId: Number(form.nhanSuId),
        thoiGianBatDau: form.thoiGianBatDau,
        ghiChu: "",
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt lịch thất bại, vui lòng thử lại.",
      );
    }
  };

  // ===== Trường hợp CHƯA đăng nhập: hiện thông báo thân thiện, không gọi API =====
  if (!token) {
    return (
      <div className="page">
        <h1>Đặt lịch hẹn</h1>
        <div className="alert alert-error">
          Bạn cần đăng nhập để đặt lịch hẹn.{" "}
          <Link to="/dang-nhap" style={{ fontWeight: 600 }}>
            Đăng nhập ngay
          </Link>{" "}
          hoặc{" "}
          <Link to="/dang-ky" style={{ fontWeight: 600 }}>
            tạo tài khoản mới
          </Link>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Đặt lịch hẹn</h1>
      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Đặt lịch thành công! Đang chuyển về trang chủ...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="thuCungId">Thú cưng</label>
            <select
              id="thuCungId"
              name="thuCungId"
              value={form.thuCungId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn thú cưng --</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.tenThuCung}
                </option>
              ))}
            </select>
            {pets.length === 0 && (
              <small style={{ color: "var(--color-ink-soft)" }}>
                Bạn chưa có thú cưng nào —{" "}
                <Link to="/thu-cung-cua-toi">thêm thú cưng tại đây</Link> trước
                khi đặt lịch.
              </small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="dichVuId">Dịch vụ</label>
            <select
              id="dichVuId"
              name="dichVuId"
              value={form.dichVuId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn dịch vụ --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.tenDichVu} - {Number(s.gia).toLocaleString("vi-VN")} đ
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="nhanSuId">Nhân sự thực hiện</label>
            <select
              id="nhanSuId"
              name="nhanSuId"
              value={form.nhanSuId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn nhân sự --</option>
              {staff.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.hoTen} ({n.chucVu})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="thoiGianBatDau">Thời gian</label>
            <input
              id="thoiGianBatDau"
              name="thoiGianBatDau"
              type="datetime-local"
              value={form.thoiGianBatDau}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Xác nhận đặt lịch
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
