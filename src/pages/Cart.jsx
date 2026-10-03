// trang giỏ hàng + đặt hàng
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPublicProducts, createOrder } from "../services/api";
import {
  getCartItems,
  updateCartQty,
  removeFromCart,
  clearCart,
} from "../services/cart";

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [diaChiNhan, setDiaChiNhan] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState("COD");
  const [error, setError] = useState(null);
  const [dangGui, setDangGui] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
    getPublicProducts().then((res) => setProducts(res.data));
  }, []);

  const chiTiet = items
    .map((i) => {
      const sp = products.find((p) => p.id === i.sanPhamId);
      return sp ? { ...i, sanPham: sp } : null;
    })
    .filter(Boolean);

  const tongTien = chiTiet.reduce(
    (sum, i) => sum + i.sanPham.gia * i.soLuong,
    0,
  );

  const handleQtyChange = (sanPhamId, value) => {
    const soLuong = Number(value);
    updateCartQty(sanPhamId, soLuong);
    setItems(getCartItems());
  };

  const handleRemove = (sanPhamId) => {
    removeFromCart(sanPhamId);
    setItems(getCartItems());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (chiTiet.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }

    setDangGui(true);
    try {
      const res = await createOrder({
        diaChiNhan,
        ghiChu,
        hinhThucThanhToan,
        items: chiTiet.map((i) => ({
          sanPhamId: i.sanPhamId,
          soLuong: i.soLuong,
        })),
      });
      clearCart();
      if (hinhThucThanhToan === "Online") {
        navigate(`/thanh-toan-don-hang/${res.data.id}`);
      } else {
        navigate("/don-hang-cua-toi");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đặt hàng thất bại.");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="page">
      <h1>Giỏ hàng</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {chiTiet.length === 0 ? (
        <p>
          Giỏ hàng đang trống. <Link to="/san-pham">Xem sản phẩm</Link>
        </p>
      ) : (
        <>
          <table className="admin-table" style={{ marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {chiTiet.map((i) => (
                <tr key={i.sanPhamId}>
                  <td>{i.sanPham.tenSanPham}</td>
                  <td>{i.sanPham.gia.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={i.sanPham.soLuongTon}
                      value={i.soLuong}
                      onChange={(e) =>
                        handleQtyChange(i.sanPhamId, e.target.value)
                      }
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>
                    {(i.sanPham.gia * i.soLuong).toLocaleString("vi-VN")}đ
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-small btn-danger"
                      onClick={() => handleRemove(i.sanPhamId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Tổng tiền: {tongTien.toLocaleString("vi-VN")}đ</h3>

          <form
            onSubmit={handleSubmit}
            className="form-card"
            style={{ maxWidth: 480 }}
          >
            <div className="form-field">
              <label htmlFor="diaChiNhan">Địa chỉ nhận hàng</label>
              <input
                id="diaChiNhan"
                value={diaChiNhan}
                onChange={(e) => setDiaChiNhan(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="ghiChu">Ghi chú</label>
              <input
                id="ghiChu"
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Hình thức thanh toán</label>
              <div style={{ display: "flex", gap: 16 }}>
                <label style={{ fontWeight: 400 }}>
                  <input
                    type="radio"
                    name="hinhThucThanhToan"
                    value="COD"
                    checked={hinhThucThanhToan === "COD"}
                    onChange={(e) => setHinhThucThanhToan(e.target.value)}
                  />{" "}
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label style={{ fontWeight: 400 }}>
                  <input
                    type="radio"
                    name="hinhThucThanhToan"
                    value="Online"
                    checked={hinhThucThanhToan === "Online"}
                    onChange={(e) => setHinhThucThanhToan(e.target.value)}
                  />{" "}
                  Thanh toán online
                </label>
              </div>
            </div>
            <button type="submit" className="btn-accent" disabled={dangGui}>
              {dangGui ? "Đang đặt hàng..." : "Đặt hàng"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Cart;
