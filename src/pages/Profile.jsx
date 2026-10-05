// Trang hồ sơ cá nhân
import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../services/api";

const TEN_VAI_TRO = {
  KhachHang: "Khách hàng",
  NhanVien: "Nhân viên",
  BacSiThuY: "Bác sĩ thú y",
  QuanTriVien: "Quản trị viên",
};

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ hoTen: "", soDienThoai: "", diaChi: "" });
  const [pw, setPw] = useState({ matKhauCu: "", matKhauMoi: "", xacNhan: "" });
  const [msg, setMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          hoTen: res.data.hoTen,
          soDienThoai: res.data.soDienThoai || "",
          diaChi: res.data.diaChi || "",
        });
      })
      .catch((err) =>
        setMsg({
          type: "error",
          text: err.response?.data?.message || "Không tải được hồ sơ.",
        }),
      );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = (e) =>
    setPw({ ...pw, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await updateProfile(form);
      localStorage.setItem("hoTen", res.data.hoTen);
      setProfile({ ...profile, ...res.data });
      setMsg({ type: "success", text: "Đã lưu thông tin." });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Lưu thất bại.",
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.matKhauMoi !== pw.xacNhan) {
      setPwMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    try {
      await changePassword({
        matKhauCu: pw.matKhauCu,
        matKhauMoi: pw.matKhauMoi,
      });
      setPw({ matKhauCu: "", matKhauMoi: "", xacNhan: "" });
      setPwMsg({ type: "success", text: "Đổi mật khẩu thành công." });
    } catch (err) {
      setPwMsg({
        type: "error",
        text: err.response?.data?.message || "Đổi mật khẩu thất bại.",
      });
    }
  };

  if (!profile) {
    return (
      <div className="page">
        <h1>Hồ sơ của tôi</h1>
        {msg ? (
          <div className={`alert alert-${msg.type}`}>{msg.text}</div>
        ) : (
          <p>Đang tải...</p>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Hồ sơ của tôi</h1>

      <div className="profile-header">
        <div className="profile-avatar">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
          </svg>
        </div>
        <div>
          <h2>{profile.hoTen}</h2>
          <p className="profile-meta">{profile.email}</p>
          <p className="profile-meta">
            Thành viên từ{" "}
            {new Date(profile.ngayTao).toLocaleDateString("vi-VN")}
          </p>
          <span className="profile-badge">
            {TEN_VAI_TRO[profile.vaiTro] || profile.vaiTro}
          </span>
        </div>
      </div>

      {profile.vaiTro === "KhachHang" && (
        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{profile.soThuCung}</strong>
            <span>Thú cưng</span>
          </div>
          <div className="profile-stat">
            <strong>{profile.soLichHen}</strong>
            <span>Lịch hẹn</span>
          </div>
          <div className="profile-stat">
            <strong>{profile.soDonHang}</strong>
            <span>Đơn hàng</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="form-card"
        style={{ maxWidth: "none", margin: "0 0 20px" }}
      >
        <h3>Thông tin cá nhân</h3>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <div className="form-field">
          <label>Email (không thể thay đổi)</label>
          <input value={profile.email} disabled />
        </div>
        <div className="form-field">
          <label>Họ và tên</label>
          <input
            name="hoTen"
            value={form.hoTen}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Số điện thoại</label>
          <input
            name="soDienThoai"
            value={form.soDienThoai}
            onChange={handleChange}
            placeholder="0912345678"
          />
        </div>
        <div className="form-field">
          <label>Địa chỉ</label>
          <input
            name="diaChi"
            value={form.diaChi}
            onChange={handleChange}
            placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
          />
        </div>
        <button type="submit" className="btn-primary">
          Lưu thay đổi
        </button>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="form-card"
        style={{ maxWidth: "none", margin: "0 0 20px" }}
      >
        <h3>Đổi mật khẩu</h3>
        {pwMsg && (
          <div className={`alert alert-${pwMsg.type}`}>{pwMsg.text}</div>
        )}
        <div className="form-field">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            name="matKhauCu"
            value={pw.matKhauCu}
            onChange={handlePwChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Mật khẩu mới (ít nhất 6 ký tự)</label>
          <input
            type="password"
            name="matKhauMoi"
            value={pw.matKhauMoi}
            onChange={handlePwChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            name="xacNhan"
            value={pw.xacNhan}
            onChange={handlePwChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}

export default Profile;
