// trang lịch hẹn cho khách hàng
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAppointments, cancelAppointment } from "../services/api";

const TEN_TRANG_THAI = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
  2: "Hoàn tất",
  3: "Đã hủy",
};

function MyAppointments() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  const loadData = () => {
    getMyAppointments()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return;
    try {
      await cancelAppointment(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Hủy lịch thất bại.");
    }
  };

  return (
    <div className="page">
      <h1>Lịch hẹn của tôi</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thú cưng</th>
              <th>Dịch vụ</th>
              <th>Nhân sự</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((lh) => (
              <tr key={lh.id}>
                <td>{lh.thuCung?.tenThuCung}</td>
                <td>{lh.dichVu?.tenDichVu}</td>
                <td>{lh.nhanSu?.hoTen}</td>
                <td>{new Date(lh.thoiGianBatDau).toLocaleString("vi-VN")}</td>
                <td>{TEN_TRANG_THAI[lh.trangThai]}</td>
                <td>
                  {lh.daThanhToan ? (
                    <span
                      style={{ color: "var(--color-success)", fontWeight: 600 }}
                    >
                      Đã thanh toán
                    </span>
                  ) : (
                    lh.trangThai !== 3 && (
                      <Link to={`/thanh-toan/${lh.id}`} className="btn-small">
                        Thanh toán
                      </Link>
                    )
                  )}
                </td>
                <td>
                  {lh.trangThai !== 2 &&
                    lh.trangThai !== 3 &&
                    !lh.daThanhToan && (
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleCancel(lh.id)}
                      >
                        Hủy lịch
                      </button>
                    )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="7">Bạn chưa có lịch hẹn nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyAppointments;
