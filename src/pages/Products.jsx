// Trang sản phẩm cho khách: tìm kiếm, lọc, sắp xếp, xem chi tiết và thêm vào giỏ hàng
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getPublicProducts } from "../services/api";
import { addToCart, getCartCount } from "../services/cart";

const TEN_LOAI = {
  ThucAn: "Thức ăn",
  PhuKien: "Phụ kiện",
  DoDungChamSoc: "Đồ dùng chăm sóc",
};

// Bỏ dấu tiếng Việt để gõ "thuc an" vẫn tìm ra "Thức ăn"
const boDau = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const GIA = (n) => `${Number(n).toLocaleString("vi-VN")}đ`;

function AnhSanPham({ sp, lop }) {
  return sp.hinhAnh ? (
    <img className={`sp-anh ${lop}`} src={sp.hinhAnh} alt={sp.tenSanPham} />
  ) : (
    <div className={`sp-anh sp-khong-anh ${lop}`}>Chưa có ảnh</div>
  );
}

function Products() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [loai, setLoai] = useState("");
  const [sapXep, setSapXep] = useState("ten");
  const [chiConHang, setChiConHang] = useState(false);
  const [soLuongChon, setSoLuongChon] = useState({});
  const [thongBao, setThongBao] = useState("");
  const [cartCount, setCartCount] = useState(getCartCount());

  // Chi tiết sản phẩm mở theo địa chỉ ?xem=ID (để chatbot cũng gửi được đường dẫn tới đúng sản phẩm)
  const xemId = Number(params.get("xem")) || null;
  const spDangXem = list.find((s) => s.id === xemId) || null;
  const moChiTiet = (id) => setParams({ xem: id });
  const dongChiTiet = () => setParams({});

  useEffect(() => {
    getPublicProducts().then((res) => setList(res.data));
  }, []);

  // Bấm phím Esc để đóng chi tiết
  useEffect(() => {
    if (!spDangXem) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setParams({});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spDangXem, setParams]);

  const hienThi = useMemo(() => {
    const cacTu = boDau(tuKhoa).split(" ").filter(Boolean);
    return list
      .filter((s) => {
        if (loai && s.loai !== loai) return false;
        if (chiConHang && s.soLuongTon <= 0) return false;
        const noiDung = boDau(
          `${s.tenSanPham} ${s.moTa || ""} ${TEN_LOAI[s.loai] || ""}`,
        );
        return cacTu.every((t) => noiDung.includes(t));
      })
      .sort((a, b) => {
        if (sapXep === "gia-tang") return a.gia - b.gia;
        if (sapXep === "gia-giam") return b.gia - a.gia;
        return a.tenSanPham.localeCompare(b.tenSanPham, "vi");
      });
  }, [list, tuKhoa, loai, chiConHang, sapXep]);

  const laySoLuong = (sp) =>
    Math.min(Math.max(Number(soLuongChon[sp.id]) || 1, 1), sp.soLuongTon);

  const themVaoGio = (sp) => {
    addToCart(sp.id, laySoLuong(sp));
    setCartCount(getCartCount());
    setThongBao(`Đã thêm "${sp.tenSanPham}" vào giỏ hàng.`);
    setTimeout(() => setThongBao(""), 2500);
  };

  const muaNgay = (sp) => {
    addToCart(sp.id, laySoLuong(sp));
    navigate("/gio-hang");
  };

  const xoaBoLoc = () => {
    setTuKhoa("");
    setLoai("");
    setChiConHang(false);
  };

  const cungLoai = spDangXem
    ? list
        .filter((s) => s.loai === spDangXem.loai && s.id !== spDangXem.id)
        .slice(0, 3)
    : [];

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

      {thongBao && !spDangXem && (
        <div className="alert alert-success">{thongBao}</div>
      )}

      <div className="sp-thanh-cong-cu">
        <input
          className="sp-tim"
          type="search"
          placeholder="Tìm sản phẩm theo tên hoặc mô tả..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />
        <select value={sapXep} onChange={(e) => setSapXep(e.target.value)}>
          <option value="ten">Tên A → Z</option>
          <option value="gia-tang">Giá thấp đến cao</option>
          <option value="gia-giam">Giá cao đến thấp</option>
        </select>
      </div>

      <div className="sp-chips">
        {[["", "Tất cả"], ...Object.entries(TEN_LOAI)].map(([ma, ten]) => (
          <button
            key={ma}
            type="button"
            className={loai === ma ? "active" : ""}
            onClick={() => setLoai(ma)}
          >
            {ten}
          </button>
        ))}
        <label className="sp-con-hang">
          <input
            type="checkbox"
            checked={chiConHang}
            onChange={(e) => setChiConHang(e.target.checked)}
          />
          Chỉ hiện còn hàng
        </label>
      </div>

      {list.length > 0 && (
        <p className="sp-dem">Tìm thấy {hienThi.length} sản phẩm</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {hienThi.map((sp) => (
          <div
            key={sp.id}
            className="form-card"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <div className="sp-bam-xem" onClick={() => moChiTiet(sp.id)}>
              <AnhSanPham sp={sp} lop="sp-anh-the" />
            </div>
            <span style={{ fontSize: 12, color: "var(--color-ink-soft)" }}>
              {TEN_LOAI[sp.loai] ?? sp.loai}
            </span>
            <strong
              className="sp-bam-xem sp-ten"
              onClick={() => moChiTiet(sp.id)}
            >
              {sp.tenSanPham}
            </strong>
            {sp.moTa && <p className="sp-mo-ta-ngan">{sp.moTa}</p>}
            <strong style={{ color: "var(--color-accent, #c0392b)" }}>
              {GIA(sp.gia)}
              {sp.donViTinh ? ` / ${sp.donViTinh}` : ""}
            </strong>

            {sp.soLuongTon > 0 ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  min="1"
                  max={sp.soLuongTon}
                  value={soLuongChon[sp.id] ?? 1}
                  onChange={(e) =>
                    setSoLuongChon({ ...soLuongChon, [sp.id]: e.target.value })
                  }
                  style={{ width: 60 }}
                />
                <button className="btn-small" onClick={() => themVaoGio(sp)}>
                  Thêm vào giỏ
                </button>
                <button
                  className="btn-small btn-outline"
                  onClick={() => moChiTiet(sp.id)}
                >
                  Chi tiết
                </button>
              </div>
            ) : (
              <span style={{ color: "#c0392b", fontWeight: 600 }}>
                Hết hàng
              </span>
            )}
          </div>
        ))}
      </div>

      {list.length === 0 && <p>Hiện chưa có sản phẩm nào.</p>}
      {list.length > 0 && hienThi.length === 0 && (
        <p>
          Không tìm thấy sản phẩm phù hợp.{" "}
          <button type="button" className="btn-small" onClick={xoaBoLoc}>
            Xóa bộ lọc
          </button>
        </p>
      )}

      {spDangXem && (
        <div className="sp-nen-mo" onClick={dongChiTiet}>
          <div className="sp-hop" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="sp-dong"
              onClick={dongChiTiet}
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="sp-hop-anh">
              <AnhSanPham sp={spDangXem} lop="sp-anh-lon" />
            </div>
            <div className="sp-hop-noi-dung">
              <span className="sp-loai">
                {TEN_LOAI[spDangXem.loai] ?? spDangXem.loai}
              </span>
              <h2>{spDangXem.tenSanPham}</h2>
              <div className="sp-gia">
                {GIA(spDangXem.gia)}
                {spDangXem.donViTinh ? ` / ${spDangXem.donViTinh}` : ""}
              </div>
              <p className={spDangXem.soLuongTon > 0 ? "sp-con" : "sp-het"}>
                {spDangXem.soLuongTon > 0
                  ? `Còn ${spDangXem.soLuongTon} sản phẩm trong kho`
                  : "Tạm hết hàng"}
              </p>
              <p className="sp-mo-ta">
                {spDangXem.moTa || "Sản phẩm chưa có mô tả chi tiết."}
              </p>

              {thongBao && (
                <div className="alert alert-success">{thongBao}</div>
              )}

              {spDangXem.soLuongTon > 0 && (
                <div className="sp-hang-nut">
                  <input
                    type="number"
                    min="1"
                    max={spDangXem.soLuongTon}
                    value={soLuongChon[spDangXem.id] ?? 1}
                    onChange={(e) =>
                      setSoLuongChon({
                        ...soLuongChon,
                        [spDangXem.id]: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => themVaoGio(spDangXem)}
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => muaNgay(spDangXem)}
                  >
                    Mua ngay
                  </button>
                </div>
              )}

              {cungLoai.length > 0 && (
                <div>
                  <div className="sp-lien-quan-tieu-de">Sản phẩm cùng loại</div>
                  <div className="sp-lien-quan">
                    {cungLoai.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => moChiTiet(s.id)}
                      >
                        <strong>{s.tenSanPham}</strong>
                        <span>{GIA(s.gia)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
