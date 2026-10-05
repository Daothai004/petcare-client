// Trang hồ sơ cá nhân
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

const TEN_VAI_TRO = {
  KhachHang: "Khách hàng",
  NhanVien: "Nhân viên",
  BacSiThuY: "Bác sĩ thú y",
  QuanTriVien: "Quản trị viên",
};

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
    matKhau: "",
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          hoTen: res.data.hoTen,
          email: res.data.email,
          soDienThoai: res.data.soDienThoai || "",
          diaChi: res.data.diaChi || "",
          matKhau: "",
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

  // Chỉ hiện ô nhập mật khẩu khi khách đang sửa email
  const doiEmail =
    profile && form.email.trim().toLowerCase() !== profile.email.toLowerCase();

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await updateProfile(form);
      localStorage.setItem("hoTen", res.data.hoTen);
      setProfile({ ...profile, ...res.data });
      setForm({ ...form, email: res.data.email, matKhau: "" });
      setMsg({ type: "success", text: "Đã lưu thông tin." });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Lưu thất bại.",
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
          <label>Họ và tên</label>
          <input
            name="hoTen"
            value={form.hoTen}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        {doiEmail && (
          <div className="form-field">
            <label>Nhập mật khẩu hiện tại để xác nhận đổi email</label>
            <input
              name="matKhau"
              type="password"
              value={form.matKhau}
              onChange={handleChange}
              required
            />
          </div>
        )}
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
    </div>
  );
}

export default Profile;
