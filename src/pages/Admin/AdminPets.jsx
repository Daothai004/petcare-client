// trang quản lý thú cưng cho admin
import { useEffect, useState } from "react";
import { getAdminPets, updatePet, deletePet } from "../../services/api";

const RONG = { tenThuCung: "", loai: "", giong: "", canNang: "" };

function AdminPets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAdminPets()
      .then((res) => setPets(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
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
    try {
      const data = { ...form, canNang: Number(form.canNang) };
      await updatePet(editingId, { ...data, id: editingId });
      setForm(RONG);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật thất bại.");
    }
  };

  const handleEdit = (pet) => {
    setForm(pet);
    setEditingId(pet.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa hồ sơ thú cưng này? Hành động này không thể hoàn tác."))
      return;
    await deletePet(id);
    loadData();
  };

  return (
    <div>
      <h1>Quản lý thú cưng</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {editingId && (
        <form
          onSubmit={handleSubmit}
          className="admin-inline-form"
          style={{ marginBottom: 20 }}
        >
          <input
            name="tenThuCung"
            placeholder="Tên thú cưng"
            value={form.tenThuCung}
            onChange={handleChange}
            required
          />
          <input
            name="loai"
            placeholder="Loài"
            value={form.loai}
            onChange={handleChange}
            required
          />
          <input
            name="giong"
            placeholder="Giống"
            value={form.giong}
            onChange={handleChange}
          />
          <input
            name="canNang"
            type="number"
            step="0.1"
            placeholder="Cân nặng (kg)"
            value={form.canNang}
            onChange={handleChange}
          />
          <button type="submit" className="btn-small">
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="btn-small"
            onClick={() => {
              setForm(RONG);
              setEditingId(null);
            }}
          >
            Hủy sửa
          </button>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên thú cưng</th>
              <th>Loài</th>
              <th>Giống</th>
              <th>Cân nặng</th>
              <th>Chủ nuôi</th>
              <th>Email chủ nuôi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((p) => (
              <tr key={p.id}>
                <td>{p.tenThuCung}</td>
                <td>{p.loai}</td>
                <td>{p.giong}</td>
                <td>{p.canNang} kg</td>
                <td>{p.tenChuNuoi}</td>
                <td>{p.emailChuNuoi}</td>
                <td className="admin-table-actions">
                  <button className="btn-small" onClick={() => handleEdit(p)}>
                    Sửa
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {pets.length === 0 && (
              <tr>
                <td colSpan="7">Chưa có thú cưng nào trong hệ thống.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPets;
