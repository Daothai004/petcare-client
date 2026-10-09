// trang đơn hàng cho khách hàng
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../services/api";

const TEN_TRANG_THAI = {
  0: "Chờ xử lý",
  1: "Đang giao",
  2: "Đã giao",
  3: "Đã hủy",
};

function MyOrders() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  const loadData = () => {
    getMyOrders()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;
    try {
      await cancelOrder(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Hủy đơn thất bại.");
    }
  };

  return (
    <div className="page">
      <h1>Đơn hàng của tôi</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày đặt</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((dh) => (
              <tr key={dh.id}>
                <td>{new Date(dh.ngayDat).toLocaleString("vi-VN")}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {dh.chiTietDonHangs?.map((ct) => (
                      <li key={ct.id}>
                        {ct.sanPham?.tenSanPham} x{ct.soLuong}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{dh.tongTien.toLocaleString("vi-VN")}đ</td>
                <td>{TEN_TRANG_THAI[dh.trangThai]}</td>
                <td>
                  {dh.daThanhToan ? (
                    <span
                      style={{ color: "var(--color-success)", fontWeight: 600 }}
                    >
                      Đã thanh toán
                    </span>
                  ) : dh.hinhThucThanhToan === "Online" &&
                    dh.trangThai !== 3 ? (
                    <Link
                      to={
                        dh.hoaDonId
                          ? `/thanh-toan/${dh.hoaDonId}`
                          : `/thanh-toan-don-hang/${dh.id}`
                      }
                      className="btn-small"
                    >
                      Thanh toán
                    </Link>
                  ) : (
                    "Thanh toán khi nhận hàng"
                  )}
                </td>
                <td>
                  {dh.trangThai === 0 && (
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleCancel(dh.id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="6">Bạn chưa có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrders;
