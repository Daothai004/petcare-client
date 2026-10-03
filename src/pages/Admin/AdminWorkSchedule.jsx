// trang Lịch làm việc của tôi (Nhân viên spa + Bác sĩ thú y)
import { useEffect, useState } from "react";
import {
  getMyWorkSchedule,
  createWorkSchedule,
  updateWorkSchedule,
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
  thuTrongTuan: 1,
  gioBatDau: "08:00",
  gioKetThuc: "17:00",
  ghiChu: "",
};

function AdminWorkSchedule() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getMyWorkSchedule()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(RONG);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = {
      thuTrongTuan: Number(form.thuTrongTuan),
      gioBatDau: `${form.gioBatDau}:00`,
      gioKetThuc: `${form.gioKetThuc}:00`,
      ghiChu: form.ghiChu,
    };

    try {
      if (editingId !== null) {
        await updateWorkSchedule(editingId, data);
      } else {
        await createWorkSchedule(data);
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu lịch làm việc thất bại.");
    }
  };

  const handleEdit = (l) => {
    setForm({
      thuTrongTuan: l.thuTrongTuan,
      gioBatDau: l.gioBatDau?.slice(0, 5) ?? "08:00",
      gioKetThuc: l.gioKetThuc?.slice(0, 5) ?? "17:00",
      ghiChu: l.ghiChu ?? "",
    });
    setEditingId(l.id);
    setError(null);
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
      <h1>Lịch làm việc của tôi</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
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
          placeholder="Ghi chú (không bắt buộc)"
          value={form.ghiChu}
          onChange={handleChange}
        />
        <button type="submit" className="btn-small">
          {editingId !== null ? "Lưu thay đổi" : "Thêm ca làm"}
        </button>
        {editingId !== null && (
          <button type="button" className="btn-small" onClick={resetForm}>
            Hủy sửa
          </button>
        )}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
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
              <td>{TEN_THU[l.thuTrongTuan]}</td>
              <td>{l.gioBatDau?.slice(0, 5)}</td>
              <td>{l.gioKetThuc?.slice(0, 5)}</td>
              <td>{l.ghiChu}</td>
              <td className="admin-table-actions">
                <button className="btn-small" onClick={() => handleEdit(l)}>
                  Sửa
                </button>
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
              <td colSpan="5">Chưa đăng ký ca làm việc nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminWorkSchedule;
