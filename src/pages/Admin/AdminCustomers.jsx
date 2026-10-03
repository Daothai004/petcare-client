// trang xem danh sách khách hàng
import { useEffect, useState } from "react";
import { getCustomers } from "../../services/api";

function AdminCustomers() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomers()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <div>
      <h1>Danh sách khách hàng</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.hoTen}</td>
                <td>{c.email}</td>
                <td>{c.soDienThoai}</td>
                <td>{new Date(c.ngayTao).toLocaleDateString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCustomers;
