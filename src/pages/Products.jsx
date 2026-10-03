// trang sản phẩm cho khách - xem và thêm vào giỏ hàng
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicProducts } from "../services/api";
import { addToCart, getCartCount } from "../services/cart";

const TEN_LOAI = {
  ThucAn: "Thức ăn",
  PhuKien: "Phụ kiện",
  DoDungChamSoc: "Đồ dùng chăm sóc",
};

function Products() {
  const [list, setList] = useState([]);
  const [soLuongChon, setSoLuongChon] = useState({});
  const [thongBao, setThongBao] = useState("");
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    getPublicProducts().then((res) => setList(res.data));
  }, []);

  const handleSoLuongChange = (id, value) => {
    setSoLuongChon({ ...soLuongChon, [id]: value });
  };

  const handleAddToCart = (sp) => {
    const soLuong = Number(soLuongChon[sp.id]) || 1;
    addToCart(sp.id, soLuong);
    setCartCount(getCartCount());
    setThongBao(`Đã thêm "${sp.tenSanPham}" vào giỏ hàng.`);
    setTimeout(() => setThongBao(""), 2000);
  };

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Sản phẩm cho thú cưng</h1>
        <Link to="/gio-hang" className="btn-accent">
          Giỏ hàng ({cartCount})
        </Link>
      </div>

      {thongBao && <div className="alert alert-success">{thongBao}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {list.map((sp) => (
          <div
            key={sp.id}
            className="form-card"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {sp.hinhAnh ? (
              <img
                src={sp.hinhAnh}
                alt={sp.tenSanPham}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 140,
                  borderRadius: 8,
                  background: "var(--color-cream, #f2ede4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                  fontSize: 13,
                }}
              >
                Chưa có ảnh
              </div>
            )}
            <span style={{ fontSize: 12, color: "var(--color-ink-soft)" }}>
              {TEN_LOAI[sp.loai] ?? sp.loai}
            </span>
            <strong>{sp.tenSanPham}</strong>
            {sp.moTa && <p style={{ fontSize: 13, margin: 0 }}>{sp.moTa}</p>}
            <strong style={{ color: "var(--color-accent, #c0392b)" }}>
              {sp.gia.toLocaleString("vi-VN")}đ
              {sp.donViTinh ? ` / ${sp.donViTinh}` : ""}
            </strong>

            {sp.soLuongTon > 0 ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  min="1"
                  max={sp.soLuongTon}
                  value={soLuongChon[sp.id] ?? 1}
                  onChange={(e) => handleSoLuongChange(sp.id, e.target.value)}
                  style={{ width: 60 }}
                />
                <button
                  className="btn-small"
                  onClick={() => handleAddToCart(sp)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            ) : (
              <span style={{ color: "#c0392b", fontWeight: 600 }}>
                Hết hàng
              </span>
            )}
          </div>
        ))}
        {list.length === 0 && <p>Hiện chưa có sản phẩm nào.</p>}
      </div>
    </div>
  );
}

export default Products;
