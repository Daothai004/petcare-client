// Trang biên lai của một lịch hẹn (Nhân viên / Bác sĩ / Admin thêm khoản thu)
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInvoice,
  addInvoiceItem,
  deleteInvoiceItem,
  getProducts,
  getSupplies,
} from "../../services/api";
import InvoiceTable from "../../components/InvoiceTable";

const LOAI = {
  Thuoc: "Thuốc",
  VacXin: "Vắc-xin",
  SanPham: "Sản phẩm",
  DungCu: "Dụng cụ y tế",
  Khac: "Khác",
};

const RONG = { loai: "Thuoc", tenKhoan: "", soLuong: 1, donGia: "" };

function AdminInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [form, setForm] = useState(RONG);
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState(null);

  const loadInvoice = () => {
    getInvoice(id)
      .then((res) => setInvoice(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Không tải được biên lai."),
      );
  };

  useEffect(() => {
    loadInvoice();
    // Dữ liệu gợi ý tên: sản phẩm (có giá) và kho thuốc/vắc-xin/dụng cụ
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => {});
    getSupplies()
      .then((res) => setSupplies(res.data))
      .catch(() => {});
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };

    // Chọn đúng tên một sản phẩm thì tự điền đơn giá
    if (name === "tenKhoan" && next.loai === "SanPham") {
      const sp = products.find(
        (p) => p.tenSanPham.toLowerCase() === value.trim().toLowerCase(),
      );
      if (sp) next.donGia = sp.gia;
    }
    setForm(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await addInvoiceItem(id, {
        loai: form.loai,
        tenKhoan: form.tenKhoan,
        soLuong: Number(form.soLuong) || 1,
        donGia: Number(form.donGia) || 0,
      });
      setForm({ ...RONG, loai: form.loai });
      loadInvoice();
    } catch (err) {
      setError(err.response?.data?.message || "Thêm khoản thu thất bại.");
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Xóa khoản thu này khỏi biên lai?")) return;
    setError(null);
    try {
      await deleteInvoiceItem(itemId);
      loadInvoice();
    } catch (err) {
      setError(err.response?.data?.message || "Xóa thất bại.");
    }
  };

  const goiY =
    form.loai === "SanPham"
      ? products.map((p) => p.tenSanPham)
      : supplies.filter((s) => s.loai === form.loai).map((s) => s.tenVatTu);

  const khoa = invoice && (invoice.daThanhToan || invoice.trangThai === 3);

  return (
    <div>
      <h1>Biên lai lịch hẹn #{id}</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {invoice && (
        <>
          <InvoiceTable
            invoice={invoice}
            onDelete={khoa ? null : handleDelete}
          />

          {khoa ? (
            <div className="alert alert-error">
              {invoice.daThanhToan
                ? "Lịch hẹn đã thanh toán nên biên lai đã được chốt, không thể thêm hoặc xóa khoản thu."
                : "Lịch hẹn đã hủy nên không thể thêm khoản thu."}
            </div>
          ) : (
            <>
              <p style={{ color: "var(--color-ink-soft)" }}>
                Dịch vụ chính được tính tự động. Chỉ thêm các khoản phát sinh
                như thuốc, vắc-xin, sản phẩm, dụng cụ y tế.
              </p>
              <form onSubmit={handleSubmit} className="admin-inline-form">
                <select name="loai" value={form.loai} onChange={handleChange}>
                  {Object.keys(LOAI).map((k) => (
                    <option key={k} value={k}>
                      {LOAI[k]}
                    </option>
                  ))}
                </select>
                <input
                  name="tenKhoan"
                  placeholder="Tên khoản thu"
                  value={form.tenKhoan}
                  onChange={handleChange}
                  list="ds-goi-y-khoan-thu"
                  required
                />
                <datalist id="ds-goi-y-khoan-thu">
                  {goiY.map((ten) => (
                    <option key={ten} value={ten} />
                  ))}
                </datalist>
                <label style={{ fontSize: "0.85rem", alignSelf: "center" }}>
                  SL:
                </label>
                <input
                  name="soLuong"
                  type="number"
                  min="1"
                  value={form.soLuong}
                  onChange={handleChange}
                />
                <input
                  name="donGia"
                  type="number"
                  min="0"
                  placeholder="Đơn giá (đ)"
                  value={form.donGia}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="btn-small">
                  Thêm khoản thu
                </button>
              </form>
            </>
          )}
        </>
      )}

      <p style={{ marginTop: 16 }}>
        <Link to="/admin/lich-hen">← Quay lại Quản lý lịch hẹn</Link>
      </p>
    </div>
  );
}

export default AdminInvoice;
