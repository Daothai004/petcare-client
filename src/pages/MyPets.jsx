// trang quản lý thú cưng
import { useEffect, useState } from "react";
import { getMyPets, createPet, updatePet, deletePet } from "../services/api";

const RONG = { tenThuCung: "", loai: "", giong: "", canNang: "" };

function MyPets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getMyPets()
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
      if (editingId) {
        await updatePet(editingId, { ...data, id: editingId });
      } else {
        await createPet(data);
      }
      setForm(RONG);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Thao tác thất bại.");
    }
  };

  const handleEdit = (pet) => {
    setForm(pet);
    setEditingId(pet.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa hồ sơ thú cưng này?")) return;
    await deletePet(id);
    loadData();
  };

  return (
    <div className="page">
      <h1>Thú cưng của tôi</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="admin-inline-form"
        style={{ marginBottom: 24 }}
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
          placeholder="Loài (Chó/Mèo...)"
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
          {editingId ? "Lưu thay đổi" : "Thêm thú cưng"}
        </button>
        {editingId && (
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
        )}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Loài</th>
            <th>Giống</th>
            <th>Cân nặng</th>
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
              <td colSpan="5">
                Bạn chưa có thú cưng nào, thêm mới ở form phía trên.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyPets;
