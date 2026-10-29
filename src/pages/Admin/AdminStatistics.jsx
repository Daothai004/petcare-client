// Trang thống kê và phân tích kinh doanh (chỉ Admin)
import { useEffect, useState } from "react";
import { getThongKe } from "../../services/api";

const TIEN = (n) => `${Math.round(Number(n) || 0).toLocaleString("vi-VN")} đ`;
const TIEN_NGAN = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace(".", ",")} tỷ`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(".", ",")} tr`;
  if (v >= 1e3) return `${Math.round(v / 1e3)}k`;
  return `${v}`;
};
const NGAY = (s) => new Date(s).toLocaleDateString("vi-VN");

const KY_HAN = [
  { ma: "ngay", nhan: "Ngày", moTa: "30 ngày gần nhất" },
  { ma: "tuan", nhan: "Tuần", moTa: "12 tuần gần nhất" },
  { ma: "thang", nhan: "Tháng", moTa: "12 tháng gần nhất" },
  { ma: "nam", nhan: "Năm", moTa: "5 năm gần nhất" },
];

const TAB = [
  { ma: "tong-quan", nhan: "Tổng quan" },
  { ma: "dich-vu", nhan: "Dịch vụ" },
  { ma: "san-pham", nhan: "Sản phẩm và kho" },
  { ma: "thanh-toan", nhan: "Thanh toán" },
  { ma: "lich-hen", nhan: "Lịch hẹn" },
];

const VI = {
  VNPAY: { ten: "VNPay QR", mau: "#4f8df5" },
  MOMO: { ten: "MoMo", mau: "#e0509c" },
  ZALOPAY: { ten: "ZaloPay", mau: "#3aa0ff" },
  SHOPEEPAY: { ten: "ShopeePay", mau: "#ff7a59" },
  COD: { ten: "Tiền mặt khi giao (COD)", mau: "#a8c256" },
  TAI_QUAY: { ten: "Tại quầy / khác", mau: "#c3c9bf" },
};

// ---------- Các thành phần biểu đồ nhỏ ----------
function ChipTang({ phanTram }) {
  if (phanTram === null || phanTram === undefined) {
    return <span className="tk-chip">Chưa có kỳ trước để so sánh</span>;
  }
  const tang = phanTram >= 0;
  return (
    <span className={`tk-chip ${tang ? "tk-chip-len" : "tk-chip-xuong"}`}>
      {tang ? "▲" : "▼"} {Math.abs(phanTram)}% so với kỳ trước
    </span>
  );
}

function TheSo({ nhan, giaTri, phu }) {
  return (
    <div className="tk-glass">
      <div className="tk-nhan">{nhan}</div>
      <div className="tk-so">{giaTri}</div>
      <div className="tk-phu">{phu}</div>
    </div>
  );
}

// Biểu đồ cột chồng: dịch vụ + sản phẩm theo từng kỳ
function BieuDoCot({ cacKy }) {
  const max = Math.max(...cacKy.map((k) => k.doanhThu), 1);
  const buoc = Math.ceil(cacKy.length / 8);
  return (
    <div className="tk-cot-wrap">
      {cacKy.map((k, i) => (
        <div
          className="tk-cot"
          key={k.nhan}
          title={`${k.nhan}: ${TIEN(k.doanhThu)} (${k.soGiaoDich} giao dịch)\nDịch vụ: ${TIEN(k.dichVu)} | Sản phẩm: ${TIEN(k.sanPham)}`}
        >
          <div className="tk-cot-track">
            <div className="tk-cot-fill">
              <span style={{ height: `${(k.sanPham / max) * 100}%`, background: "#9ad1c2" }} />
              <span style={{ height: `${(k.dichVu / max) * 100}%`, background: "#f2a65a" }} />
            </div>
          </div>
          <div className="tk-cot-nhan">
            <span>{i % buoc === 0 ? k.nhan : ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Biểu đồ cột đơn giản (số lịch theo thứ, theo giờ); cột cao nhất được tô nổi bật
function CotDon({ ds }) {
  const max = Math.max(...ds.map((d) => d.giaTri), 1);
  return (
    <div className="tk-cot-wrap tk-cot-thap">
      {ds.map((d) => (
        <div className="tk-cot" key={d.nhan} title={`${d.nhan}: ${d.giaTri} lịch`}>
          <div className="tk-cot-so">{d.giaTri || ""}</div>
          <div className="tk-cot-track">
            <div className="tk-cot-fill">
              <span
                style={{
                  height: `${(d.giaTri / max) * 100}%`,
                  background: d.giaTri === max && max > 0 ? "#f2a65a" : "rgba(255,255,255,0.55)",
                }}
              />
            </div>
          </div>
          <div className="tk-cot-nhan">
            <span>{d.nhan}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Thanh ngang xếp hạng
function ThanhNgang({ ds, dinhDang = TIEN }) {
  const max = Math.max(...ds.map((d) => d.giaTri), 1);
  return (
    <div>
      {ds.map((d) => (
        <div className="tk-hang" key={d.ten}>
          <div className="tk-hang-dau">
            <span>{d.ten}</span>
            <strong>{dinhDang(d.giaTri)}</strong>
          </div>
          <div className="tk-hang-nen">
            <div className="tk-hang-thanh" style={{ width: `${(d.giaTri / max) * 100}%` }} />
          </div>
          {d.phu && <small>{d.phu}</small>}
        </div>
      ))}
    </div>
  );
}

function Donut({ ds }) {
  const tong = ds.reduce((s, d) => s + d.giaTri, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let daDung = 0;
  return (
    <svg viewBox="0 0 200 200" className="tk-donut">
      <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="26" />
      {tong > 0 &&
        ds.map((d) => {
          const dai = (d.giaTri / tong) * C;
          const el = (
            <circle
              key={d.ten}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={d.mau}
              strokeWidth="26"
              strokeDasharray={`${dai} ${C - dai}`}
              strokeDashoffset={-daDung}
              transform="rotate(-90 100 100)"
            >
              <title>{`${d.ten}: ${TIEN(d.giaTri)}`}</title>
            </circle>
          );
          daDung += dai;
          return el;
        })}
      <text x="100" y="97" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700">
        {TIEN_NGAN(tong)}
      </text>
      <text x="100" y="117" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">
        đã thu
      </text>
    </svg>
  );
}

// ---------- Nhận định tự động rút ra từ số liệu ----------
function tinhNhanDinh(tab, du) {
  const t = du.tongQuan;
  const ds = [];

  if (tab === "tong-quan") {
    if (t.tangTruong === null || t.tangTruong === undefined) {
      ds.push("Chưa có doanh thu ở kỳ liền trước nên chưa so sánh được mức tăng giảm.");
    } else {
      ds.push(
        `Doanh thu ${t.tangTruong >= 0 ? "tăng" : "giảm"} ${Math.abs(t.tangTruong)}% so với kỳ liền trước (${TIEN(t.doanhThuKyTruoc)}).`,
      );
    }
    const dinh = [...du.cacKy].sort((a, b) => b.doanhThu - a.doanhThu)[0];
    if (dinh && dinh.doanhThu > 0) {
      ds.push(`Kỳ có doanh thu cao nhất là ${dinh.nhan} với ${TIEN(dinh.doanhThu)}.`);
    }
    if (t.doanhThu > 0) {
      ds.push(
        `Sản phẩm chiếm ${Math.round((t.tienSanPham / t.doanhThu) * 100)}% doanh thu, phần còn lại đến từ dịch vụ và các khoản phát sinh khi phục vụ.`,
      );
    }
    if (du.congNo.soLich > 0) {
      ds.push(`Còn ${du.congNo.soLich} lịch đã hoàn tất nhưng chưa thu tiền, chưa được tính vào doanh thu.`);
    }
  }

  if (tab === "dich-vu") {
    const tongDV = du.dichVu.reduce((s, d) => s + d.doanhThu, 0);
    if (du.dichVu.length > 0 && tongDV > 0) {
      const dau = du.dichVu[0];
      ds.push(`${dau.ten} dẫn đầu với ${Math.round((dau.doanhThu / tongDV) * 100)}% doanh thu dịch vụ (${dau.soLuot} lượt).`);
      if (du.dichVu.length > 1) {
        const cuoi = du.dichVu[du.dichVu.length - 1];
        ds.push(`${cuoi.ten} có doanh thu thấp nhất (${cuoi.soLuot} lượt); có thể cân nhắc khuyến mãi hoặc gói combo để kích cầu.`);
      }
    }
    if (t.dieuChinhGia !== 0) {
      ds.push(
        `Khuyến mãi và phụ thu theo ngày làm doanh thu ${t.dieuChinhGia < 0 ? "giảm" : "tăng"} ${TIEN(Math.abs(t.dieuChinhGia))} trong kỳ.`,
      );
    }
  }

  if (tab === "san-pham") {
    if (du.sanPhamBanChay.length > 0) {
      const dau = du.sanPhamBanChay[0];
      ds.push(`${dau.ten} bán chạy nhất với ${dau.soLuong} sản phẩm, doanh thu ${TIEN(dau.doanhThu)}.`);
    } else {
      ds.push("Chưa có đơn hàng nào được thanh toán trong kỳ này.");
    }
    const k = du.kho;
    const canhBao = k.vatTuSapHet.length + k.vatTuSapHetHan.length + k.sanPhamSapHet.length;
    ds.push(
      canhBao > 0
        ? `Có ${canhBao} cảnh báo kho cần xử lý (vật tư sắp hết, sắp hết hạn hoặc sản phẩm sắp hết hàng).`
        : "Kho hiện không có cảnh báo nào.",
    );
  }

  if (tab === "thanh-toan") {
    const tong = du.thanhToan.reduce((s, d) => s + d.doanhThu, 0);
    if (du.thanhToan.length > 0 && tong > 0) {
      const dau = du.thanhToan[0];
      const ten = (VI[dau.phuongThuc] || VI.TAI_QUAY).ten;
      ds.push(`${ten} là kênh được dùng nhiều nhất, chiếm ${Math.round((dau.doanhThu / tong) * 100)}% số tiền đã thu.`);
    }
    if (du.congNo.soLich > 0) {
      ds.push(`Công nợ: ${du.congNo.soLich} lịch hoàn tất chưa thanh toán, tạm tính ${TIEN(du.congNo.soTien)}. Nên nhắc khách hoặc thu tại quầy.`);
    } else {
      ds.push("Không có công nợ: mọi lịch đã hoàn tất đều đã thu tiền.");
    }
  }

  if (tab === "lich-hen") {
    const l = du.lichHen;
    const nhieu = [...l.theoThu].sort((a, b) => b.soLich - a.soLich)[0];
    const it = [...l.theoThu].sort((a, b) => a.soLich - b.soLich)[0];
    if (nhieu && nhieu.soLich > 0) {
      ds.push(
        `Đông khách nhất vào ${nhieu.nhan} (${nhieu.soLich} lịch), vắng nhất vào ${it.nhan} (${it.soLich} lịch). Đây là cơ sở để điều chỉnh khuyến mãi hoặc phân ca nhân sự.`,
      );
    }
    const gio = [...l.theoGio].sort((a, b) => b.soLich - a.soLich)[0];
    if (gio && gio.soLich > 0) {
      ds.push(`Khung giờ cao điểm là ${gio.gio}h với ${gio.soLich} lịch.`);
    }
    if (l.tong > 0) {
      ds.push(`Tỷ lệ hủy lịch là ${l.tyLeHuy}% (${l.daHuy}/${l.tong} lịch).`);
    }
  }
  return ds;
}

// ---------- Nội dung từng tab ----------
function TabTongQuan({ du }) {
  const t = du.tongQuan;
  return (
    <>
      <div className="tk-luoi">
        <TheSo nhan="Doanh thu đã thu" giaTri={TIEN(t.doanhThu)} phu={<ChipTang phanTram={t.tangTruong} />} />
        <TheSo nhan="Số giao dịch" giaTri={t.soGiaoDich} phu={`Kỳ trước: ${t.soGiaoDichKyTruoc}`} />
        <TheSo nhan="Trung bình mỗi giao dịch" giaTri={TIEN(t.giaTriTrungBinh)} phu="Doanh thu chia số giao dịch" />
        <TheSo nhan="Chờ thu tiền" giaTri={TIEN(du.congNo.soTien)} phu={`${du.congNo.soLich} lịch đã hoàn tất, chưa thanh toán`} />
      </div>
      <div className="tk-glass">
        <div className="tk-the-dau">
          <h2>Doanh thu theo kỳ</h2>
          <div className="tk-chu-thich">
            <i style={{ background: "#f2a65a" }} /> Dịch vụ <i style={{ background: "#9ad1c2" }} /> Sản phẩm
          </div>
        </div>
        <BieuDoCot cacKy={du.cacKy} />
      </div>
    </>
  );
}

function TabDichVu({ du }) {
  const t = du.tongQuan;
  const dong = [
    ["Giá niêm yết dịch vụ", t.tienDichVuNiemYet],
    ["Khuyến mãi / phụ thu theo ngày", t.dieuChinhGia],
    ["Phát sinh khi phục vụ (thuốc, vật tư...)", t.phatSinh],
    ["Sản phẩm bán kèm", t.tienSanPham],
  ];
  return (
    <div className="tk-luoi tk-luoi-2">
      <div className="tk-glass">
        <h2>Doanh thu theo dịch vụ</h2>
        {du.dichVu.length === 0 ? (
          <p className="tk-rong">Chưa có dịch vụ nào được thanh toán trong kỳ này.</p>
        ) : (
          <ThanhNgang ds={du.dichVu.map((d) => ({ ten: d.ten, giaTri: d.doanhThu, phu: `${d.soLuot} lượt` }))} />
        )}
      </div>
      <div className="tk-glass">
        <h2>Từ giá niêm yết đến tiền thực thu</h2>
        {dong.map(([ten, so]) => (
          <div className="tk-dong" key={ten}>
            <span>{ten}</span>
            <strong>{so < 0 ? "-" : ""}{TIEN(Math.abs(so))}</strong>
          </div>
        ))}
        <div className="tk-dong tk-dong-tong">
          <span>Tổng thực thu</span>
          <strong>{TIEN(t.doanhThu)}</strong>
        </div>
      </div>
    </div>
  );
}

function TabSanPham({ du }) {
  const k = du.kho;
  return (
    <div className="tk-luoi tk-luoi-2">
      <div className="tk-glass">
        <h2>Sản phẩm bán chạy</h2>
        {du.sanPhamBanChay.length === 0 ? (
          <p className="tk-rong">Chưa có đơn hàng nào được thanh toán trong kỳ này.</p>
        ) : (
          <ThanhNgang ds={du.sanPhamBanChay.map((d) => ({ ten: d.ten, giaTri: d.doanhThu, phu: `${d.soLuong} đã bán` }))} />
        )}
        <div className="tk-dong tk-dong-tong">
          <span>Giá trị sản phẩm đang tồn kho</span>
          <strong>{TIEN(k.giaTriTonSanPham)}</strong>
        </div>
      </div>
      <div className="tk-glass">
        <h2>Cảnh báo kho</h2>
        <h3 className="tk-tieu-de-nho">Thuốc và vật tư sắp hết</h3>
        {k.vatTuSapHet.length === 0 ? (
          <p className="tk-rong">Không có.</p>
        ) : (
          k.vatTuSapHet.map((v) => (
            <div className="tk-dong" key={v.ten}>
              <span>{v.ten}</span>
              <strong>{v.ton} {v.donVi} (mức cảnh báo {v.mucCanhBao})</strong>
            </div>
          ))
        )}
        <h3 className="tk-tieu-de-nho">Sắp hết hạn trong 30 ngày</h3>
        {k.vatTuSapHetHan.length === 0 ? (
          <p className="tk-rong">Không có.</p>
        ) : (
          k.vatTuSapHetHan.map((v) => (
            <div className="tk-dong" key={v.ten}>
              <span>{v.ten}</span>
              <strong>{v.daHetHan ? "Đã hết hạn" : NGAY(v.hanSuDung)}</strong>
            </div>
          ))
        )}
        <h3 className="tk-tieu-de-nho">Sản phẩm bán sắp hết hàng</h3>
        {k.sanPhamSapHet.length === 0 ? (
          <p className="tk-rong">Không có.</p>
        ) : (
          k.sanPhamSapHet.map((s) => (
            <div className="tk-dong" key={s.ten}>
              <span>{s.ten}</span>
              <strong>còn {s.ton}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TabThanhToan({ du }) {
  const ds = du.thanhToan.map((d) => {
    const vi = VI[d.phuongThuc] || VI.TAI_QUAY;
    return { ten: vi.ten, mau: vi.mau, giaTri: d.doanhThu, soGiaoDich: d.soGiaoDich };
  });
  return (
    <div className="tk-luoi tk-luoi-2">
      <div className="tk-glass">
        <h2>Cơ cấu theo phương thức thanh toán</h2>
        {ds.length === 0 ? (
          <p className="tk-rong">Chưa có khoản nào đã thu trong kỳ này.</p>
        ) : (
          <div className="tk-donut-khung">
            <Donut ds={ds} />
            <div>
              {ds.map((d) => (
                <div className="tk-chu-giai" key={d.ten}>
                  <i style={{ background: d.mau }} />
                  <span>{d.ten}</span>
                  <strong>{TIEN(d.giaTri)}</strong>
                  <small>{d.soGiaoDich} giao dịch</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="tk-glass">
        <h2>Công nợ</h2>
        <div className="tk-so">{TIEN(du.congNo.soTien)}</div>
        <p className="tk-phu">
          {du.congNo.soLich} lịch đã hoàn tất nhưng chưa thanh toán. Khoản này chưa được tính vào doanh thu
          cho đến khi khách thanh toán.
        </p>
      </div>
    </div>
  );
}

function TabLichHen({ du }) {
  const l = du.lichHen;
  return (
    <>
      <div className="tk-luoi">
        <TheSo nhan="Tổng lịch hẹn trong kỳ" giaTri={l.tong} phu="Không phân biệt trạng thái" />
        <TheSo nhan="Đã hoàn tất" giaTri={l.hoanTat} phu="Lịch đã phục vụ xong" />
        <TheSo nhan="Đang chờ / đã xác nhận" giaTri={l.dangCho} phu="Chưa thực hiện" />
        <TheSo nhan="Tỷ lệ hủy" giaTri={`${l.tyLeHuy}%`} phu={`${l.daHuy} lịch bị hủy`} />
      </div>
      <div className="tk-luoi tk-luoi-2">
        <div className="tk-glass">
          <h2>Số lịch theo thứ trong tuần</h2>
          <CotDon ds={l.theoThu.map((d) => ({ nhan: d.nhan, giaTri: d.soLich }))} />
        </div>
        <div className="tk-glass">
          <h2>Số lịch theo giờ trong ngày</h2>
          <CotDon ds={l.theoGio.map((d) => ({ nhan: `${d.gio}h`, giaTri: d.soLich }))} />
        </div>
      </div>
    </>
  );
}

// ---------- Trang chính ----------
function AdminStatistics() {
  const [kyHan, setKyHan] = useState("thang");
  const [tab, setTab] = useState("tong-quan");
  const [du, setDu] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let huy = false;
    setDu(null);
    setError(null);
    getThongKe(kyHan)
      .then((res) => {
        if (!huy) setDu(res.data);
      })
      .catch((err) => {
        if (!huy) setError(err.response?.data?.message || "Không tải được số liệu thống kê.");
      });
    return () => {
      huy = true;
    };
  }, [kyHan]);

  const moTaKy = KY_HAN.find((k) => k.ma === kyHan)?.moTa;
  const nhanDinh = du ? tinhNhanDinh(tab, du) : [];
  const chuaCoThu = du && du.tongQuan.doanhThu === 0 && ["tong-quan", "dich-vu", "thanh-toan"].includes(tab);

  return (
    <div className="tk-wrap">
      <div className="tk-dau">
        <div>
          <h1>Thống kê và phân tích</h1>
          {du && (
            <p className="tk-phu">
              Từ {NGAY(du.tuNgay)} đến {NGAY(du.denNgay)} ({moTaKy}). Doanh thu chỉ tính khoản đã thanh toán.
            </p>
          )}
        </div>
        <div className="tk-doi-ky">
          {KY_HAN.map((k) => (
            <button key={k.ma} className={kyHan === k.ma ? "active" : ""} onClick={() => setKyHan(k.ma)}>
              {k.nhan}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {!du && !error && <p>Đang tải dữ liệu...</p>}

      {du && (
        <div>
          {chuaCoThu && (
            <div className="tk-glass tk-luu-y">
              Chưa có khoản nào đã thanh toán trong khoảng này. Hãy thanh toán thử vài hóa đơn để thấy biểu đồ.
            </div>
          )}
          {tab === "tong-quan" && <TabTongQuan du={du} />}
          {tab === "dich-vu" && <TabDichVu du={du} />}
          {tab === "san-pham" && <TabSanPham du={du} />}
          {tab === "thanh-toan" && <TabThanhToan du={du} />}
          {tab === "lich-hen" && <TabLichHen du={du} />}

          {nhanDinh.length > 0 && (
            <div className="tk-glass tk-nhan-dinh">
              <h2>Nhận định</h2>
              {nhanDinh.map((c) => (
                <p key={c}>{c}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="tk-dock">
        {TAB.map((t) => (
          <button key={t.ma} className={tab === t.ma ? "active" : ""} onClick={() => setTab(t.ma)}>
            {t.nhan}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default AdminStatistics;