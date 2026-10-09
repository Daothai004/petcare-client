// Trang Báo cáo & Excel: tự tạo các biểu mẫu báo cáo từ dữ liệu hệ thống
import { useState } from "react";
import {
  getBaoCaoLichHen,
  getBaoCaoHoaDon,
  getServices,
  getStaff,
  getSupplies,
} from "../../services/api";
import { xuatExcel, ngayGio, ngay, ngayTuInput } from "../../utils/excel";

const TRANG_THAI = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
  2: "Hoàn tất",
  3: "Đã hủy",
};
const LOAI_KHO = { Thuoc: "Thuốc", VacXin: "Vắc-xin", DungCu: "Dụng cụ y tế" };
const TIEN = "#,##0";

const z = (n) => String(n).padStart(2, "0");
const dangInput = (d) =>
  `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
const homNay = () => dangInput(new Date());
const dauThang = () => {
  const d = new Date();
  return dangInput(new Date(d.getFullYear(), d.getMonth(), 1));
};
const cuoiThang = () => {
  const d = new Date();
  return dangInput(new Date(d.getFullYear(), d.getMonth() + 1, 0));
};

// Trạng thái tồn kho (giống trang Kho thuốc & vật tư)
function trangThaiKho(v) {
  if (v.soLuongTon <= 0) return "Hết hàng";
  if (v.hanSuDung) {
    const ngayCon = Math.ceil(
      (new Date(v.hanSuDung) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (ngayCon < 0) return "Hết hạn";
    if (ngayCon <= 30) return `Sắp hết hạn (${ngayCon} ngày)`;
  }
  if (v.soLuongTon <= v.mucCanhBao) return "Sắp hết";
  return "Còn hàng";
}

function TheBaoCao({ ma, ten, moTa, dangChay, onClick, nut }) {
  return (
    <div className="report-card">
      <h3>{ten}</h3>
      <div className="report-code">{ma}</div>
      <p>{moTa}</p>
      <button className="btn-small" disabled={dangChay} onClick={onClick}>
        {dangChay ? "Đang tạo file..." : nut || "Xuất Excel"}
      </button>
    </div>
  );
}

function AdminReports() {
  const vaiTro = localStorage.getItem("vaiTro");
  const laAdmin = vaiTro === "QuanTriVien";
  const laBacSi = vaiTro === "BacSiThuY";

  const [tuNgay, setTuNgay] = useState(dauThang());
  const [denNgay, setDenNgay] = useState(cuoiThang());
  const [dangChay, setDangChay] = useState("");
  const [error, setError] = useState(null);

  const ky = `Kỳ báo cáo: ${ngayTuInput(tuNgay)} - ${ngayTuInput(denNgay)}`;

  const chay = async (ten, viec) => {
    setError(null);
    if (tuNgay > denNgay) {
      setError("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.");
      return;
    }
    setDangChay(ten);
    try {
      await viec();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Xuất Excel thất bại.",
      );
    } finally {
      setDangChay("");
    }
  };

  // ===== Sổ lịch hẹn (QT_BM 3 / NV_BM 1) =====
  const xuatSoLichHen = () =>
    chay("lichhen", async () => {
      const res = await getBaoCaoLichHen(tuNgay, denNgay);
      const dong = res.data.map((l, i) => ({
        stt: i + 1,
        id: l.id,
        hoaDonId: l.hoaDonId ?? "",
        thoiGian: ngayGio(l.thoiGianBatDau),
        thuCung: l.tenThuCung,
        loai: l.loai,
        giong: l.giong,
        chuNuoi: l.chuNuoi,
        sdt: l.soDienThoai,
        dichVu: l.tenDichVu,
        nhanSu: l.nhanSu,
        gia: Number(l.giaDichVu),
        trangThai: TRANG_THAI[l.trangThai],
        thanhToan: l.daThanhToan ? "Đã thanh toán" : "Chưa thanh toán",
      }));
      await xuatExcel(`So-lich-hen_${tuNgay}_${denNgay}`, [
        {
          ten: "Sổ lịch hẹn",
          tieuDe: "SỔ LỊCH HẸN",
          phuDe: `${ky}${laAdmin ? "" : " | Chỉ gồm lịch hẹn bạn phụ trách"}`,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Mã LH", khoa: "id", rong: 8 },
            { tieuDe: "Mã HĐ", khoa: "hoaDonId", rong: 8 },
            { tieuDe: "Thời gian", khoa: "thoiGian", rong: 20 },
            { tieuDe: "Thú cưng", khoa: "thuCung", rong: 14 },
            { tieuDe: "Loài", khoa: "loai", rong: 10 },
            { tieuDe: "Giống", khoa: "giong", rong: 14 },
            { tieuDe: "Chủ nuôi", khoa: "chuNuoi", rong: 20 },
            { tieuDe: "Số điện thoại", khoa: "sdt", rong: 15 },
            { tieuDe: "Dịch vụ", khoa: "dichVu", rong: 18 },
            { tieuDe: "Nhân sự", khoa: "nhanSu", rong: 20 },
            {
              tieuDe: "Giá dịch vụ (đ)",
              khoa: "gia",
              rong: 16,
              dinhDang: TIEN,
            },
            { tieuDe: "Trạng thái", khoa: "trangThai", rong: 14 },
            { tieuDe: "Thanh toán", khoa: "thanhToan", rong: 16 },
          ],
          dong,
        },
      ]);
    });

  // ===== Tổng kết doanh thu (QT_BM 4, QT_BM 5, NV_BM 3) =====
  const xuatTongKet = () =>
    chay("tongket", async () => {
      const res = await getBaoCaoLichHen(tuNgay, denNgay);
      const tatCa = res.data;
      const hoanTat = tatCa.filter((l) => l.trangThai === 2);
      const soHuy = tatCa.filter((l) => l.trangThai === 3).length;

      const gom = (khoa) => {
        const map = new Map();
        hoanTat.forEach((l) => {
          const ten = l[khoa] || "(không rõ)";
          const cu = map.get(ten) || { luot: 0, doanhThu: 0 };
          cu.luot += 1;
          cu.doanhThu += Number(l.giaDichVu);
          map.set(ten, cu);
        });
        return [...map.entries()].map(([ten, v]) => ({ ten, ...v }));
      };

      const tongDoanhThu = hoanTat.reduce((s, l) => s + Number(l.giaDichVu), 0);
      const themTyTrong = (ds) =>
        ds.map((d, i) => ({
          stt: i + 1,
          ...d,
          tyTrong: tongDoanhThu
            ? Math.round((d.doanhThu / tongDoanhThu) * 1000) / 10
            : 0,
        }));

      const phuDe =
        `${ky} | Doanh thu = tổng giá dịch vụ đã hoàn tất, ` +
        `không tính lịch hẹn đã hủy (${soHuy} lịch hủy)`;

      await xuatExcel(`Tong-ket_${tuNgay}_${denNgay}`, [
        {
          ten: "Theo dịch vụ",
          tieuDe: "BÁO CÁO DOANH THU THEO DỊCH VỤ",
          phuDe,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Dịch vụ", khoa: "ten", rong: 28 },
            {
              tieuDe: "Số lượt hoàn tất",
              khoa: "luot",
              rong: 18,
              dinhDang: "0",
            },
            {
              tieuDe: "Doanh thu (đ)",
              khoa: "doanhThu",
              rong: 18,
              dinhDang: TIEN,
            },
            {
              tieuDe: "Tỷ trọng (%)",
              khoa: "tyTrong",
              rong: 14,
              dinhDang: "0.0",
            },
          ],
          dong: themTyTrong(gom("tenDichVu")),
          tong: ["luot", "doanhThu"],
        },
        {
          ten: "Theo nhân sự",
          tieuDe: "BÁO CÁO DOANH THU THEO NHÂN SỰ",
          phuDe,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Nhân sự", khoa: "ten", rong: 28 },
            {
              tieuDe: "Số lượt hoàn tất",
              khoa: "luot",
              rong: 18,
              dinhDang: "0",
            },
            {
              tieuDe: "Doanh thu (đ)",
              khoa: "doanhThu",
              rong: 18,
              dinhDang: TIEN,
            },
            {
              tieuDe: "Tỷ trọng (%)",
              khoa: "tyTrong",
              rong: 14,
              dinhDang: "0.0",
            },
          ],
          dong: themTyTrong(gom("nhanSu")),
          tong: ["luot", "doanhThu"],
        },
        {
          ten: "Chi tiết hoàn tất",
          tieuDe: "CHI TIẾT CÁC LỊCH HẸN ĐÃ HOÀN TẤT",
          phuDe,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Thời gian", khoa: "thoiGian", rong: 20 },
            { tieuDe: "Thú cưng", khoa: "thuCung", rong: 14 },
            { tieuDe: "Chủ nuôi", khoa: "chuNuoi", rong: 20 },
            { tieuDe: "Dịch vụ", khoa: "dichVu", rong: 20 },
            { tieuDe: "Nhân sự", khoa: "nhanSu", rong: 20 },
            {
              tieuDe: "Giá dịch vụ (đ)",
              khoa: "gia",
              rong: 16,
              dinhDang: TIEN,
            },
          ],
          dong: hoanTat.map((l, i) => ({
            stt: i + 1,
            thoiGian: ngayGio(l.thoiGianBatDau),
            thuCung: l.tenThuCung,
            chuNuoi: l.chuNuoi,
            dichVu: l.tenDichVu,
            nhanSu: l.nhanSu,
            gia: Number(l.giaDichVu),
          })),
          tong: ["gia"],
        },
      ]);
    });

  // ===== Danh sách hóa đơn (Admin) =====
  const xuatHoaDon = () =>
    chay("hoadon", async () => {
      const res = await getBaoCaoHoaDon(tuNgay, denNgay);
      const ds = res.data;
      const dong = ds.map((h, i) => ({
        stt: i + 1,
        id: h.id,
        khach: h.tenKhach,
        sdt: h.soDienThoai,
        ngayTao: ngayGio(h.ngayTao),
        dichVu: h.dichVu,
        tienDichVu: Number(h.tienDichVu),
        tienPhatSinh: Number(h.tienPhatSinh),
        tienSanPham: Number(h.tienSanPham),
        tong: Number(h.tongCong),
        trangThai: h.daThanhToan ? "Đã thanh toán" : "Chưa thanh toán",
        ngayTT: h.ngayThanhToan ? ngayGio(h.ngayThanhToan) : "",
      }));

      const daThu = ds.filter((h) => h.daThanhToan);
      const tienDaThu = daThu.reduce((s, h) => s + Number(h.tongCong), 0);
      const tienChuaThu = ds
        .filter((h) => !h.daThanhToan)
        .reduce((s, h) => s + Number(h.tongCong), 0);

      await xuatExcel(`Danh-sach-hoa-don_${tuNgay}_${denNgay}`, [
        {
          ten: "Danh sách hóa đơn",
          tieuDe: "DANH SÁCH HÓA ĐƠN",
          phuDe: ky,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Mã HĐ", khoa: "id", rong: 8 },
            { tieuDe: "Khách hàng", khoa: "khach", rong: 22 },
            { tieuDe: "Số điện thoại", khoa: "sdt", rong: 15 },
            { tieuDe: "Ngày tạo", khoa: "ngayTao", rong: 20 },
            { tieuDe: "Dịch vụ", khoa: "dichVu", rong: 32 },
            {
              tieuDe: "Tiền dịch vụ (đ)",
              khoa: "tienDichVu",
              rong: 16,
              dinhDang: TIEN,
            },
            {
              tieuDe: "Phát sinh (đ)",
              khoa: "tienPhatSinh",
              rong: 15,
              dinhDang: TIEN,
            },
            {
              tieuDe: "Sản phẩm (đ)",
              khoa: "tienSanPham",
              rong: 15,
              dinhDang: TIEN,
            },
            { tieuDe: "Tổng cộng (đ)", khoa: "tong", rong: 16, dinhDang: TIEN },
            { tieuDe: "Thanh toán", khoa: "trangThai", rong: 16 },
            { tieuDe: "Ngày thanh toán", khoa: "ngayTT", rong: 20 },
          ],
          dong,
          tong: ["tienDichVu", "tienPhatSinh", "tienSanPham", "tong"],
        },
        {
          ten: "Tổng hợp",
          tieuDe: "TỔNG HỢP HÓA ĐƠN",
          phuDe: ky,
          cot: [
            { tieuDe: "Chỉ tiêu", khoa: "chiTieu", rong: 32 },
            { tieuDe: "Giá trị", khoa: "giaTri", rong: 20, dinhDang: TIEN },
          ],
          dong: [
            { chiTieu: "Tổng số hóa đơn", giaTri: ds.length },
            { chiTieu: "Số hóa đơn đã thanh toán", giaTri: daThu.length },
            {
              chiTieu: "Số hóa đơn chưa thanh toán",
              giaTri: ds.length - daThu.length,
            },
            { chiTieu: "Tiền đã thu (đ)", giaTri: tienDaThu },
            { chiTieu: "Tiền chưa thu (đ)", giaTri: tienChuaThu },
          ],
        },
      ]);
    });

  // ===== Báo cáo kho =====
  const xuatKho = () =>
    chay("kho", async () => {
      const res = await getSupplies();
      const dong = res.data.map((v, i) => ({
        stt: i + 1,
        loai: LOAI_KHO[v.loai] || v.loai,
        ten: v.tenVatTu,
        donVi: v.donVi,
        ton: v.soLuongTon,
        canhBao: v.mucCanhBao,
        han: v.hanSuDung ? ngay(v.hanSuDung) : "",
        trangThai: trangThaiKho(v),
        ghiChu: v.ghiChu || "",
      }));
      const cot = [
        { tieuDe: "STT", khoa: "stt", rong: 6 },
        { tieuDe: "Loại", khoa: "loai", rong: 16 },
        { tieuDe: "Tên", khoa: "ten", rong: 34 },
        { tieuDe: "Đơn vị", khoa: "donVi", rong: 10 },
        { tieuDe: "Tồn kho", khoa: "ton", rong: 10, dinhDang: "0" },
        { tieuDe: "Mức cảnh báo", khoa: "canhBao", rong: 14, dinhDang: "0" },
        { tieuDe: "Hạn dùng", khoa: "han", rong: 14 },
        { tieuDe: "Trạng thái", khoa: "trangThai", rong: 22 },
        { tieuDe: "Ghi chú", khoa: "ghiChu", rong: 30 },
      ];
      await xuatExcel(`Bao-cao-kho_${homNay()}`, [
        {
          ten: "Tồn kho",
          tieuDe: "BÁO CÁO KHO THUỐC, VẮC-XIN, DỤNG CỤ Y TẾ",
          phuDe: `Tại thời điểm ${ngayGio(new Date())}`,
          cot,
          dong,
        },
        {
          ten: "Cần chú ý",
          tieuDe: "CÁC MỤC CẦN NHẬP THÊM / SẮP HẾT HẠN",
          phuDe: `Tại thời điểm ${ngayGio(new Date())}`,
          cot,
          dong: dong.filter((d) => d.trangThai !== "Còn hàng"),
        },
      ]);
    });

  // ===== Bảng giá dịch vụ (QT_BM 1) =====
  const xuatBangGia = () =>
    chay("banggia", async () => {
      const res = await getServices();
      await xuatExcel(`Bang-gia-dich-vu_${homNay()}`, [
        {
          ten: "Bảng giá dịch vụ",
          tieuDe: "BẢNG GIÁ DỊCH VỤ",
          phuDe: `Tại thời điểm ${ngayGio(new Date())}`,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Dịch vụ", khoa: "ten", rong: 26 },
            { tieuDe: "Mô tả", khoa: "moTa", rong: 50 },
            { tieuDe: "Giá (đ)", khoa: "gia", rong: 16, dinhDang: TIEN },
            {
              tieuDe: "Thời lượng (phút)",
              khoa: "phut",
              rong: 18,
              dinhDang: "0",
            },
            { tieuDe: "Trạng thái", khoa: "trangThai", rong: 16 },
          ],
          dong: res.data.map((s, i) => ({
            stt: i + 1,
            ten: s.tenDichVu,
            moTa: s.moTa,
            gia: Number(s.gia),
            phut: s.thoiLuongPhut,
            trangThai: s.dangHoatDong ? "Đang cung cấp" : "Ngừng cung cấp",
          })),
        },
      ]);
    });

  // ===== Danh sách nhân sự (QT_BM 2) =====
  const xuatNhanSu = () =>
    chay("nhansu", async () => {
      const res = await getStaff();
      await xuatExcel(`Danh-sach-nhan-su_${homNay()}`, [
        {
          ten: "Danh sách nhân sự",
          tieuDe: "DANH SÁCH NHÂN SỰ",
          phuDe: `Tại thời điểm ${ngayGio(new Date())}`,
          cot: [
            { tieuDe: "STT", khoa: "stt", rong: 6 },
            { tieuDe: "Họ tên", khoa: "hoTen", rong: 24 },
            { tieuDe: "Chức vụ", khoa: "chucVu", rong: 20 },
            { tieuDe: "Số điện thoại", khoa: "sdt", rong: 16 },
            { tieuDe: "Trình độ chuyên môn", khoa: "trinhDo", rong: 40 },
            { tieuDe: "Kinh nghiệm", khoa: "kinhNghiem", rong: 36 },
          ],
          dong: res.data.map((n, i) => ({
            stt: i + 1,
            hoTen: n.hoTen,
            chucVu: n.chucVu,
            sdt: n.soDienThoai,
            trinhDo: n.trinhDo || "",
            kinhNghiem: n.kinhNghiem || "",
          })),
        },
      ]);
    });

  return (
    <div>
      <h1>Báo cáo &amp; Excel</h1>
      <p style={{ color: "var(--color-ink-soft)" }}>
        Hệ thống tự tạo các biểu mẫu báo cáo từ dữ liệu có sẵn, không cần ghi
        chép hay tổng hợp thủ công.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="report-dates">
        <strong>Kỳ báo cáo:</strong>
        <input
          type="date"
          value={tuNgay}
          onChange={(e) => setTuNgay(e.target.value)}
        />
        <span>đến</span>
        <input
          type="date"
          value={denNgay}
          onChange={(e) => setDenNgay(e.target.value)}
        />
        <button
          className="btn-small"
          onClick={() => {
            setTuNgay(homNay());
            setDenNgay(homNay());
          }}
        >
          Hôm nay
        </button>
        <button
          className="btn-small"
          onClick={() => {
            setTuNgay(dauThang());
            setDenNgay(cuoiThang());
          }}
        >
          Tháng này
        </button>
      </div>

      <div className="report-grid">
        <TheBaoCao
          ma="QT_BM 3 · NV_BM 1"
          ten="Sổ lịch hẹn"
          moTa={
            laAdmin
              ? "Toàn bộ lịch hẹn trong kỳ, kèm chủ nuôi và số điện thoại."
              : "Các lịch hẹn do bạn phụ trách trong kỳ, kèm chủ nuôi và số điện thoại."
          }
          dangChay={dangChay === "lichhen"}
          onClick={xuatSoLichHen}
        />
        <TheBaoCao
          ma="QT_BM 4 · QT_BM 5 · NV_BM 3"
          ten="Tổng kết doanh thu"
          moTa="Số lượt phục vụ và doanh thu theo dịch vụ, theo nhân sự. Chọn kỳ là một ngày để có bảng tổng kết ngày, chọn cả tháng để có báo cáo tháng."
          dangChay={dangChay === "tongket"}
          onClick={xuatTongKet}
        />
        {laAdmin && (
          <TheBaoCao
            ma="Hóa đơn"
            ten="Danh sách hóa đơn"
            moTa="Tiền dịch vụ, khoản phát sinh, sản phẩm, tổng cộng và tình trạng thanh toán của từng hóa đơn trong kỳ."
            dangChay={dangChay === "hoadon"}
            onClick={xuatHoaDon}
          />
        )}
        {(laAdmin || laBacSi) && (
          <TheBaoCao
            ma="Kho"
            ten="Báo cáo kho thuốc & vật tư"
            moTa="Tồn kho, hạn sử dụng và các mục cần nhập thêm hoặc sắp hết hạn (không phụ thuộc kỳ báo cáo)."
            dangChay={dangChay === "kho"}
            onClick={xuatKho}
          />
        )}
        {laAdmin && (
          <TheBaoCao
            ma="QT_BM 1"
            ten="Bảng giá dịch vụ"
            moTa="Tên, mô tả, giá và thời lượng dự kiến của các dịch vụ (không phụ thuộc kỳ báo cáo)."
            dangChay={dangChay === "banggia"}
            onClick={xuatBangGia}
          />
        )}
        {laAdmin && (
          <TheBaoCao
            ma="QT_BM 2"
            ten="Danh sách nhân sự"
            moTa="Họ tên, chức vụ, trình độ và kinh nghiệm của từng nhân sự (không phụ thuộc kỳ báo cáo)."
            dangChay={dangChay === "nhansu"}
            onClick={xuatNhanSu}
          />
        )}
      </div>
    </div>
  );
}

export default AdminReports;
