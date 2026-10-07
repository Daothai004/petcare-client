// Kho thuốc, vắc-xin, dụng cụ y tế (Bác sĩ + Admin)
import { useEffect, useState } from "react";
import {
  getSupplies,
  createSupply,
  updateSupply,
  deleteSupply,
} from "../../services/api";

const LOAI = { Thuoc: "Thuốc", VacXin: "Vắc-xin", DungCu: "Dụng cụ y tế" };

const RONG = {
  loai: "Thuoc",
  tenVatTu: "",
  donVi: "",
  soLuongTon: 0,
  mucCanhBao: 10,
  hanSuDung: "",
  ghiChu: "",
};

// Tính trạng thái hiển thị của 1 mục trong kho
function trangThai(v) {
  if (v.soLuongTon <= 0) return { text: "Hết hàng", cls: "stock-out" };
  if (v.hanSuDung) {
    const ngayCon = Math.ceil(
      (new Date(v.hanSuDung) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (ngayCon < 0) return { text: "Hết hạn", cls: "stock-out" };
    if (ngayCon <= 30)
      return { text: `Sắp hết hạn (${ngayCon} ngày)`, cls: "stock-low" };
  }
  if (v.soLuongTon <= v.mucCanhBao)
    return { text: "Sắp hết", cls: "stock-low" };
  return { text: "Còn hàng", cls: "stock-ok" };
}

function AdminSupplies() {
  const [list, setList] = useState([]);
  const [tab, setTab] = useState("tatca");
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getSupplies()
      .then((res) => setList(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Không tải được dữ liệu kho."),
      );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      soLuongTon: Number(form.soLuongTon) || 0,
      mucCanhBao: Number(form.mucCanhBao) || 0,
      hanSuDung: form.hanSuDung || null,
      ghiChu: form.ghiChu || null,
    };

    try {
      if (editingId) {
        await updateSupply(editingId, { ...data, id: editingId });
      } else {
        await createSupply(data);
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu thất bại.");
    }
  };

  const handleEdit = (v) => {
    setForm({
      loai: v.loai,
      tenVatTu: v.tenVatTu,
      donVi: v.donVi,
      soLuongTon: v.soLuongTon,
      mucCanhBao: v.mucCanhBao,
      hanSuDung: v.hanSuDung ? v.hanSuDung.slice(0, 10) : "",
      ghiChu: v.ghiChu ?? "",
    });
    setEditingId(v.id);
    setError(null);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa mục này khỏi kho?")) return;
    await deleteSupply(id);
    loadData();
  };

  const hienThi = tab === "tatca" ? list : list.filter((v) => v.loai === tab);
  const canChuY = list.filter((v) => trangThai(v).cls !== "stock-ok").length;

  return (
    <div>
      <h1>Kho thuốc &amp; vật tư y tế</h1>
      {canChuY > 0 && (
        <div className="alert alert-error">
          Có {canChuY} mục cần chú ý (sắp hết, hết hàng hoặc sắp hết hạn).
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="admin-inline-form"
        style={{ marginBottom: 24 }}
      >
        <select name="loai" value={form.loai} onChange={handleChange}>
          {Object.keys(LOAI).map((k) => (
            <option key={k} value={k}>
              {LOAI[k]}
            </option>
          ))}
        </select>
        <input
          name="tenVatTu"
          placeholder="Tên (VD: Vắc-xin dại)"
          value={form.tenVatTu}
          onChange={handleChange}
          required
        />
        <input
          name="donVi"
          placeholder="Đơn vị (liều, viên, cái...)"
          value={form.donVi}
          onChange={handleChange}
          required
        />
        <label style={{ fontSize: "0.85rem", alignSelf: "center" }}>
          Tồn kho:
        </label>
        <input
          name="soLuongTon"
          type="number"
          min="0"
          value={form.soLuongTon}
          onChange={handleChange}
        />
        <label style={{ fontSize: "0.85rem", alignSelf: "center" }}>
          Báo khi tồn ≤
        </label>
        <input
          name="mucCanhBao"
          type="number"
          min="0"
          value={form.mucCanhBao}
          onChange={handleChange}
        />
        <label style={{ fontSize: "0.85rem", alignSelf: "center" }}>
          Hạn dùng:
        </label>
        <input
          name="hanSuDung"
          type="date"
          value={form.hanSuDung}
          onChange={handleChange}
        />
        <input
          name="ghiChu"
          placeholder="Ghi chú"
          value={form.ghiChu}
          onChange={handleChange}
        />
        <button type="submit" className="btn-small">
          {editingId ? "Lưu thay đổi" : "Thêm vào kho"}
        </button>
        {editingId && (
          <button type="button" className="btn-small" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      <div className="feedback-type">
        <button
          type="button"
          className={tab === "tatca" ? "active" : ""}
          onClick={() => setTab("tatca")}
        >
          Tất cả ({list.length})
        </button>
        {Object.keys(LOAI).map((k) => (
          <button
            type="button"
            key={k}
            className={tab === k ? "active" : ""}
            onClick={() => setTab(k)}
          >
            {LOAI[k]} ({list.filter((v) => v.loai === k).length})
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Tên</th>
              <th>Tồn kho</th>
              <th>Hạn dùng</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {hienThi.length === 0 && (
              <tr>
                <td colSpan="7">Chưa có mục nào trong kho.</td>
              </tr>
            )}
            {hienThi.map((v) => {
              const tt = trangThai(v);
              return (
                <tr key={v.id}>
                  <td>{LOAI[v.loai]}</td>
                  <td>{v.tenVatTu}</td>
                  <td>
                    {v.soLuongTon} {v.donVi}
                  </td>
                  <td>
                    {v.hanSuDung
                      ? new Date(v.hanSuDung).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    <span className={`stock-badge ${tt.cls}`}>{tt.text}</span>
                  </td>
                  <td>{v.ghiChu}</td>
                  <td>
                    <button className="btn-small" onClick={() => handleEdit(v)}>
                      Sửa
                    </button>{" "}
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(v.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminSupplies;
