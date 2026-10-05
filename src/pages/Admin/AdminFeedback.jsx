// Trang Admin xem và trả lời phản hồi của khách hàng
import { useEffect, useState } from "react";
import { getAllFeedback, replyFeedback } from "../../services/api";

const LOAI = { DanhGia: "Đánh giá", KhieuNai: "Khiếu nại", GopY: "Góp ý" };
const CLASS_LOAI = {
  DanhGia: "fb-badge-danhgia",
  KhieuNai: "fb-badge-khieunai",
  GopY: "fb-badge-gopy",
};

function AdminFeedback() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("tatca"); // tatca | chuaxuly
  const [replies, setReplies] = useState({});
  const [error, setError] = useState(null);

  const loadData = () => {
    getAllFeedback()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const danhGia = list.filter((f) => f.loai === "DanhGia" && f.soSao);
  const trungBinh = danhGia.length
    ? (danhGia.reduce((s, f) => s + f.soSao, 0) / danhGia.length).toFixed(1)
    : null;
  const chuaXuLy = list.filter((f) => !f.daXuLy).length;
  const hienThi = filter === "chuaxuly" ? list.filter((f) => !f.daXuLy) : list;

  const handleReply = async (f) => {
    const text = (replies[f.id] ?? f.traLoi ?? "").trim();
    if (!text) return;
    setError(null);
    try {
      await replyFeedback(f.id, text);
      setReplies({ ...replies, [f.id]: undefined });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Gửi trả lời thất bại.");
    }
  };

  return (
    <div>
      <h1>Phản hồi của khách hàng</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="profile-stats" style={{ maxWidth: 560 }}>
        <div className="profile-stat">
          <strong>{list.length}</strong>
          <span>Tổng phản hồi</span>
        </div>
        <div className="profile-stat">
          <strong>{chuaXuLy}</strong>
          <span>Chưa xử lý</span>
        </div>
        <div className="profile-stat">
          <strong>{trungBinh ? `${trungBinh} ★` : "—"}</strong>
          <span>Điểm đánh giá TB</span>
        </div>
      </div>

      <div className="feedback-type">
        <button
          type="button"
          className={filter === "tatca" ? "active" : ""}
          onClick={() => setFilter("tatca")}
        >
          Tất cả
        </button>
        <button
          type="button"
          className={filter === "chuaxuly" ? "active" : ""}
          onClick={() => setFilter("chuaxuly")}
        >
          Chưa xử lý
        </button>
      </div>

      {hienThi.length === 0 && <p>Không có phản hồi nào.</p>}
      {hienThi.map((f) => (
        <div key={f.id} className="feedback-card">
          <div className="feedback-meta">
            <span className={`fb-badge ${CLASS_LOAI[f.loai]}`}>
              {LOAI[f.loai]}
            </span>
            {f.soSao ? (
              <span className="stars">
                {"★".repeat(f.soSao)}
                {"☆".repeat(5 - f.soSao)}
              </span>
            ) : null}
            <span>{new Date(f.ngayTao).toLocaleString("vi-VN")}</span>
            <span
              className={`fb-badge ${f.daXuLy ? "fb-badge-danhgia" : "fb-badge-cho"}`}
            >
              {f.daXuLy ? "Đã trả lời" : "Chưa xử lý"}
            </span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem" }}>
            <strong>{f.tenKhach}</strong> · {f.email}
            {f.soDienThoai ? ` · ${f.soDienThoai}` : ""}
          </p>
          <h4>{f.tieuDe}</h4>
          <p>{f.noiDung}</p>

          <textarea
            className="feedback-textarea"
            placeholder="Nhập nội dung trả lời khách hàng..."
            value={replies[f.id] ?? f.traLoi ?? ""}
            onChange={(e) => setReplies({ ...replies, [f.id]: e.target.value })}
          />
          <button
            type="button"
            className="btn-small"
            style={{ marginTop: 10 }}
            onClick={() => handleReply(f)}
          >
            {f.daXuLy ? "Cập nhật trả lời" : "Gửi trả lời"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminFeedback;
