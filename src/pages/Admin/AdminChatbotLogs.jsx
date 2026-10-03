// trang xem lịch sử hội thoại
import { useEffect, useState } from "react";
import { getChatbotLogs } from "../../services/api";

function AdminChatbotLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getChatbotLogs()
      .then((res) => setLogs(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <div>
      <h1>Lịch sử hội thoại Chatbot</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người hỏi</th>
              <th>Câu hỏi</th>
              <th>Câu trả lời</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{new Date(l.thoiGian).toLocaleString("vi-VN")}</td>
                <td>{l.nguoiDung?.hoTen || "Khách (chưa đăng nhập)"}</td>
                <td>{l.cauHoi}</td>
                <td>{l.cauTraLoi}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4">Chưa có lượt hỏi nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminChatbotLogs;
