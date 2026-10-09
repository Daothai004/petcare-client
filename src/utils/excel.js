// Xuất file Excel (.xlsx) có định dạng gọn gàng ngay trên trình duyệt
import ExcelJS from "exceljs";

export const ngayGio = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "");
export const ngay = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "");
// "2026-10-01" -> "01/10/2026"
export const ngayTuInput = (s) => (s ? s.split("-").reverse().join("/") : "");

const MAU_CHINH = "FF1F4D44";
const HANG_TIEU_DE = 4;

/**
 * cacSheet: [{
 *   ten, tieuDe, phuDe,
 *   cot: [{ tieuDe, khoa, rong, dinhDang }],   // dinhDang: "#,##0" cho cột số tiền
 *   dong: [{ ...theo khoa }],
 *   tong: ["khoaCotCanCong", ...]               // (không bắt buộc) thêm dòng tổng cộng
 * }]
 */
export async function xuatExcel(tenFile, cacSheet) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "PetCare";
  wb.created = new Date();

  cacSheet.forEach((s) => {
    const ws = wb.addWorksheet(s.ten.slice(0, 31));
    const soCot = s.cot.length;

    // Dòng 1: tiêu đề báo cáo, dòng 2: kỳ báo cáo / ghi chú
    ws.mergeCells(1, 1, 1, soCot);
    const o1 = ws.getCell(1, 1);
    o1.value = s.tieuDe || s.ten;
    o1.font = { bold: true, size: 14, color: { argb: MAU_CHINH } };

    ws.mergeCells(2, 1, 2, soCot);
    const o2 = ws.getCell(2, 1);
    o2.value = s.phuDe || `Xuất lúc ${ngayGio(new Date())}`;
    o2.font = { italic: true, color: { argb: "FF666666" } };

    // Dòng 4: tiêu đề cột
    const hang = ws.getRow(HANG_TIEU_DE);
    s.cot.forEach((c, i) => {
      const o = hang.getCell(i + 1);
      o.value = c.tieuDe;
      o.font = { bold: true, color: { argb: "FFFFFFFF" } };
      o.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: MAU_CHINH },
      };
      o.alignment = {
        vertical: "middle",
        horizontal: c.dinhDang ? "right" : "left",
        wrapText: true,
      };
      ws.getColumn(i + 1).width = c.rong || 16;
    });
    hang.height = 24;

    // Dữ liệu
    s.dong.forEach((d) => {
      const r = ws.addRow(s.cot.map((c) => d[c.khoa]));
      s.cot.forEach((c, i) => {
        const o = r.getCell(i + 1);
        if (c.dinhDang) o.numFmt = c.dinhDang;
        o.alignment = {
          vertical: "top",
          wrapText: true,
          horizontal: c.dinhDang ? "right" : "left",
        };
        o.border = { bottom: { style: "hair", color: { argb: "FFCCCCCC" } } };
      });
    });

    if (s.dong.length === 0) {
      ws.addRow(["Không có dữ liệu trong kỳ này"]);
    }

    // Dòng tổng cộng
    if (s.tong && s.tong.length > 0 && s.dong.length > 0) {
      const giaTri = s.cot.map((c) =>
        s.tong.includes(c.khoa)
          ? s.dong.reduce((t, d) => t + (Number(d[c.khoa]) || 0), 0)
          : "",
      );
      const iNhan = s.cot.findIndex(
        (c) => c.khoa !== "stt" && !s.tong.includes(c.khoa),
      );
      if (iNhan >= 0) giaTri[iNhan] = "TỔNG CỘNG";

      const r = ws.addRow(giaTri);
      s.cot.forEach((c, i) => {
        const o = r.getCell(i + 1);
        if (c.dinhDang) o.numFmt = c.dinhDang;
        o.font = { bold: true };
        o.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEAF1EE" },
        };
        o.border = { top: { style: "thin", color: { argb: MAU_CHINH } } };
      });
    }

    ws.autoFilter = {
      from: { row: HANG_TIEU_DE, column: 1 },
      to: { row: HANG_TIEU_DE, column: soCot },
    };
    ws.views = [{ state: "frozen", ySplit: HANG_TIEU_DE }];
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tenFile}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
