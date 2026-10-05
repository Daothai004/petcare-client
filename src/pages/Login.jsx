// trang đăng nhập
import { useState } from "react";
import { loginUser } from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", matKhau: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("vaiTro", res.data.vaiTro);
      localStorage.setItem("hoTen", res.data.hoTen);

      // Navbar nằm ngoài <Routes> nên chỉ đọc localStorage đúng 1 lần lúc mount.
      // Dùng window.location thay cho navigate() để trang tải lại, Navbar mới
      // đọc được token/hoTen vừa lưu và hiển thị đúng trạng thái đã đăng nhập.
      if (res.data.vaiTro === "KhachHang") {
        window.location.href = "/";
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

  return (
    <div className="page page-split">
      <h1>Đăng nhập</h1>
      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="matKhau">Mật khẩu</label>
            <input
              id="matKhau"
              name="matKhau"
              type="password"
              value={form.matKhau}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>
        </form>
        {/* Chưa làm chức năng gửi email đặt lại mật khẩu thật, nên tạm thời
            chỉ hiện hướng dẫn liên hệ - vẫn cần có vì người dùng quên mật khẩu
            là tình huống rất thường gặp, để trống hẳn sẽ gây khó chịu. */}
        <p className="form-helper-link">
          <a href="/quen-mat-khau">Quên mật khẩu?</a>
        </p>
      </div>
      <img
        className="page-split-image"
        src="/img/dangnhap.jpg"
        alt="PetCare"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
}

export default Login;
