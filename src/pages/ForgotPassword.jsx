// Trang quên mật khẩu (dành cho khách hàng)
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthSplit from "../components/AuthSplit";
import { forgotPassword } from "../services/api";

function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    soDienThoai: "",
    matKhauMoi: "",
    xacNhan: "",
  });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (form.matKhauMoi !== form.xacNhan) {
      setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    try {
      const res = await forgotPassword({
        email: form.email,
        soDienThoai: form.soDienThoai,
        matKhauMoi: form.matKhauMoi,
      });
      setMsg({ type: "success", text: res.data.message });
      setForm({ email: "", soDienThoai: "", matKhauMoi: "", xacNhan: "" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Đặt lại mật khẩu thất bại.",
      });
    }
  };

  return (
    <AuthSplit
      anh="/img/th.jpg"
      tieuDe="Quên mật khẩu"
      moTa="Nhập email và số điện thoại bạn đã đăng ký để đặt mật khẩu mới."
      chanTrang={
        <>
          Nhớ mật khẩu rồi? <Link to="/dang-nhap">Đăng nhập</Link>
        </>
      }
    >
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit}>
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
        <div className="form-field">
          <label>Số điện thoại đã đăng ký</label>
          <input
            name="soDienThoai"
            value={form.soDienThoai}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Mật khẩu mới (ít nhất 6 ký tự)</label>
          <input
            name="matKhauMoi"
            type="password"
            value={form.matKhauMoi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Nhập lại mật khẩu mới</label>
          <input
            name="xacNhan"
            type="password"
            value={form.xacNhan}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Đặt lại mật khẩu
        </button>
      </form>
    </AuthSplit>
  );
}

export default ForgotPassword;
