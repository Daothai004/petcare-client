// Trang quản lý ưu đãi giá sản phẩm: theo ngày hoặc dịp, giảm khi mua nhiều, giảm khi khách có lịch dịch vụ
import { useEffect, useState } from "react";
import {
  getAllUuDaiSanPham,
  createUuDaiSanPham,
  updateUuDaiSanPham,
  deleteUuDaiSanPham,
  getAllServices,
} from "../../services/api";

const THU = [
  { v: 1, n: "T2" },
  { v: 2, n: "T3" },
  { v: 3, n: "T4" },
  { v: 4, n: "T5" },
  { v: 5, n: "T6" },
  { v: 6, n: "T7" },
  { v: 0, n: "CN" },
];

const TEN_LOAI = {
  Ngay: "Theo ngày hoặc dịp",
  SoLuong: "Giảm khi mua nhiều",
  LienKet: "Kèm dịch vụ",
};

const TEN_PHAM_VI = {
  TatCa: "Tất cả sản phẩm",
  ThucAn: "Thức ăn",
  PhuKien: "Phụ kiện",
  DoDungChamSoc: "Đồ dùng chăm sóc",
};

const RONG = {
  ten: "",
  loai: "Ngay",
  phanTram: "",
  phamVi: "TatCa",
  thu: [],
  nguong: "",
  dichVuId: "",
  tuNgay: "",
  denNgay: "",
  moTa: "",
  dangHoatDong: true,
};

const ngay = (s) => (s ? s.slice(0, 10) : "");
const ngayDep = (s) => new Date(s).toLocaleDateString("vi-VN");

function AdminProductOffers() {
  const [list, setList] = useState([]);
  const [dichVus, setDichVus] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAllUuDaiSanPham()
      .then((res) => setList(res.data))
      .catch(() => setError("Không tải được danh sách ưu đãi."));
  };

  useEffect(() => {
    loadData();
    getAllServices()
      .then((res) => setDichVus(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const toggleThu = (v) =>
    setForm({
      ...form,
      thu: form.thu.includes(v)
        ? form.thu.filter((x) => x !== v)
        : [...form.thu, v],
    });

  const resetForm = () => {
    setForm(RONG);
    setEditingId(null);
  };

  const duLieu = (f) => ({
    ten: f.ten,
    loai: f.loai,
    phanTram: Number(f.phanTram) || 0,
    phamVi: f.phamVi,
    cacThu: f.loai === "Ngay" ? f.thu.join(",") : "",
    nguong: Number(f.nguong) || 0,
    dichVuId: f.loai === "LienKet" && f.dichVuId ? Number(f.dichVuId) : null,
    tuNgay: f.tuNgay || null,
    denNgay: f.denNgay || null,
    moTa: f.moTa,
    dangHoatDong: !!f.dangHoatDong,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId !== null) await updateUuDaiSanPham(editingId, duLieu(form));
      else await createUuDaiSanPham(duLieu(form));
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu ưu đãi thất bại.");
    }
  };

  const handleEdit = (u) => {
    setForm({
      ten: u.ten,
      loai: u.loai,
      phanTram: u.phanTram,
      phamVi: u.phamVi,
      thu: u.cacThu.split(",").filter(Boolean).map(Number),
      nguong: u.nguong || "",
      dichVuId: u.dichVuId ?? "",
      tuNgay: ngay(u.tuNgay),
      denNgay: ngay(u.denNgay),
      moTa: u.moTa,
      dangHoatDong: u.dangHoatDong,
    });
    setEditingId(u.id);
    setError(null);
  };

  const handleToggle = async (u) => {
    setError(null);
    try {
      await updateUuDaiSanPham(u.id, {
        ten: u.ten,
        loai: u.loai,
        phanTram: u.phanTram,
        phamVi: u.phamVi,
        cacThu: u.cacThu,
        nguong: u.nguong,
        dichVuId: u.dichVuId,
        tuNgay: u.tuNgay,
        denNgay: u.denNgay,
        moTa: u.moTa,
        dangHoatDong: !u.dangHoatDong,
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Đổi trạng thái thất bại.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa ưu đãi này?")) return;
    try {
      await deleteUuDaiSanPham(id);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Không xóa được.");
    }
  };

  const dieuKien = (u) => {
    let kq = "";
    if (u.loai === "Ngay") {
      const thu = u.cacThu
        .split(",")
        .filter(Boolean)
        .map((t) => THU.find((x) => String(x.v) === t.trim())?.n)
        .filter(Boolean);
      kq = thu.length > 0 ? `Các ngày: ${thu.join(", ")}` : "Mọi ngày";
    } else if (u.loai === "SoLuong") {
      kq = `Mua từ ${u.nguong} cái cùng một sản phẩm`;
    } else {
      const dv = dichVus.find((d) => d.id === u.dichVuId);
      kq = `Khách có lịch "${dv ? dv.tenDichVu : "dịch vụ đã xóa"}"`;
    }
    if (u.tuNgay || u.denNgay) {
      kq += ` · ${u.tuNgay ? ngayDep(u.tuNgay) : "..."} đến ${u.denNgay ? ngayDep(u.denNgay) : "..."}`;
    }
    return kq;
  };

  return (
    <div>
      <h1>Ưu đãi sản phẩm</h1>
      <p style={{ color: "var(--color-ink-soft)" }}>
        Các ưu đãi này cộng thêm vào khuyến mãi riêng của từng sản phẩm (tổng
        giảm tối đa 50%). Khi khách xem giỏ hàng hoặc đặt hàng, hệ thống tự áp
        dụng và ghi lại trên đơn.
      </p>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <input
          name="ten"
          placeholder="Tên ưu đãi (vd: Cuối tuần giảm 5%)"
          value={form.ten}
          onChange={handleChange}
          required
        />
        <select name="loai" value={form.loai} onChange={handleChange}>
          {Object.entries(TEN_LOAI).map(([ma, ten]) => (
            <option key={ma} value={ma}>
              {ten}
            </option>
          ))}
        </select>
        <input
          name="phanTram"
          type="number"
          step="0.5"
          min="1"
          max="50"
          placeholder="Giảm % (1-50)"
          value={form.phanTram}
          onChange={handleChange}
          required
        />
        <select name="phamVi" value={form.phamVi} onChange={handleChange}>
          {Object.entries(TEN_PHAM_VI).map(([ma, ten]) => (
            <option key={ma} value={ma}>
              {ten}
            </option>
          ))}
        </select>

        {form.loai === "Ngay" && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {THU.map((t) => (
              <label
                key={t.v}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <input
                  type="checkbox"
                  checked={form.thu.includes(t.v)}
                  onChange={() => toggleThu(t.v)}
                />
                {t.n}
              </label>
            ))}
          </div>
        )}
        {form.loai === "SoLuong" && (
          <input
            name="nguong"
            type="number"
            min="2"
            placeholder="Từ bao nhiêu cái"
            value={form.nguong}
            onChange={handleChange}
            required
          />
        )}
        {form.loai === "LienKet" && (
          <select
            name="dichVuId"
            value={form.dichVuId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn dịch vụ liên kết --</option>
            {dichVus.map((d) => (
              <option key={d.id} value={d.id}>
                {d.tenDichVu}
              </option>
            ))}
          </select>
        )}

        <label style={{ fontSize: 13 }}>
          Từ ngày{" "}
          <input
            name="tuNgay"
            type="date"
            value={form.tuNgay}
            onChange={handleChange}
          />
        </label>
        <label style={{ fontSize: 13 }}>
          Đến ngày{" "}
          <input
            name="denNgay"
            type="date"
            value={form.denNgay}
            onChange={handleChange}
          />
        </label>
        <input
          name="moTa"
          placeholder="Mô tả"
          value={form.moTa}
          onChange={handleChange}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            name="dangHoatDong"
            checked={!!form.dangHoatDong}
            onChange={handleChange}
          />
          Đang áp dụng
        </label>
        <button type="submit" className="btn-small">
          {editingId !== null ? "Lưu thay đổi" : "Thêm ưu đãi"}
        </button>
        {editingId !== null && (
          <button type="button" className="btn-small" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Loại</th>
            <th>Giảm</th>
            <th>Nhóm</th>
            <th>Điều kiện</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id}>
              <td>{u.ten}</td>
              <td>{TEN_LOAI[u.loai] ?? u.loai}</td>
              <td>{u.phanTram}%</td>
              <td>{TEN_PHAM_VI[u.phamVi] ?? u.phamVi}</td>
              <td>{dieuKien(u)}</td>
              <td>{u.dangHoatDong ? "Đang áp dụng" : "Tạm dừng"}</td>
              <td className="admin-table-actions">
                <button className="btn-small" onClick={() => handleEdit(u)}>
                  Sửa
                </button>
                <button className="btn-small" onClick={() => handleToggle(u)}>
                  {u.dangHoatDong ? "Tạm dừng" : "Bật lại"}
                </button>
                <button
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(u.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan="7">Chưa có ưu đãi nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductOffers;
