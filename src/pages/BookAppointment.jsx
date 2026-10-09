// trang đặt lịch: chọn NHIỀU dịch vụ, mỗi dịch vụ một nhân sự
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getServices,
  getMyPets,
  getStaff,
  datNhieuDichVu,
} from "../services/api";

function BookAppointment() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);

  const [thuCungId, setThuCungId] = useState("");
  const [thoiGianBatDau, setThoiGianBatDau] = useState("");
  const [chon, setChon] = useState([]); // [{ dichVuId, nhanSuId }]

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    Promise.all([getServices(), getMyPets(), getStaff()])
      .then(([resServices, resPets, resStaff]) => {
        setServices(resServices.data);
        setPets(resPets.data);
        setStaff(resStaff.data);
      })
      .catch((err) => setError("Không tải được dữ liệu: " + err.message));
  }, [token]);

  const toggleDichVu = (dichVuId) => {
    if (chon.some((c) => c.dichVuId === dichVuId)) {
      setChon(chon.filter((c) => c.dichVuId !== dichVuId));
    } else {
      setChon([...chon, { dichVuId, nhanSuId: "" }]);
    }
  };

  const doiNhanSu = (dichVuId, nhanSuId) => {
    setChon(
      chon.map((c) => (c.dichVuId === dichVuId ? { ...c, nhanSuId } : c)),
    );
  };

  // Lịch dự kiến: các dịch vụ nối tiếp nhau từ giờ bắt đầu
  const lichDuKien = [];
  let moc = thoiGianBatDau ? new Date(thoiGianBatDau) : null;
  chon.forEach((c) => {
    const dv = services.find((s) => s.id === c.dichVuId);
    if (!dv) return;
    const ns = staff.find((n) => String(n.id) === String(c.nhanSuId));
    lichDuKien.push({
      ten: dv.tenDichVu,
      gia: dv.gia,
      nhanSu: ns?.hoTen,
      gio: moc ? new Date(moc) : null,
    });
    if (moc) moc = new Date(moc.getTime() + dv.thoiLuongPhut * 60000);
  });
  const tamTinh = lichDuKien.reduce((s, l) => s + Number(l.gia), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (chon.length === 0) {
      setError("Vui lòng chọn ít nhất 1 dịch vụ.");
      return;
    }
    if (chon.some((c) => !c.nhanSuId)) {
      setError("Vui lòng chọn nhân sự cho từng dịch vụ.");
      return;
    }

    try {
      await datNhieuDichVu({
        thuCungId: Number(thuCungId),
        thoiGianBatDau,
        ghiChu: "",
        dichVus: chon.map((c) => ({
          dichVuId: c.dichVuId,
          nhanSuId: Number(c.nhanSuId),
        })),
      });
      setSuccess(true);
      setTimeout(() => navigate("/lich-hen-cua-toi"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt lịch thất bại, vui lòng thử lại.",
      );
    }
  };

  // ===== Trường hợp CHƯA đăng nhập =====
  if (!token) {
    return (
      <div className="page page-split">
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
        <img
          className="page-split-image"
          src="/img/dat-lich.jpg"
          alt="PetCare"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>
    );
  }

  return (
    <div className="page page-split">
      <h1>Đặt lịch hẹn</h1>
      <div className="form-card" style={{ maxWidth: 560 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Đặt lịch thành công! Đang chuyển sang Lịch hẹn của tôi...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="thuCungId">Thú cưng</label>
            <select
              id="thuCungId"
              value={thuCungId}
              onChange={(e) => setThuCungId(e.target.value)}
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
            <label htmlFor="thoiGianBatDau">Thời gian bắt đầu</label>
            <input
              id="thoiGianBatDau"
              type="datetime-local"
              value={thoiGianBatDau}
              onChange={(e) => setThoiGianBatDau(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Chọn dịch vụ (có thể chọn nhiều)</label>
            {services.map((s) => {
              const daChon = chon.find((c) => c.dichVuId === s.id);
              return (
                <div key={s.id} className="book-service">
                  <label className="book-service-head">
                    <input
                      type="checkbox"
                      checked={!!daChon}
                      onChange={() => toggleDichVu(s.id)}
                    />
                    <span className="book-service-name">{s.tenDichVu}</span>
                    <span className="book-service-meta">
                      {s.thoiLuongPhut} phút ·{" "}
                      {Number(s.gia).toLocaleString("vi-VN")} đ
                    </span>
                  </label>
                  {daChon && (
                    <div className="form-field">
                      <select
                        value={daChon.nhanSuId}
                        onChange={(e) => doiNhanSu(s.id, e.target.value)}
                        required
                      >
                        <option value="">-- Chọn nhân sự thực hiện --</option>
                        {staff.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.hoTen} ({n.chucVu})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {lichDuKien.length > 0 && (
            <div className="book-summary">
              <strong>Lịch dự kiến (thực hiện lần lượt):</strong>
              <ol style={{ margin: "8px 0", paddingLeft: 20 }}>
                {lichDuKien.map((l, i) => (
                  <li key={i}>
                    {l.gio
                      ? l.gio.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}{" "}
                    · {l.ten}
                    {l.nhanSu ? ` (${l.nhanSu})` : ""}
                  </li>
                ))}
              </ol>
              <strong>Tạm tính: {tamTinh.toLocaleString("vi-VN")} đ</strong>
            </div>
          )}

          <button type="submit" className="btn-primary">
            Xác nhận đặt lịch
          </button>
        </form>
      </div>
      <img
        className="page-split-image"
        src="/img/dat-lich.jpg"
        alt="PetCare"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
}

export default BookAppointment;
