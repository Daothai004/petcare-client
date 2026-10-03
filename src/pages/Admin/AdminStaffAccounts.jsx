// trang tạo tài khoản nhân viên/ admin
import { useState } from "react";
import { registerStaff } from "../../services/api";

const RONG = {
  hoTen: "",
  email: "",
  soDienThoai: "",
  matKhau: "",
  vaiTro: "NhanVien",
};

function AdminStaffAccounts() {
  const [form, setForm] = useState(RONG);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await registerStaff(form);
      setSuccess(
        `Đã tạo tài khoản cho ${res.data.hoTen} (${res.data.vaiTro}) thành công.`,
      );
      setForm(RONG);
    } catch (err) {
      setError(err.response?.data?.message || "Tạo tài khoản thất bại.");
    }
  };

  return (
    <div>
      <h1>Tạo tài khoản Nhân viên / Admin</h1>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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
            <label htmlFor="matKhau">Mật khẩu tạm thời</label>
            <input
              id="matKhau"
              name="matKhau"
              type="password"
              value={form.matKhau}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="vaiTro">Vai trò</label>
            <select
              id="vaiTro"
              name="vaiTro"
              value={form.vaiTro}
              onChange={handleChange}
            >
              <option value="NhanVien">Nhân viên spa</option>
              <option value="BacSiThuY">Bác sĩ thú y</option>
              <option value="QuanTriVien">Quản trị viên (Admin)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminStaffAccounts;
