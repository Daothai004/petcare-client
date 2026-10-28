// trang quản lý khuyến mãi / phụ thu theo ngày
import { useEffect, useState } from "react";
import {
  getAllKhuyenMai,
  createKhuyenMai,
  updateKhuyenMai,
  deleteKhuyenMai,
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
  Thu: "Theo thứ trong tuần",
  DongKhach: "Theo số lịch trong ngày",
  Combo: "Combo nhiều dịch vụ",
};

const RONG = {
  ten: "",
  loai: "Thu",
  kieu: "giam", // giam = giảm giá, phuthu = phụ thu
  phanTram: "",
  thu: [],
  nguong: "",
  moTa: "",
  dangHoatDong: true,
};

function dieuKien(km) {
  if (km.loai === "Thu") {
    const ten = km.cacThu
      .split(",")
      .filter(Boolean)
      .map((t) => THU.find((x) => String(x.v) === t.trim())?.n)
      .filter(Boolean);
    return "Các ngày: " + ten.join(", ");
  }
  if (km.loai === "DongKhach") {
    return `Ngày hẹn có từ ${km.nguong} lịch trở lên`;
  }
  return `Đặt từ ${km.nguong} dịch vụ trở lên`;
}

function AdminPromotions() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(RONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAllKhuyenMai()
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

  const toggleThu = (v) => {
    setForm({
      ...form,
      thu: form.thu.includes(v)
        ? form.thu.filter((x) => x !== v)
        : [...form.thu, v],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {
        ten: form.ten,
        loai: form.loai,
        phanTram: (form.kieu === "giam" ? -1 : 1) * Number(form.phanTram),
        cacThu: form.loai === "Thu" ? [...form.thu].sort().join(",") : "",
        nguong: form.loai === "Thu" ? 0 : Number(form.nguong),
        dangHoatDong: !!form.dangHoatDong,
        moTa: form.moTa,
      };

      if (editingId) {
        await updateKhuyenMai(editingId, data);
      } else {
        await createKhuyenMai(data);
      }

      setForm(RONG);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Thao tác thất bại.");
    }
  };

  const handleEdit = (km) => {
    setForm({
      ten: km.ten,
      loai: km.loai,
      kieu: km.phanTram < 0 ? "giam" : "phuthu",
      phanTram: Math.abs(km.phanTram),
      thu: km.cacThu.split(",").filter(Boolean).map(Number),
      nguong: km.nguong || "",
      moTa: km.moTa,
      dangHoatDong: km.dangHoatDong,
    });
    setEditingId(km.id);
  };

  const handleToggleActive = async (km) => {
    setError(null);
    try {
      await updateKhuyenMai(km.id, {
        ten: km.ten,
        loai: km.loai,
        phanTram: km.phanTram,
        cacThu: km.cacThu,
        nguong: km.nguong,
        dangHoatDong: !km.dangHoatDong,
        moTa: km.moTa,
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Đổi trạng thái thất bại.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa quy tắc này?")) return;
    try {
      await deleteKhuyenMai(id);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Không xóa được.");
    }
  };

  return (
    <div>
      <h1>Khuyến mãi & giá theo ngày</h1>
      <p style={{ color: "var(--color-ink-soft)" }}>
        Mỗi quy tắc là một mức điều chỉnh giá. Chọn <strong>Giảm giá</strong> để
        khuyến mãi hoặc <strong>Phụ thu</strong> để tăng giá vào ngày đông
        khách. Khi khách đặt lịch, hệ thống tự áp dụng và ghi thành một dòng
        riêng trên hóa đơn.
      </p>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <input
          name="ten"
          placeholder="Tên (vd: Ưu đãi cuối tuần)"
          value={form.ten}
          onChange={handleChange}
          required
        />
        <select name="loai" value={form.loai} onChange={handleChange}>
          <option value="Thu">Theo thứ trong tuần</option>
          <option value="DongKhach">Theo số lịch trong ngày</option>
          <option value="Combo">Combo nhiều dịch vụ</option>
        </select>
        <select name="kieu" value={form.kieu} onChange={handleChange}>
          <option value="giam">Giảm giá</option>
          <option value="phuthu">Phụ thu</option>
        </select>
        <input
          name="phanTram"
          type="number"
          step="0.5"
          min="0.5"
          max="50"
          placeholder="% (1-50)"
          value={form.phanTram}
          onChange={handleChange}
          required
        />

        {form.loai === "Thu" ? (
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
        ) : (
          <input
            name="nguong"
            type="number"
            min="1"
            placeholder={
              form.loai === "DongKhach"
                ? "Từ bao nhiêu lịch/ngày"
                : "Từ bao nhiêu dịch vụ"
            }
            value={form.nguong}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="moTa"
          placeholder="Mô tả cho khách xem"
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
          Đang chạy
        </label>
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
              <th>Tên</th>
              <th>Loại</th>
              <th>Điều kiện</th>
              <th>Điều chỉnh</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((k) => (
              <tr key={k.id}>
                <td>{k.ten}</td>
                <td>{TEN_LOAI[k.loai] || k.loai}</td>
                <td>{dieuKien(k)}</td>
                <td
                  style={{
                    fontWeight: 600,
                    color:
                      k.phanTram < 0
                        ? "var(--color-success)"
                        : "var(--color-error)",
                  }}
                >
                  {k.phanTram < 0 ? "Giảm" : "Phụ thu"} {Math.abs(k.phanTram)}%
                </td>
                <td>
                  {k.dangHoatDong ? (
                    "Đang chạy"
                  ) : (
                    <span style={{ color: "var(--color-ink-soft)" }}>
                      Đã tắt
                    </span>
                  )}
                </td>
                <td className="admin-table-actions">
                  <button className="btn-small" onClick={() => handleEdit(k)}>
                    Sửa
                  </button>
                  <button
                    className="btn-small"
                    onClick={() => handleToggleActive(k)}
                  >
                    {k.dangHoatDong ? "Tắt" : "Bật lại"}
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(k.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="6">Chưa có quy tắc nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPromotions;
