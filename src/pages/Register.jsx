// trang tạo tài khoản đăng ký
import { useState } from "react";
import { registerUser } from "../services/api";

function Register() {
  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    matKhau: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await registerUser(form);

      // Lưu đủ 3 thông tin giống hệt lúc đăng nhập, nếu không Navbar sẽ không
      // hiện tên người dùng và link "Thú cưng của tôi" sau khi đăng ký xong.
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("vaiTro", res.data.vaiTro);
      localStorage.setItem("hoTen", res.data.hoTen);

      // Navbar nằm ngoài <Routes> nên chỉ đọc localStorage đúng 1 lần lúc mount.
      // Nếu chỉ navigate thì Navbar vẫn hiển thị trạng thái "chưa đăng nhập"
      // cho tới khi người dùng tự F5, nên ở đây tải lại trang cho chắc chắn.
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.",
      );
    }
  };

  return (
    <div className="page">
      <h1>Đăng ký tài khoản</h1>
      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="hoTen">Họ tên</label>
            <input
              id="hoTen"
              name="hoTen"
              value={form.hoTen}
              onChange={handleChange}
              required
            />
          </div>
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
            <label htmlFor="soDienThoai">Số điện thoại</label>
            <input
              id="soDienThoai"
              name="soDienThoai"
              value={form.soDienThoai}
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
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
