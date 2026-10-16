// trang quản lý lịch làm việc toàn bộ nhân sự (chỉ Admin): lưới tuần + xếp nhanh
import { useEffect, useState } from "react";
import {
  getAllWorkSchedules,
  getStaff,
  createWorkSchedule,
  deleteWorkSchedule,
} from "../../services/api";

const TEN_THU = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

// Thứ tự hiển thị trên lưới: Thứ 2 -> Chủ nhật
const THU_THEO_THU_TU = [1, 2, 3, 4, 5, 6, 0];

// Chức vụ có chữ "bác sĩ" -> bác sĩ thú y (khớp với quy tắc ở backend)
const laBacSi = (n) => (n.chucVu || "").toLowerCase().includes("bác sĩ");
const gio = (v) => (v ? v.slice(0, 5) : "");

const RONG = {
  nhanSuId: "",
  thuTrongTuan: 1,
  gioBatDau: "08:00",
  gioKetThuc: "17:00",
  ghiChu: "",
};

function AdminAllWorkSchedules() {
  const [list, setList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState(RONG);
  const [nhanh, setNhanh] = useState({
    doiTuong: "all",
    gioBatDau: "08:00",
    gioKetThuc: "20:00",
    ngay: [1, 2, 3, 4, 5, 6, 0],
  });
  const [dangXep, setDangXep] = useState(false);
  const [error, setError] = useState(null);
  const [thongBao, setThongBao] = useState(null);

  const loadData = () => {
    getAllWorkSchedules()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
    getStaff()
      .then((res) => setStaffList(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Thông báo tự tắt sau vài giây
  useEffect(() => {
    if (!thongBao) return;
    const t = setTimeout(() => setThongBao(null), 3500);
    return () => clearTimeout(t);
  }, [thongBao]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 7000);
    return () => clearTimeout(t);
  }, [error]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setThongBao(null);

    if (!form.nhanSuId) {
      setError("Vui lòng chọn nhân sự.");
      return;
    }

    try {
      await createWorkSchedule({
        nhanSuId: Number(form.nhanSuId),
        thuTrongTuan: Number(form.thuTrongTuan),
        gioBatDau: `${form.gioBatDau}:00`,
        gioKetThuc: `${form.gioKetThuc}:00`,
        ghiChu: form.ghiChu,
      });
      setForm(RONG);
      setThongBao("Đã thêm ca làm việc.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Lưu lịch làm việc thất bại.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa ca làm việc này?")) return;
    try {
      await deleteWorkSchedule(id);
      setThongBao("Đã xóa ca làm việc.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Xóa thất bại.");
    }
  };

  // Bấm vào ô trống trên lưới -> chọn sẵn nhân sự và thứ trong form thêm ca
  const chonO = (n, thu) => {
    setForm({ ...form, nhanSuId: String(n.id), thuTrongTuan: thu });
    setError(null);
    setThongBao(
      `Đã chọn ${n.hoTen} · ${TEN_THU[thu]}, nhập giờ rồi bấm "Thêm ca làm".`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleNgay = (thu) => {
    setNhanh({
      ...nhanh,
      ngay: nhanh.ngay.includes(thu)
        ? nhanh.ngay.filter((t) => t !== thu)
        : [...nhanh.ngay, thu],
    });
  };

  // Xếp nhanh: tạo cùng một ca cho nhiều nhân sự / nhiều ngày.
  // Ô (nhân sự + thứ) nào đã có ca thì giữ nguyên, không tạo thêm.
  const handleXepNhanh = async () => {
    setError(null);
    setThongBao(null);

    if (nhanh.gioKetThuc <= nhanh.gioBatDau) {
      setError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }
    if (nhanh.ngay.length === 0) {
      setError("Hãy chọn ít nhất một ngày trong tuần.");
      return;
    }

    const doiTuong =
      nhanh.doiTuong === "all"
        ? staffList
        : staffList.filter((n) => String(n.id) === nhanh.doiTuong);

    const canTao = [];
    let boQua = 0;
    doiTuong.forEach((n) => {
      nhanh.ngay.forEach((thu) => {
        const daCo = list.some(
          (l) => l.nhanSuId === n.id && l.thuTrongTuan === thu,
        );
        if (daCo) boQua++;
        else canTao.push({ nhanSuId: n.id, thu });
      });
    });

    if (canTao.length === 0) {
      setThongBao(`Không có ô nào cần tạo (${boQua} ô đã có ca).`);
      return;
    }
    if (
      !confirm(
        `Tạo ${canTao.length} ca làm ${nhanh.gioBatDau}-${nhanh.gioKetThuc}? (${boQua} ô đã có ca sẽ được giữ nguyên)`,
      )
    ) {
      return;
    }

    setDangXep(true);
    try {
      for (const o of canTao) {
        await createWorkSchedule({
          nhanSuId: o.nhanSuId,
          thuTrongTuan: o.thu,
          gioBatDau: `${nhanh.gioBatDau}:00`,
          gioKetThuc: `${nhanh.gioKetThuc}:00`,
          ghiChu: "",
        });
      }
      setThongBao(`Đã tạo ${canTao.length} ca làm việc.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Xếp nhanh bị dừng giữa chừng, hãy kiểm tra lại lưới bên dưới.",
      );
    } finally {
      setDangXep(false);
      loadData();
    }
  };

  // Bác sĩ xếp trước, sau đó theo tên
  const sapXep = [...staffList].sort(
    (a, b) =>
      Number(laBacSi(b)) - Number(laBacSi(a)) ||
      a.hoTen.localeCompare(b.hoTen, "vi"),
  );

  const caCua = (nhanSuId, thu) =>
    list
      .filter((l) => l.nhanSuId === nhanSuId && l.thuTrongTuan === thu)
      .sort((a, b) => (a.gioBatDau || "").localeCompare(b.gioBatDau || ""));

  return (
    <div>
      <h1>Lịch làm việc nhân sự</h1>

      {/* Thông báo nổi ở góc phải trên, luôn nhìn thấy dù đang cuộn ở đâu, tự tắt sau vài giây */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 2000,
          maxWidth: 360,
        }}
      >
        {error && <div className="alert alert-error">{error}</div>}
        {thongBao && <div className="alert alert-success">{thongBao}</div>}
      </div>

      <form onSubmit={handleSubmit} className="admin-inline-form">
        <select
          name="nhanSuId"
          value={form.nhanSuId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn nhân sự --</option>
          {sapXep.map((n) => (
            <option key={n.id} value={n.id}>
              {n.hoTen} ({n.chucVu})
            </option>
          ))}
        </select>
        <select
          name="thuTrongTuan"
          value={form.thuTrongTuan}
          onChange={handleChange}
        >
          {THU_THEO_THU_TU.map((so) => (
            <option key={so} value={so}>
              {TEN_THU[so]}
            </option>
          ))}
        </select>
        <input
          name="gioBatDau"
          type="time"
          value={form.gioBatDau}
          onChange={handleChange}
          required
        />
        <input
          name="gioKetThuc"
          type="time"
          value={form.gioKetThuc}
          onChange={handleChange}
          required
        />
        <input
          name="ghiChu"
          placeholder="Ghi chú"
          value={form.ghiChu}
          onChange={handleChange}
        />
        <button type="submit" className="btn-small">
          Thêm ca làm
        </button>
      </form>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <h2>Xếp nhanh ca làm việc</h2>
        <div className="admin-inline-form">
          <select
            value={nhanh.doiTuong}
            onChange={(e) => setNhanh({ ...nhanh, doiTuong: e.target.value })}
          >
            <option value="all">Tất cả nhân sự</option>
            {sapXep.map((n) => (
              <option key={n.id} value={String(n.id)}>
                {n.hoTen}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={nhanh.gioBatDau}
            onChange={(e) => setNhanh({ ...nhanh, gioBatDau: e.target.value })}
          />
          <input
            type="time"
            value={nhanh.gioKetThuc}
            onChange={(e) => setNhanh({ ...nhanh, gioKetThuc: e.target.value })}
          />
          <button
            type="button"
            className="btn-small"
            disabled={dangXep}
            onClick={handleXepNhanh}
          >
            {dangXep ? "Đang tạo..." : "Áp dụng"}
          </button>
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10 }}
        >
          {THU_THEO_THU_TU.map((t) => (
            <label
              key={t}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <input
                type="checkbox"
                checked={nhanh.ngay.includes(t)}
                onChange={() => toggleNgay(t)}
              />
              {TEN_THU[t]}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nhân sự</th>
              {THU_THEO_THU_TU.map((t) => (
                <th key={t}>{TEN_THU[t]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sapXep.map((n) => {
              const tongCa = list.filter((l) => l.nhanSuId === n.id).length;
              const bs = laBacSi(n);
              return (
                <tr key={n.id}>
                  <td style={{ minWidth: 170 }}>
                    <strong>{n.hoTen}</strong>
                    <br />
                    <small style={{ color: "var(--color-ink-soft)" }}>
                      {n.chucVu}
                    </small>
                    {tongCa === 0 && (
                      <>
                        <br />
                        <small style={{ color: "var(--color-error)" }}>
                          Chưa có ca: không giới hạn giờ làm
                        </small>
                      </>
                    )}
                  </td>
                  {THU_THEO_THU_TU.map((thu) => {
                    const cas = caCua(n.id, thu);
                    return (
                      <td
                        key={thu}
                        style={{
                          minWidth: 130,
                          cursor: cas.length === 0 ? "pointer" : "default",
                        }}
                        title={
                          cas.length === 0
                            ? "Bấm để thêm ca cho ô này"
                            : undefined
                        }
                        onClick={
                          cas.length === 0 ? () => chonO(n, thu) : undefined
                        }
                      >
                        {cas.length === 0 ? (
                          <span style={{ color: "var(--color-ink-soft)" }}>
                            {tongCa === 0 ? "—" : "Nghỉ"}
                          </span>
                        ) : (
                          cas.map((c) => (
                            <div
                              key={c.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 6,
                                padding: "3px 8px",
                                borderRadius: 6,
                                marginBottom: 4,
                                fontSize: "0.85rem",
                                background: bs
                                  ? "var(--color-accent-soft)"
                                  : "#e3efe6",
                              }}
                            >
                              <span style={{ whiteSpace: "nowrap" }}>
                                {gio(c.gioBatDau)}–{gio(c.gioKetThuc)}
                              </span>
                              <button
                                type="button"
                                title="Xóa ca này"
                                onClick={() => handleDelete(c.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "var(--color-error)",
                                  fontWeight: 700,
                                  padding: 0,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {sapXep.length === 0 && (
              <tr>
                <td colSpan="8">Chưa có nhân sự nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAllWorkSchedules;
