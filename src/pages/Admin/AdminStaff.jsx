// trang quản lý nhân sự
import { useEffect, useState } from "react";
import {
  getStaff,
  getStaffAccounts,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from "../../services/api";

const RONG = {
  hoTen: "",
  chucVu: "",
  soDienThoai: "",
  trinhDo: "",
  kinhNghiem: "",
  gioiThieu: "",
  nguoiDungId: "",
};

// VaiTro của tài khoản: 1 = Nhân viên, 2 = Bác sĩ thú y
const TEN_VAI_TRO = { 1: "Nhân viên", 2: "Bác sĩ" };

function AdminStaff() {
  const [list, setList] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getStaff().then((res) => setList(res.data));
    getStaffAccounts().then((res) => setAccounts(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Ô chọn trả về chuỗi; rỗng nghĩa là "không liên kết" (null), còn lại đổi sang số
    const data = {
      ...form,
      nguoiDungId: form.nguoiDungId === "" ? null : Number(form.nguoiDungId),
    };

    try {
      if (editingId) {
        await updateStaffMember(editingId, { ...data, id: editingId });
      } else {
        await createStaffMember(data);
      }
      setForm(RONG);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu nhân sự thất bại.");
    }
  };

  const handleEdit = (nhanSu) => {
    setForm({ ...nhanSu, nguoiDungId: nhanSu.nguoiDungId ?? "" });
    setEditingId(nhanSu.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa nhân sự này?")) return;
    await deleteStaffMember(id);
    loadData();
  };

  const taiKhoanCuaNhanSu = (nguoiDungId) => {
    const tk = accounts.find((a) => a.id === nguoiDungId);
    return tk ? tk.email : "Chưa liên kết";
  };

  return (
    <div>
      <h1>Quản lý nhân sự</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <input
          name="hoTen"
          placeholder="Họ tên"
          value={form.hoTen}
          onChange={handleChange}
          required
        />
        <input
          name="chucVu"
          placeholder="Chức vụ (VD: Bác sĩ thú y)"
          value={form.chucVu}
          onChange={handleChange}
          required
        />
        <input
          name="soDienThoai"
          placeholder="Số điện thoại"
          value={form.soDienThoai}
          onChange={handleChange}
          required
        />
        <input
          name="trinhDo"
          placeholder="Trình độ (VD: Cử nhân Thú y)"
          value={form.trinhDo ?? ""}
          onChange={handleChange}
        />
        <input
          name="kinhNghiem"
          placeholder="Kinh nghiệm (VD: 5 năm)"
          value={form.kinhNghiem ?? ""}
          onChange={handleChange}
        />
        <input
          name="gioiThieu"
          placeholder="Giới thiệu ngắn"
          value={form.gioiThieu ?? ""}
          onChange={handleChange}
        />
        <select
          name="nguoiDungId"
          value={form.nguoiDungId}
          onChange={handleChange}
        >
          <option value="">-- Tài khoản đăng nhập (không bắt buộc) --</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.email} ({TEN_VAI_TRO[a.vaiTro]})
            </option>
          ))}
        </select>
        <button type="submit" className="btn-small">
          {editingId ? "Lưu thay đổi" : "Thêm mới"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn-small"
            onClick={() => {
              setForm(RONG);
              setEditingId(null);
              setError(null);
            }}
          >
            Hủy sửa
          </button>
        )}
      </form>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>SĐT</th>
              <th>Tài khoản đăng nhập</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((n) => (
              <tr key={n.id}>
                <td>{n.hoTen}</td>
                <td>{n.chucVu}</td>
                <td>{n.soDienThoai}</td>
                <td>{taiKhoanCuaNhanSu(n.nguoiDungId)}</td>
                <td className="admin-table-actions">
                  <button className="btn-small" onClick={() => handleEdit(n)}>
                    Sửa
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(n.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStaff;
