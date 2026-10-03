// trang quản lý dịch vụ
import { useEffect, useState } from "react";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../../services/api";

const RONG = {
  tenDichVu: "",
  moTa: "",
  gia: "",
  thoiLuongPhut: "",
  dangHoatDong: true,
};

function AdminServices() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAllServices()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {
        ...form,
        gia: Number(form.gia),
        thoiLuongPhut: Number(form.thoiLuongPhut),
      };

      if (editingId) {
        await updateService(editingId, { ...data, id: editingId });
      } else {
        await createService(data);
      }

      setForm(RONG);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Thao tác thất bại.");
    }
  };

  const handleEdit = (dichVu) => {
    setForm(dichVu);
    setEditingId(dichVu.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa dịch vụ này?")) return;
    try {
      await deleteService(id);
      loadData();
    } catch (err) {
      // Dịch vụ đã từng được đặt lịch sẽ không xóa cứng được (vướng khóa ngoại),
      // trường hợp đó nên dùng nút "Ẩn" bên cạnh thay vì xóa.
      setError(
        err.response?.data?.message ||
          "Không xóa được dịch vụ này (có thể đã có lịch hẹn liên quan). Bạn hãy dùng nút Ẩn.",
      );
    }
  };

  // Bật / tắt trạng thái cung cấp của dịch vụ mà không cần xóa dữ liệu
  const handleToggleActive = async (dichVu) => {
    setError(null);
    try {
      await updateService(dichVu.id, {
        ...dichVu,
        dangHoatDong: !dichVu.dangHoatDong,
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Đổi trạng thái thất bại.");
    }
  };

  return (
    <div>
      <h1>Quản lý dịch vụ</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <input
          name="tenDichVu"
          placeholder="Tên dịch vụ"
          value={form.tenDichVu}
          onChange={handleChange}
          required
        />
        <input
          name="moTa"
          placeholder="Mô tả"
          value={form.moTa}
          onChange={handleChange}
        />
        <input
          name="gia"
          type="number"
          placeholder="Giá (đ)"
          value={form.gia}
          onChange={handleChange}
          required
        />
        <input
          name="thoiLuongPhut"
          type="number"
          placeholder="Phút"
          value={form.thoiLuongPhut}
          onChange={handleChange}
          required
        />
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
              <th>Tên dịch vụ</th>
              <th>Giá</th>
              <th>Thời lượng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.tenDichVu}</td>
                <td>{Number(s.gia).toLocaleString("vi-VN")} đ</td>
                <td>{s.thoiLuongPhut} phút</td>
                <td>
                  {s.dangHoatDong ? (
                    "Đang cung cấp"
                  ) : (
                    <span style={{ color: "var(--color-ink-soft)" }}>
                      Đã ẩn
                    </span>
                  )}
                </td>
                <td className="admin-table-actions">
                  <button className="btn-small" onClick={() => handleEdit(s)}>
                    Sửa
                  </button>
                  <button
                    className="btn-small"
                    onClick={() => handleToggleActive(s)}
                  >
                    {s.dangHoatDong ? "Ẩn" : "Bật lại"}
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(s.id)}
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

export default AdminServices;
