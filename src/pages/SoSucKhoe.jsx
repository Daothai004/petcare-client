// Sổ sức khỏe thú cưng - khách hàng chỉ xem, không sửa
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSucKhoe } from "../services/api";

const ngay = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—");

function SoSucKhoe() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSucKhoe(id)
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Không tải được sổ sức khỏe."),
      );
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
        <Link to="/thu-cung-cua-toi">← Quay lại danh sách thú cưng</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <p>Đang tải sổ sức khỏe...</p>
      </div>
    );
  }

  const { thuCung, benhAns, tiemPhongs, phauThuats } = data;

  // Các mũi tiêm nhắc lại từ hôm nay trở đi, gần nhất xếp trước
  const homNay = new Date();
  homNay.setHours(0, 0, 0, 0);
  const sapTiem = tiemPhongs
    .filter((t) => t.ngayTiemNhacLai && new Date(t.ngayTiemNhacLai) >= homNay)
    .sort((a, b) => new Date(a.ngayTiemNhacLai) - new Date(b.ngayTiemNhacLai));

  return (
    <div className="page">
      <p>
        <Link to="/thu-cung-cua-toi">← Quay lại danh sách thú cưng</Link>
      </p>
      <h1>Sổ sức khỏe của {thuCung.tenThuCung}</h1>
      <p>
        {thuCung.loai}
        {thuCung.giong ? ` · ${thuCung.giong}` : ""} · {thuCung.canNang} kg
      </p>

      {sapTiem.length > 0 && (
        <div className="alert alert-success">
          <strong>Lịch tiêm nhắc lại sắp tới:</strong>
          <ul style={{ margin: "6px 0 0 18px" }}>
            {sapTiem.map((t) => (
              <li key={t.id}>
                {t.loaiVaccine} (sau mũi {t.muiSo}) — ngày{" "}
                {ngay(t.ngayTiemNhacLai)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="section-title">Bệnh án &amp; đơn thuốc</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày khám</th>
              <th>Chẩn đoán</th>
              <th>Thuốc kê đơn</th>
              <th>Ghi chú</th>
              <th>Bác sĩ</th>
            </tr>
          </thead>
          <tbody>
            {benhAns.map((b) => (
              <tr key={b.id}>
                <td>{ngay(b.ngayKham)}</td>
                <td>{b.chanDoan}</td>
                <td>{b.thuocKeDon || "—"}</td>
                <td>{b.ghiChu || "—"}</td>
                <td>{b.tenBacSi}</td>
              </tr>
            ))}
            {benhAns.length === 0 && (
              <tr>
                <td colSpan="5">Chưa có bệnh án nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Lịch sử tiêm phòng</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày tiêm</th>
              <th>Loại vắc-xin</th>
              <th>Mũi số</th>
              <th>Tiêm nhắc lại</th>
              <th>Ghi chú</th>
              <th>Bác sĩ</th>
            </tr>
          </thead>
          <tbody>
            {tiemPhongs.map((t) => (
              <tr key={t.id}>
                <td>{ngay(t.ngayTiem)}</td>
                <td>{t.loaiVaccine}</td>
                <td>{t.muiSo}</td>
                <td>{ngay(t.ngayTiemNhacLai)}</td>
                <td>{t.ghiChu || "—"}</td>
                <td>{t.tenBacSi}</td>
              </tr>
            ))}
            {tiemPhongs.length === 0 && (
              <tr>
                <td colSpan="6">Chưa có mũi tiêm nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Lịch sử phẫu thuật</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Ca phẫu thuật</th>
              <th>Phương pháp</th>
              <th>Kết quả</th>
              <th>Ghi chú</th>
              <th>Bác sĩ</th>
            </tr>
          </thead>
          <tbody>
            {phauThuats.map((p) => (
              <tr key={p.id}>
                <td>{ngay(p.ngayPhauThuat)}</td>
                <td>{p.tenCaPhauThuat}</td>
                <td>{p.phuongPhapThucHien || "—"}</td>
                <td>{p.ketQua || "—"}</td>
                <td>{p.ghiChu || "—"}</td>
                <td>{p.tenBacSi}</td>
              </tr>
            ))}
            {phauThuats.length === 0 && (
              <tr>
                <td colSpan="6">Chưa có ca phẫu thuật nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SoSucKhoe;
