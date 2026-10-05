// Trang phản hồi của khách hàng: đánh giá, khiếu nại, góp ý
import { useEffect, useState } from "react";
import { createFeedback, getMyFeedback } from "../services/api";

const LOAI = { DanhGia: "Đánh giá", KhieuNai: "Khiếu nại", GopY: "Góp ý" };
const CLASS_LOAI = {
  DanhGia: "fb-badge-danhgia",
  KhieuNai: "fb-badge-khieunai",
  GopY: "fb-badge-gopy",
};

function Sao({ so }) {
  return (
    <span className="stars">
      {"★".repeat(so)}
      {"☆".repeat(5 - so)}
    </span>
  );
}

function Feedback() {
  const [loai, setLoai] = useState("DanhGia");
  const [soSao, setSoSao] = useState(0);
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState(null);

  const loadData = () => {
    getMyFeedback()
      .then((res) => setList(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await createFeedback({ loai, soSao, tieuDe, noiDung });
      setMsg({ type: "success", text: res.data.message });
      setTieuDe("");
      setNoiDung("");
      setSoSao(0);
      loadData();
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Gửi phản hồi thất bại.",
      });
    }
  };

  return (
    <div className="page">
      <h1>Phản hồi &amp; đánh giá</h1>
      <p style={{ color: "var(--color-ink-soft)", marginTop: 0 }}>
        Ý kiến của bạn giúp PetCare phục vụ tốt hơn. Bạn có thể đánh giá dịch
        vụ, gửi góp ý hoặc khiếu nại nếu chưa hài lòng.
      </p>

      <form
        onSubmit={handleSubmit}
        className="form-card"
        style={{ maxWidth: "none", marginBottom: 32 }}
      >
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="feedback-type">
          {Object.keys(LOAI).map((k) => (
            <button
              type="button"
              key={k}
              className={loai === k ? "active" : ""}
              onClick={() => setLoai(k)}
            >
              {LOAI[k]}
            </button>
          ))}
        </div>

        {loai === "DanhGia" && (
          <div className="form-field">
            <label>Mức độ hài lòng</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={n <= soSao ? "on" : ""}
                  onClick={() => setSoSao(n)}
                  aria-label={`${n} sao`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-field">
          <label>Tiêu đề</label>
          <input
            value={tieuDe}
            onChange={(e) => setTieuDe(e.target.value)}
            maxLength={150}
            required
          />
        </div>

        <div className="form-field">
          <label>Nội dung (ít nhất 10 ký tự)</label>
          <textarea
            className="feedback-textarea"
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Gửi phản hồi
        </button>
      </form>

      <h2>Phản hồi của tôi</h2>
      {list.length === 0 && <p>Bạn chưa gửi phản hồi nào.</p>}
      {list.map((f) => (
        <div key={f.id} className="feedback-card">
          <div className="feedback-meta">
            <span className={`fb-badge ${CLASS_LOAI[f.loai]}`}>
              {LOAI[f.loai]}
            </span>
            {f.soSao ? <Sao so={f.soSao} /> : null}
            <span>{new Date(f.ngayTao).toLocaleString("vi-VN")}</span>
            <span
              className={`fb-badge ${f.daXuLy ? "fb-badge-danhgia" : "fb-badge-cho"}`}
            >
              {f.daXuLy ? "Đã phản hồi" : "Đang chờ xử lý"}
            </span>
          </div>
          <h4>{f.tieuDe}</h4>
          <p>{f.noiDung}</p>
          {f.traLoi && (
            <div className="feedback-reply">
              <strong>PetCare trả lời:</strong>
              <p style={{ margin: "6px 0 0" }}>{f.traLoi}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Feedback;
