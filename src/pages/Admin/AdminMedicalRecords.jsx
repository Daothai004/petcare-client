// trang quản lý của bác sĩ
import { useEffect, useState } from "react";
import {
  getPets,
  getMedicalRecords,
  createMedicalRecord,
} from "../../services/api";

const RONG = { chanDoan: "", thuocKeDon: "", ghiChu: "" };

function AdminMedicalRecords() {
  const [pets, setPets] = useState([]);
  const [thuCungId, setThuCungId] = useState("");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(RONG);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPets().then((res) => setPets(res.data));
  }, []);

  useEffect(() => {
    if (!thuCungId) {
      setRecords([]);
      return;
    }
    getMedicalRecords(thuCungId).then((res) => setRecords(res.data));
  }, [thuCungId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createMedicalRecord({ ...form, thuCungId: Number(thuCungId) });
      setForm(RONG);
      const res = await getMedicalRecords(thuCungId);
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Lưu bệnh án thất bại.");
    }
  };

  return (
    <div>
      <h1>Bệnh án thú cưng</h1>

      <div className="form-field" style={{ maxWidth: 320, marginBottom: 24 }}>
        <label htmlFor="thuCung">Chọn thú cưng</label>
        <select
          id="thuCung"
          value={thuCungId}
          onChange={(e) => setThuCungId(e.target.value)}
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
              name="chanDoan"
              placeholder="Chẩn đoán"
              value={form.chanDoan}
              onChange={handleChange}
              required
            />
            <input
              name="thuocKeDon"
              placeholder="Thuốc kê đơn"
              value={form.thuocKeDon}
              onChange={handleChange}
            />
            <input
              name="ghiChu"
              placeholder="Ghi chú"
              value={form.ghiChu}
              onChange={handleChange}
            />
            <button type="submit" className="btn-small">
              Thêm bệnh án
            </button>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Ngày khám</th>
                <th>Chẩn đoán</th>
                <th>Thuốc kê đơn</th>
                <th>Bác sĩ</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.ngayKham).toLocaleString("vi-VN")}</td>
                  <td>{r.chanDoan}</td>
                  <td>{r.thuocKeDon}</td>
                  <td>{r.bacSi?.hoTen}</td>
                  <td>{r.ghiChu}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="5">Chưa có bệnh án nào cho thú cưng này.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminMedicalRecords;
