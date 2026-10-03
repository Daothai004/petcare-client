// trang chatbot
import { useState, useRef, useEffect } from "react";
import { askChatbot } from "../services/api";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Tôi là trợ lý ảo PetCare. Bạn cần hỏi gì nào?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const cuoiDanhSach = useRef(null);

  useEffect(() => {
    cuoiDanhSach.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const cauHoi = input.trim();
    if (!cauHoi) return;

    setMessages((prev) => [...prev, { role: "user", text: cauHoi }]);
    setInput("");
    setLoading(true);

    try {
      const res = await askChatbot(cauHoi);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.cauTraLoi },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Xin lỗi, hiện không kết nối được, bạn thử lại sau nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
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
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-bot">Đang trả lời...</div>
            )}
            <div ref={cuoiDanhSach} />
          </div>

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
