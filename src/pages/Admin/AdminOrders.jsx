// trang quản lý đơn hàng
import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  hoanTraDonHang,
  thanhToanDonHang,
} from "../../services/api";

function AdminOrders() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAllOrders()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, trangThaiMoi) => {
    try {
      await updateOrderStatus(id, Number(trangThaiMoi));
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại.");
    }
  };

  const handleCancel = async (id) => {
    const lyDo = prompt("Lý do hủy đơn (có thể để trống):");
    if (lyDo === null) return;
    try {
      await cancelOrder(id, lyDo);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Hủy đơn thất bại.");
    }
  };
  const handleReturn = async (id) => {
    const lyDo = prompt(
      "Lý do hoàn trả (ví dụ: khách từ chối nhận hàng, không liên lạc được):",
    );
    if (lyDo === null) return;
    try {
      await hoanTraDonHang(id, lyDo);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Hoàn trả thất bại.");
    }
  };
  const handleMarkPaid = async (id) => {
    if (!confirm("Xác nhận đơn hàng này đã được thanh toán?")) return;
    try {
      await thanhToanDonHang(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật thất bại.");
    }
  };

  return (
    <div>
      <h1>Quản lý đơn hàng</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Địa chỉ nhận</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((dh) => (
              <tr key={dh.id}>
                <td>{new Date(dh.ngayDat).toLocaleString("vi-VN")}</td>
                <td>{dh.nguoiDung?.hoTen}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {dh.chiTietDonHangs?.map((ct) => (
                      <li key={ct.id}>
                        {ct.sanPham?.tenSanPham} x{ct.soLuong}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{dh.diaChiNhan}</td>
                <td>{dh.tongTien.toLocaleString("vi-VN")}đ</td>
                <td>
                  {dh.daThanhToan ? (
                    <span
                      style={{ color: "var(--color-success)", fontWeight: 600 }}
                    >
                      Đã thanh toán ({dh.hinhThucThanhToan})
                    </span>
                  ) : (
                    <>
                      <div>Chưa TT ({dh.hinhThucThanhToan})</div>
                      {dh.trangThai < 3 && (
                        <button
                          className="btn-small"
                          onClick={() => handleMarkPaid(dh.id)}
                        >
                          Đánh dấu đã TT
                        </button>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {dh.trangThai === 3 || dh.trangThai === 4 ? (
                    <div>
                      <strong>
                        {dh.trangThai === 3 ? "Đã hủy" : "Hoàn trả"}
                      </strong>
                      {dh.lyDoHuyHoan && (
                        <div style={{ fontSize: 12 }}>
                          Lý do: {dh.lyDoHuyHoan}
                        </div>
                      )}
                    </div>
                  ) : (
                    <select
                      value={dh.trangThai}
                      onChange={(e) =>
                        handleStatusChange(dh.id, e.target.value)
                      }
                    >
                      <option value={0}>Chờ xử lý</option>
                      <option value={1}>Đang giao</option>
                      <option value={2}>Đã giao</option>
                    </select>
                  )}
                </td>
                <td className="admin-table-actions">
                  {(dh.trangThai === 0 || dh.trangThai === 1) && (
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleCancel(dh.id)}
                    >
                      Hủy
                    </button>
                  )}
                  {(dh.trangThai === 1 || dh.trangThai === 2) &&
                    !dh.hoaDonId && (
                      <button
                        className="btn-small"
                        onClick={() => handleReturn(dh.id)}
                      >
                        Hoàn trả
                      </button>
                    )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="8">Chưa có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
