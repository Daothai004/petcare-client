// Hóa đơn gộp phía quản trị: xem toàn bộ dịch vụ + sản phẩm của khách,
// thêm / xóa khoản phát sinh (thuốc, vắc-xin...) cho dịch vụ mình phụ trách
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getHoaDon,
  addInvoiceItem,
  deleteInvoiceItem,
  getProducts,
  getSupplies,
} from "../../services/api";
import HoaDonView from "../../components/HoaDonView";

const LOAI = {
  Thuoc: "Thuốc",
  VacXin: "Vắc-xin",
  SanPham: "Sản phẩm",
  DungCu: "Dụng cụ y tế",
  Khac: "Khác",
};

const RONG = {
  lichHenId: "",
  loai: "Thuoc",
  tenKhoan: "",
  soLuong: 1,
  donGia: "",
};

function AdminInvoice() {
  const { id } = useParams(); // mã HÓA ĐƠN
  const [hoaDon, setHoaDon] = useState(null);
  const [form, setForm] = useState(RONG);
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState(null);

  const loadHoaDon = () => {
    getHoaDon(id)
      .then((res) => {
        setHoaDon(res.data);
        // Chọn sẵn dịch vụ đầu tiên mà mình được phép thêm khoản
        const duoc = res.data.danhSachDichVu.filter(
          (d) => d.quanLyDuoc && d.trangThai !== 3,
        );
        setForm((f) => ({
          ...f,
          lichHenId: f.lichHenId || (duoc[0] ? String(duoc[0].id) : ""),
        }));
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Không tải được hóa đơn."),
      );
  };

  useEffect(() => {
    loadHoaDon();
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
      await addInvoiceItem(Number(form.lichHenId), {
        loai: form.loai,
        tenKhoan: form.tenKhoan,
        soLuong: Number(form.soLuong) || 1,
        donGia: Number(form.donGia) || 0,
      });
      setForm({ ...RONG, lichHenId: form.lichHenId, loai: form.loai });
      loadHoaDon();
    } catch (err) {
      setError(err.response?.data?.message || "Thêm khoản thu thất bại.");
    }
  };

  const handleXoaKhoan = async (khoanThuId) => {
    if (!confirm("Xóa khoản thu này khỏi hóa đơn?")) return;
    setError(null);
    try {
      await deleteInvoiceItem(khoanThuId);
      loadHoaDon();
    } catch (err) {
      setError(err.response?.data?.message || "Xóa thất bại.");
    }
  };

  const goiY =
    form.loai === "SanPham"
      ? products.map((p) => p.tenSanPham)
      : supplies.filter((s) => s.loai === form.loai).map((s) => s.tenVatTu);

  const dichVuSua = hoaDon
    ? hoaDon.danhSachDichVu.filter((d) => d.quanLyDuoc && d.trangThai !== 3)
    : [];

  return (
    <div>
      <h1>Hóa đơn #{id}</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {hoaDon && (
        <>
          <HoaDonView
            hoaDon={hoaDon}
            onXoaKhoan={hoaDon.daThanhToan ? null : handleXoaKhoan}
          />

          {hoaDon.daThanhToan ? (
            <div className="alert alert-error">
              Hóa đơn đã thanh toán nên đã được chốt, không thể thêm hoặc xóa
              khoản thu.
            </div>
          ) : dichVuSua.length === 0 ? (
            <div className="alert alert-error">
              Bạn không phụ trách dịch vụ nào đang hoạt động trong hóa đơn này
              nên không thể thêm khoản thu. Bạn vẫn xem được toàn bộ hóa đơn.
            </div>
          ) : (
            <>
              <p style={{ color: "var(--color-ink-soft)" }}>
                Dịch vụ chính và sản phẩm đã có sẵn trong hóa đơn. Chỉ thêm các
                khoản phát sinh như thuốc, vắc-xin, dụng cụ y tế cho dịch vụ do
                bạn phụ trách.
              </p>
              <form onSubmit={handleSubmit} className="admin-inline-form">
                <select
                  name="lichHenId"
                  value={form.lichHenId}
                  onChange={handleChange}
                  required
                >
                  {dichVuSua.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.tenDichVu} ({d.tenNhanSu})
                    </option>
                  ))}
                </select>
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
