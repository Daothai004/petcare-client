// trang quản lý sản phẩm - đồ ăn, phụ kiện, đồ dùng chăm sóc (Nhân viên spa + Admin)
import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";

const RONG = {
  tenSanPham: "",
  loai: "ThucAn",
  donViTinh: "",
  gia: "",
  soLuongTon: "",
  moTa: "",
  hinhAnh: "",
  dangBan: true,
};

const TEN_LOAI = {
  ThucAn: "Thức ăn",
  PhuKien: "Phụ kiện",
  DoDungChamSoc: "Đồ dùng chăm sóc",
};

// dưới ngưỡng này thì cảnh báo "sắp hết hàng" - chỉ để hiển thị, không lưu vào CSDL
const NGUONG_SAP_HET = 10;

function AdminProducts() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getProducts().then((res) => setList(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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
      gia: Number(form.gia) || 0,
      soLuongTon: Number(form.soLuongTon) || 0,
    };

    try {
      if (editingId !== null) {
        await updateProduct(editingId, { ...data, id: editingId });
      } else {
        await createProduct(data);
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu sản phẩm thất bại.");
    }
  };

  const handleEdit = (sp) => {
    setForm({
      tenSanPham: sp.tenSanPham,
      loai: sp.loai,
      donViTinh: sp.donViTinh ?? "",
      gia: sp.gia,
      soLuongTon: sp.soLuongTon,
      moTa: sp.moTa ?? "",
      hinhAnh: sp.hinhAnh ?? "",
      dangBan: sp.dangBan,
    });
    setEditingId(sp.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    await deleteProduct(id);
    loadData();
  };

  return (
    <div>
      <h1>Sản phẩm</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <input
          name="tenSanPham"
          placeholder="Tên sản phẩm"
          value={form.tenSanPham}
          onChange={handleChange}
          required
        />
        <select name="loai" value={form.loai} onChange={handleChange}>
          <option value="ThucAn">Thức ăn</option>
          <option value="PhuKien">Phụ kiện</option>
          <option value="DoDungChamSoc">Đồ dùng chăm sóc</option>
        </select>
        <input
          name="donViTinh"
          placeholder="Đơn vị tính (kg, cái, gói...)"
          value={form.donViTinh}
          onChange={handleChange}
          style={{ width: 150 }}
        />
        <input
          name="gia"
          type="number"
          min="0"
          placeholder="Giá (VNĐ)"
          value={form.gia}
          onChange={handleChange}
          required
        />
        <input
          name="soLuongTon"
          type="number"
          min="0"
          placeholder="Số lượng tồn"
          value={form.soLuongTon}
          onChange={handleChange}
          required
        />
        <input
          name="hinhAnh"
          placeholder="Link ảnh sản phẩm (không bắt buộc)"
          value={form.hinhAnh}
          onChange={handleChange}
        />
        <input
          name="moTa"
          placeholder="Mô tả"
          value={form.moTa}
          onChange={handleChange}
        />
        <label
          style={{
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <input
            name="dangBan"
            type="checkbox"
            checked={form.dangBan}
            onChange={handleChange}
          />
          Đang bán
        </label>
        <button type="submit" className="btn-small">
          {editingId !== null ? "Lưu thay đổi" : "Thêm mới"}
        </button>
        {editingId !== null && (
          <button type="button" className="btn-small" onClick={resetForm}>
            Hủy sửa
          </button>
        )}
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "7%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((sp) => (
              <tr key={sp.id}>
                <td>
                  {sp.hinhAnh ? (
                    <img
                      src={sp.hinhAnh}
                      alt={sp.tenSanPham}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{sp.tenSanPham}</td>
                <td>{TEN_LOAI[sp.loai] ?? sp.loai}</td>
                <td>
                  {sp.gia.toLocaleString("vi-VN")}đ
                  {sp.donViTinh ? ` / ${sp.donViTinh}` : ""}
                </td>
                <td>
                  {sp.soLuongTon}
                  {sp.soLuongTon <= NGUONG_SAP_HET && (
                    <span
                      style={{
                        color: "#c0392b",
                        fontWeight: 600,
                        marginLeft: 6,
                      }}
                    >
                      Sắp hết hàng
                    </span>
                  )}
                </td>
                <td>{sp.dangBan ? "Đang bán" : "Ngừng bán"}</td>
                <td className="admin-table-actions">
                  <button className="btn-small" onClick={() => handleEdit(sp)}>
                    Sửa
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(sp.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="7">Chưa có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
