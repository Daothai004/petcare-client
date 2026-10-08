// trang quản lý lịch hẹn
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, updateAppointmentStatus } from "../../services/api";

const TEN_TRANG_THAI = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
  2: "Hoàn tất",
  3: "Đã hủy",
};

function AdminAppointments() {
  // Nhân viên, Bác sĩ và Admin đều được xác nhận / hoàn tất / hủy lịch hẹn
  const coQuyenCapNhat = ["NhanVien", "BacSiThuY", "QuanTriVien"].includes(
    localStorage.getItem("vaiTro"),
  );
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  const loadData = () => {
    getAppointments()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangeStatus = async (id, trangThaiMoi) => {
    try {
      await updateAppointmentStatus(id, trangThaiMoi);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật thất bại.");
    }
  };

  return (
    <div>
      <h1>Quản lý lịch hẹn</h1>
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
              {coQuyenCapNhat && <th>Hành động</th>}
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
                {coQuyenCapNhat && (
                  <td className="admin-table-actions">
                    <Link to={`/admin/hoa-don/${lh.id}`} className="btn-small">
                      Biên lai
                    </Link>
                    {lh.trangThai === 0 && (
                      <button
                        className="btn-small"
                        onClick={() => handleChangeStatus(lh.id, 1)}
                      >
                        Xác nhận
                      </button>
                    )}
                    {lh.trangThai === 1 && (
                      <button
                        className="btn-small"
                        onClick={() => handleChangeStatus(lh.id, 2)}
                      >
                        Hoàn tất
                      </button>
                    )}
                    {lh.trangThai !== 3 && lh.trangThai !== 2 && (
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleChangeStatus(lh.id, 3)}
                      >
                        Hủy
                      </button>
                    )}
                    {(lh.trangThai === 2 || lh.trangThai === 3) && (
                      <span style={{ color: "var(--color-ink-soft)" }}>—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointments;
