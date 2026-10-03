// trang quản lý lịch làm việc toàn bộ nhân sự (chỉ Admin)
import { useEffect, useState } from "react";
import {
  getAllWorkSchedules,
  getStaff,
  createWorkSchedule,
  deleteWorkSchedule,
} from "../../services/api";

const TEN_THU = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

const RONG = {
  nhanSuId: "",
  thuTrongTuan: 1,
  gioBatDau: "08:00",
  gioKetThuc: "17:00",
  ghiChu: "",
};

function AdminAllWorkSchedules() {
  const [list, setList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState(RONG);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAllWorkSchedules().then((res) => setList(res.data));
    getStaff().then((res) => setStaffList(res.data));
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

    if (!form.nhanSuId) {
      setError("Vui lòng chọn nhân sự.");
      return;
    }

    try {
      await createWorkSchedule({
        nhanSuId: Number(form.nhanSuId),
        thuTrongTuan: Number(form.thuTrongTuan),
        gioBatDau: `${form.gioBatDau}:00`,
        gioKetThuc: `${form.gioKetThuc}:00`,
        ghiChu: form.ghiChu,
      });
      setForm(RONG);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu lịch làm việc thất bại.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa ca làm việc này?")) return;
    try {
      await deleteWorkSchedule(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Xóa thất bại.");
    }
  };

  return (
    <div>
      <h1>Lịch làm việc nhân sự</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <select
          name="nhanSuId"
          value={form.nhanSuId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn nhân sự --</option>
          {staffList.map((n) => (
            <option key={n.id} value={n.id}>
              {n.hoTen} ({n.chucVu})
            </option>
          ))}
        </select>
        <select
          name="thuTrongTuan"
          value={form.thuTrongTuan}
          onChange={handleChange}
        >
          {Object.entries(TEN_THU).map(([so, ten]) => (
            <option key={so} value={so}>
              {ten}
            </option>
          ))}
        </select>
        <input
          name="gioBatDau"
          type="time"
          value={form.gioBatDau}
          onChange={handleChange}
          required
        />
        <input
          name="gioKetThuc"
          type="time"
          value={form.gioKetThuc}
          onChange={handleChange}
          required
        />
        <input
          name="ghiChu"
          placeholder="Ghi chú"
          value={form.ghiChu}
          onChange={handleChange}
        />
        <button type="submit" className="btn-small">
          Thêm ca làm
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nhân sự</th>
            <th>Thứ</th>
            <th>Giờ bắt đầu</th>
            <th>Giờ kết thúc</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((l) => (
            <tr key={l.id}>
              <td>{l.nhanSu?.hoTen}</td>
              <td>{TEN_THU[l.thuTrongTuan]}</td>
              <td>{l.gioBatDau?.slice(0, 5)}</td>
              <td>{l.gioKetThuc?.slice(0, 5)}</td>
              <td>{l.ghiChu}</td>
              <td className="admin-table-actions">
                <button
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(l.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan="6">Chưa có lịch làm việc nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAllWorkSchedules;
