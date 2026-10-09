// Biên lai gộp: dịch vụ + thuốc/vật tư phát sinh + sản phẩm
import { Fragment } from "react";

const NHOM = [
  { khoa: "DichVu", ten: "Dịch vụ" },
  { khoa: "KhoanThu", ten: "Thuốc, vật tư & khoản phát sinh" },
  { khoa: "SanPham", ten: "Sản phẩm" },
];

const TEN_LOAI = {
  Thuoc: "Thuốc",
  VacXin: "Vắc-xin",
  DungCu: "Dụng cụ y tế",
  Khac: "Khác",
};

const tien = (n) => `${Number(n).toLocaleString("vi-VN")} đ`;

function HoaDonView({ hoaDon }) {
  return (
    <div className="invoice">
      <div className="invoice-head">
        <div>
          <span>Mã hóa đơn</span>#{hoaDon.id}
        </div>
        <div>
          <span>Ngày tạo</span>
          {new Date(hoaDon.ngayTao).toLocaleString("vi-VN")}
        </div>
        <div>
          <span>Thanh toán</span>
          {hoaDon.daThanhToan
            ? `Đã thanh toán${
                hoaDon.ngayThanhToan
                  ? " lúc " +
                    new Date(hoaDon.ngayThanhToan).toLocaleString("vi-VN")
                  : ""
              }`
            : "Chưa thanh toán"}
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khoản thu</th>
              <th>Chi tiết</th>
              <th className="invoice-num">SL</th>
              <th className="invoice-num">Đơn giá</th>
              <th className="invoice-num">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {NHOM.map((n) => {
              const dong = hoaDon.chiTiet.filter((d) => d.nhom === n.khoa);
              if (dong.length === 0) return null;
              const tamTinh = dong.reduce((s, d) => s + d.thanhTien, 0);
              return (
                <Fragment key={n.khoa}>
                  <tr className="invoice-group">
                    <td colSpan="5">{n.ten}</td>
                  </tr>
                  {dong.map((d, i) => (
                    <tr key={i}>
                      <td>{d.tenKhoan}</td>
                      <td>
                        {n.khoa === "KhoanThu"
                          ? `${TEN_LOAI[d.loai] || d.loai} · ${d.moTa}`
                          : d.moTa}
                      </td>
                      <td className="invoice-num">{d.soLuong}</td>
                      <td className="invoice-num">{tien(d.donGia)}</td>
                      <td className="invoice-num">{tien(d.thanhTien)}</td>
                    </tr>
                  ))}
                  <tr className="invoice-subtotal">
                    <td colSpan="4">Cộng {n.ten.toLowerCase()}</td>
                    <td className="invoice-num">{tien(tamTinh)}</td>
                  </tr>
                </Fragment>
              );
            })}
            {hoaDon.chiTiet.length === 0 && (
              <tr>
                <td colSpan="5">Hóa đơn chưa có khoản nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="invoice-total">
        <span>Tổng cộng</span>
        <strong>{tien(hoaDon.tongCong)}</strong>
      </div>
    </div>
  );
}

export default HoaDonView;
