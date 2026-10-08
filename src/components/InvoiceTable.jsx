// Bảng biên lai dùng chung cho khách hàng và trang quản trị
const TEN_LOAI = {
  DichVu: "Dịch vụ",
  Thuoc: "Thuốc",
  VacXin: "Vắc-xin",
  SanPham: "Sản phẩm",
  DungCu: "Dụng cụ y tế",
  Khac: "Khác",
};

const TEN_TRANG_THAI = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
  2: "Hoàn tất",
  3: "Đã hủy",
};

const tien = (n) => `${Number(n).toLocaleString("vi-VN")} đ`;

function InvoiceTable({ invoice, onDelete }) {
  return (
    <div className="invoice">
      <div className="invoice-head">
        <div>
          <span>Mã lịch hẹn</span>#{invoice.lichHenId}
        </div>
        <div>
          <span>Thú cưng</span>
          {invoice.tenThuCung}
        </div>
        <div>
          <span>Nhân sự phụ trách</span>
          {invoice.tenNhanSu}
        </div>
        <div>
          <span>Thời gian</span>
          {new Date(invoice.thoiGianBatDau).toLocaleString("vi-VN")}
        </div>
        <div>
          <span>Trạng thái</span>
          {TEN_TRANG_THAI[invoice.trangThai]}
        </div>
        <div>
          <span>Thanh toán</span>
          {invoice.daThanhToan
            ? `Đã thanh toán${
                invoice.ngayThanhToan
                  ? " lúc " +
                    new Date(invoice.ngayThanhToan).toLocaleString("vi-VN")
                  : ""
              }`
            : "Chưa thanh toán"}
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Khoản thu</th>
              <th>Loại</th>
              <th className="invoice-num">SL</th>
              <th className="invoice-num">Đơn giá</th>
              <th className="invoice-num">Thành tiền</th>
              {onDelete && <th className="no-print"></th>}
            </tr>
          </thead>
          <tbody>
            {invoice.chiTiet.map((k, i) => (
              <tr key={`${k.loai}-${k.id}`}>
                <td>{i + 1}</td>
                <td>{k.tenKhoan}</td>
                <td>{TEN_LOAI[k.loai] || k.loai}</td>
                <td className="invoice-num">{k.soLuong}</td>
                <td className="invoice-num">{tien(k.donGia)}</td>
                <td className="invoice-num">{tien(k.thanhTien)}</td>
                {onDelete && (
                  <td className="no-print">
                    {!k.tuDong && (
                      <button
                        className="btn-small btn-danger"
                        onClick={() => onDelete(k.id)}
                      >
                        Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="invoice-total">
        <span>Tổng cộng</span>
        <strong>{tien(invoice.tongCong)}</strong>
      </div>
    </div>
  );
}

export default InvoiceTable;
