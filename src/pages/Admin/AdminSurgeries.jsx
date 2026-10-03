// trang quản lý phẫu thuật (chỉ Bác sĩ + Admin)
import { useEffect, useState } from "react";
import {
  getPets,
  getSurgeries,
  createSurgery,
  updateSurgery,
  deleteSurgery,
} from "../../services/api";

const RONG = {
  tenCaPhauThuat: "",
  phuongPhapThucHien: "",
  ketQua: "",
  ngayPhauThuat: "",
  ghiChu: "",
};

function AdminSurgeries() {
  const [pets, setPets] = useState([]);
  const [thuCungId, setThuCungId] = useState("");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPets().then((res) => setPets(res.data));
  }, []);

  const loadRecords = (id) => {
    getSurgeries(id).then((res) => setRecords(res.data));
  };

  useEffect(() => {
    if (!thuCungId) {
      setRecords([]);
      return;
    }
    loadRecords(thuCungId);
  }, [thuCungId]);

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
      ...form,
      thuCungId: Number(thuCungId),
    };

    try {
      if (editingId) {
        await updateSurgery(editingId, { ...data, id: editingId });
      } else {
        await createSurgery(data);
      }
      resetForm();
      loadRecords(thuCungId);
    } catch (err) {
      setError(err.response?.data?.message || "Lưu ca phẫu thuật thất bại.");
    }
  };

  const handleEdit = (r) => {
    setForm({
      tenCaPhauThuat: r.tenCaPhauThuat,
      phuongPhapThucHien: r.phuongPhapThucHien ?? "",
      ketQua: r.ketQua ?? "",
      ngayPhauThuat: r.ngayPhauThuat?.slice(0, 16) ?? "",
      ghiChu: r.ghiChu ?? "",
    });
    setEditingId(r.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa ca phẫu thuật này?")) return;
    await deleteSurgery(id);
    loadRecords(thuCungId);
  };

  return (
    <div>
      <h1>Phẫu thuật</h1>

      <div className="form-field" style={{ maxWidth: 320, marginBottom: 24 }}>
        <label htmlFor="thuCung">Chọn thú cưng</label>
        <select
          id="thuCung"
          value={thuCungId}
          onChange={(e) => {
            setThuCungId(e.target.value);
            resetForm();
          }}
        >
          <option value="">-- Chọn thú cưng --</option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.tenThuCung} ({p.loai})
              {p.tenChuNuoi ? ` - chủ: ${p.tenChuNuoi}` : ""}
            </option>
          ))}
        </select>
      </div>

      {thuCungId && (
        <>
          {error && <div className="alert alert-error">{error}</div>}

          <form
            onSubmit={handleSubmit}
            className="admin-inline-form"
            style={{ marginBottom: 24 }}
          >
            <input
              name="tenCaPhauThuat"
              placeholder="Tên ca phẫu thuật (VD: Triệt sản)"
              value={form.tenCaPhauThuat}
              onChange={handleChange}
              required
            />
            <input
              name="phuongPhapThucHien"
              placeholder="Phương pháp thực hiện"
              value={form.phuongPhapThucHien}
              onChange={handleChange}
            />
            <input
              name="ketQua"
              placeholder="Kết quả (VD: Thành công)"
              value={form.ketQua}
              onChange={handleChange}
            />
            <input
              name="ngayPhauThuat"
              type="datetime-local"
              value={form.ngayPhauThuat}
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
              {editingId ? "Lưu thay đổi" : "Thêm ca phẫu thuật"}
            </button>
            {editingId && (
              <button type="button" className="btn-small" onClick={resetForm}>
                Hủy sửa
              </button>
            )}
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Ngày phẫu thuật</th>
                <th>Tên ca</th>
                <th>Phương pháp</th>
                <th>Kết quả</th>
                <th>Bác sĩ</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.ngayPhauThuat).toLocaleString("vi-VN")}</td>
                  <td>{r.tenCaPhauThuat}</td>
                  <td>{r.phuongPhapThucHien}</td>
                  <td>{r.ketQua}</td>
                  <td>{r.bacSi?.hoTen}</td>
                  <td>{r.ghiChu}</td>
                  <td className="admin-table-actions">
                    <button className="btn-small" onClick={() => handleEdit(r)}>
                      Sửa
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(r.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="7">
                    Chưa có ca phẫu thuật nào cho thú cưng này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminSurgeries;
