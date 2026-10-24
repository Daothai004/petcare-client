// trang chatbot
import { useState, useRef, useEffect } from "react";
import { askChatbot } from "../services/api";

const GOI_Y_DAU = [
  "Hướng dẫn đặt lịch",
  "Bảng giá dịch vụ",
  "Gợi ý dịch vụ phù hợp",
];

// Chọn 1-3 câu gợi ý tiếp theo dựa vào câu vừa hỏi
function goiYTiepTheo(cauHoi, cauTraLoi, dangDatLich) {
  // Đang đặt lịch dở: chỉ gợi ý xác nhận / hủy
  if (dangDatLich) {
    if (cauTraLoi.includes("xác nhận")) return ["xác nhận", "hủy"];
    return ["hủy"];
  }

  const q = cauHoi.toLowerCase();

  if (q.includes("gợi ý")) return ["Bảng giá dịch vụ", "Đặt lịch giúp tôi"];
  if (q.includes("giá") || q.includes("dịch vụ"))
    return ["Đặt lịch giúp tôi", "Gợi ý dịch vụ phù hợp"];
  if (q.includes("hủy"))
    return ["Lịch hẹn sắp tới của tôi", "Đặt lịch giúp tôi"];
  if (q.includes("tiêm"))
    return ["Sổ sức khỏe thú cưng", "Lịch hẹn sắp tới của tôi"];
  if (q.includes("sổ sức khỏe"))
    return ["Khi nào tiêm nhắc lại?", "Đặt lịch giúp tôi"];
  if (q.includes("lịch hẹn")) return ["Khi nào tiêm nhắc lại?", "Hủy lịch hẹn"];
  if (q.includes("giờ mở cửa"))
    return ["Hướng dẫn đặt lịch", "Bảng giá dịch vụ"];
  if (q.includes("đăng nhập") || q.includes("đăng ký"))
    return ["Thêm thú cưng thế nào?", "Hướng dẫn đặt lịch"];
  if (q.includes("thú cưng"))
    return ["Hướng dẫn đặt lịch", "Gợi ý dịch vụ phù hợp"];
  if (q.includes("đặt lịch") || q.includes("hướng dẫn"))
    return ["Bảng giá dịch vụ", "Đặt lịch giúp tôi", "Giờ mở cửa"];

  return GOI_Y_DAU;
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Tôi là trợ lý ảo PetCare. Tôi có thể tư vấn và đặt lịch giúp bạn, bạn cần gì nào?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Thông tin đặt lịch đang dở do server trả về, gửi lại ở lượt sau để bot nhớ mạch trò chuyện
  const [nguCanh, setNguCanh] = useState(null);
  const cuoiDanhSach = useRef(null);
  const [goiY, setGoiY] = useState(GOI_Y_DAU);

  useEffect(() => {
    cuoiDanhSach.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const guiCauHoi = async (noiDung) => {
    const cauHoi = noiDung.trim();
    if (!cauHoi || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: cauHoi }]);
    setInput("");
    setGoiY([]);
    setLoading(true);

    try {
      const res = await askChatbot(cauHoi, nguCanh);
      const cauTraLoi = res.data.cauTraLoi;
      const nguCanhMoi = res.data.nguCanh ?? null;
      setMessages((prev) => [...prev, { role: "bot", text: cauTraLoi }]);
      setNguCanh(nguCanhMoi);
      setGoiY(goiYTiepTheo(cauHoi, cauTraLoi, nguCanhMoi !== null));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Xin lỗi, hiện không kết nối được, bạn thử lại sau nhé.",
        },
      ]);
      setGoiY(GOI_Y_DAU);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    guiCauHoi(input);
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Trợ lý PetCare</span>
            <button onClick={() => setOpen(false)} aria-label="Đóng chat">
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}
                style={{ whiteSpace: "pre-line" }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-bot">Đang trả lời...</div>
            )}
            <div ref={cuoiDanhSach} />
          </div>

          {!loading && goiY.length > 0 && (
            <div className="chat-goi-y">
              {goiY.map((g) => (
                <button type="button" key={g} onClick={() => guiCauHoi(g)}>
                  {g}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
            />
            <button type="submit">Gửi</button>
          </form>
        </div>
      )}

      <button
        className="chat-toggle-btn"
        onClick={() => setOpen(!open)}
        aria-label="Mở chat"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default ChatWidget;
