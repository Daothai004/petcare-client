// trang chatbot
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { askChatbot } from "../services/api";
import { addToCart } from "../services/cart";

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
  if (q.includes("đổi giờ") || q.includes("đổi lịch"))
    return ["Lịch hẹn sắp tới của tôi", "Hướng dẫn đặt lịch"];
  if (
    q.includes("giỏ") ||
    q.includes("sản phẩm") ||
    q.includes("thức ăn") ||
    q.includes("mua")
  )
    return [
      "Gợi ý thức ăn cho chó",
      "Gợi ý đồ dùng cho mèo",
      "Bảng giá dịch vụ",
    ];
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
// In đậm ** ** và biến [chữ](đường dẫn) thành liên kết bấm được
function dongThanhPhan(s) {
  return s.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    const lk = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lk) {
      return lk[2].startsWith("/") ? (
        <Link key={i} to={lk[2]} className="chat-lien-ket">
          {lk[1]}
        </Link>
      ) : (
        <a
          key={i}
          href={lk[2]}
          target="_blank"
          rel="noreferrer"
          className="chat-lien-ket"
        >
          {lk[1]}
        </a>
      );
    }
    return p;
  });
}

// Chia câu trả lời thành đoạn văn và gạch đầu dòng (dấu chân) cho dễ đọc
function NoiDungChat({ text }) {
  let dong = String(text)
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);

  // Câu trả lời dài viết liền một khối: tự tách theo câu
  if (dong.length === 1 && dong[0].length > 150) {
    const cau = dong[0]
      .replace(/([^\d\s][.!?])\s+/g, "$1\n")
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cau.length >= 3) {
      const cuoi = cau[cau.length - 1];
      const laCauHoi = cuoi.endsWith("?");
      const giua = laCauHoi ? cau.slice(1, -1) : cau.slice(1);
      dong = [
        cau[0],
        ...giua.map((c) => "- " + c),
        ...(laCauHoi ? [cuoi] : []),
      ];
    }
  }

  // Gom các dòng bắt đầu bằng "- " thành một danh sách
  const khoi = [];
  dong.forEach((d) => {
    if (/^[-•]\s+/.test(d)) {
      const muc = d.replace(/^[-•]\s+/, "");
      const truoc = khoi[khoi.length - 1];
      if (truoc && truoc.loai === "ds") truoc.muc.push(muc);
      else khoi.push({ loai: "ds", muc: [muc] });
    } else {
      khoi.push({ loai: "doan", noiDung: d });
    }
  });

  return khoi.map((k, i) =>
    k.loai === "ds" ? (
      <ul className="chat-ds" key={i}>
        {k.muc.map((m, j) => (
          <li key={j}>{dongThanhPhan(m)}</li>
        ))}
      </ul>
    ) : (
      <p key={i}>{dongThanhPhan(k.noiDung)}</p>
    ),
  );
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
      if (res.data.hanhDong?.loai === "them_gio") {
        addToCart(res.data.hanhDong.sanPhamId, res.data.hanhDong.soLuong);
      }
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

          <div
            className="chat-messages"
            onClick={(e) =>
              e.target.closest("a.chat-lien-ket") && setOpen(false)
            }
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}
              >
                {m.role === "bot" ? <NoiDungChat text={m.text} /> : m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-bot">Đang trả lời...</div>
            )}
            {!loading && goiY.length > 0 && (
              <div className="chat-goi-y">
                {goiY.map((g) => (
                  <button type="button" key={g} onClick={() => guiCauHoi(g)}>
                    {g}
                  </button>
                ))}
              </div>
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
