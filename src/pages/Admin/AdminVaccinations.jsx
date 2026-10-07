// trang quản lý tiêm phòng (chỉ Bác sĩ + Admin)
import { useEffect, useState } from "react";
import {
  getPets,
  getSupplies,
  getVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} from "../../services/api";

const RONG = {
  loaiVaccine: "",
  muiSo: 1,
  ngayTiem: "",
  ngayTiemNhacLai: "",
  ghiChu: "",
};

function AdminVaccinations() {
  const [pets, setPets] = useState([]);
  const [thuCungId, setThuCungId] = useState("");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [vacXins, setVacXins] = useState([]);

  useEffect(() => {
    getPets().then((res) => setPets(res.data));
    getSupplies("VacXin")
      .then((res) => setVacXins(res.data))
      .catch(() => {});
  }, []);

  const loadRecords = (id) => {
    getVaccinations(id).then((res) => setRecords(res.data));
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
      muiSo: Number(form.muiSo) || 1,
      ngayTiemNhacLai: form.ngayTiemNhacLai || null,
    };

    try {
      if (editingId) {
        await updateVaccination(editingId, { ...data, id: editingId });
      } else {
        await createVaccination(data);
      }
      resetForm();
      loadRecords(thuCungId);
    } catch (err) {
      setError(err.response?.data?.message || "Lưu mũi tiêm thất bại.");
    }
  };

  const handleEdit = (r) => {
    setForm({
      loaiVaccine: r.loaiVaccine,
      muiSo: r.muiSo,
      ngayTiem: r.ngayTiem?.slice(0, 16) ?? "",
      ngayTiemNhacLai: r.ngayTiemNhacLai ? r.ngayTiemNhacLai.slice(0, 10) : "",
      ghiChu: r.ghiChu ?? "",
    });
    setEditingId(r.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa mũi tiêm này?")) return;
    await deleteVaccination(id);
    loadRecords(thuCungId);
  };

  return (
    <div>
      <h1>Tiêm phòng</h1>

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
              name="loaiVaccine"
              list="ds-vacxin"
              placeholder="Loại vắc-xin (VD: Vaccine dại)"
              value={form.loaiVaccine}
              onChange={handleChange}
              required
            />
            <datalist id="ds-vacxin">
              {vacXins.map((v) => (
                <option key={v.id} value={v.tenVatTu} />
              ))}
            </datalist>
            <input
              name="muiSo"
              type="number"
              min="1"
              placeholder="Mũi số"
              value={form.muiSo}
              onChange={handleChange}
              style={{ width: 90 }}
              required
            />
            <input
              name="ngayTiem"
              type="datetime-local"
              value={form.ngayTiem}
              onChange={handleChange}
              required
            />
            <label style={{ fontSize: 13 }}>
              Ngày tiêm nhắc lại:
              <input
                name="ngayTiemNhacLai"
                type="date"
                value={form.ngayTiemNhacLai}
                onChange={handleChange}
                style={{ marginLeft: 6 }}
              />
            </label>
            <input
              name="ghiChu"
              placeholder="Ghi chú"
              value={form.ghiChu}
              onChange={handleChange}
            />
            <button type="submit" className="btn-small">
              {editingId ? "Lưu thay đổi" : "Thêm mũi tiêm"}
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
                <th>Ngày tiêm</th>
                <th>Loại vắc-xin</th>
                <th>Mũi số</th>
                <th>Tiêm nhắc lại</th>
                <th>Bác sĩ</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.ngayTiem).toLocaleString("vi-VN")}</td>
                  <td>{r.loaiVaccine}</td>
                  <td>{r.muiSo}</td>
                  <td>
                    {r.ngayTiemNhacLai
                      ? new Date(r.ngayTiemNhacLai).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
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
                  <td colSpan="7">Chưa có mũi tiêm nào cho thú cưng này.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminVaccinations;
