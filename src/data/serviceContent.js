// Nội dung giới thiệu chi tiết của từng dịch vụ (giá và thời lượng lấy từ CSDL).
// Mỗi mục có khóa là "slug" của tên dịch vụ: chữ thường, không dấu, nối bằng dấu gạch ngang.
// VD: "Tắm gội" -> "tam-goi". Dịch vụ mới chưa có ở đây sẽ dùng nội dung mặc định.

export function taoSlug(ten) {
  return (ten || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const NOI_DUNG = {
  "tam-goi": {
    anh: "/img/dich-vu/tam-goi.jpg",
    tomTat: "Sạch sẽ, thơm tho và thoải mái sau mỗi lần tắm.",
    tongQuan: [
      "Dịch vụ tắm gội giúp thú cưng sạch bụi bẩn, giảm mùi hôi và có bộ lông mềm mượt. PetCare dùng sữa tắm dành riêng cho chó mèo, nước ấm vừa phải và sấy khô kỹ để thú cưng không bị lạnh hay ẩm da.",
      "Đây là dịch vụ nền tảng nên được duy trì đều đặn, giúp bộ lông và làn da của thú cưng luôn khỏe mạnh.",
    ],
    quyTrinh: [
      {
        tieuDe: "Kiểm tra sơ bộ",
        noiDung:
          "Nhân viên xem qua tình trạng da, lông và các vùng dễ rối để chọn cách tắm phù hợp.",
      },
      {
        tieuDe: "Chải gỡ rối",
        noiDung:
          "Chải nhẹ nhàng trước khi tắm để lông không bị vón cục khi gặp nước.",
      },
      {
        tieuDe: "Tắm gội và xả sạch",
        noiDung:
          "Tắm bằng sữa tắm chuyên dụng, xả thật sạch để không còn dư hóa chất trên da.",
      },
      {
        tieuDe: "Sấy khô và chải mượt",
        noiDung: "Sấy khô hoàn toàn, chải mượt lông rồi bàn giao cho chủ nuôi.",
      },
    ],
    loiIch: [
      "Lông sạch, mềm mượt và thơm tho.",
      "Giảm mùi hôi cơ thể, nhà cửa sạch sẽ hơn.",
      "Phát hiện sớm dấu hiệu bất thường trên da lông.",
      "Thú cưng thoải mái, ít ngứa ngáy do bụi bẩn.",
    ],
    luuY: [
      "Cho thú cưng đi vệ sinh trước khi đến để buổi tắm thoải mái hơn.",
      "Báo trước cho nhân viên nếu thú cưng có bệnh về da, vết thương hoặc đang mang thai.",
      "Thú cưng vừa tiêm phòng nên hỏi bác sĩ về thời điểm phù hợp để tắm.",
    ],
    cauHoi: [
      {
        hoi: "Bao lâu nên tắm cho thú cưng một lần?",
        traLoi:
          "Tùy giống và môi trường sống, thông thường khoảng 2 đến 4 tuần một lần. Bạn có thể hỏi nhân viên để được tư vấn riêng cho thú cưng của mình.",
      },
      {
        hoi: "Thú cưng sợ nước thì sao?",
        traLoi:
          "Nhân viên sẽ làm quen nhẹ nhàng, dùng nước ấm và thao tác chậm để thú cưng bớt căng thẳng.",
      },
    ],
  },

  "spa-thu-gian": {
    anh: "/img/dich-vu/spa-thu-gian.jpg",
    tomTat: "Gói chăm sóc toàn diện: tắm, cắt tỉa lông và massage thư giãn.",
    tongQuan: [
      "Spa thư giãn là gói dịch vụ trọn vẹn dành cho những bé cần một buổi chăm sóc đặc biệt: tắm dưỡng lông, cắt tỉa tạo kiểu và massage nhẹ nhàng giúp cơ thể thư giãn.",
      "Gói này tiết kiệm hơn so với việc đặt từng dịch vụ riêng lẻ và rất phù hợp để thưởng cho thú cưng vào dịp đặc biệt.",
    ],
    quyTrinh: [
      {
        tieuDe: "Tiếp nhận và tư vấn",
        noiDung:
          "Trao đổi về nhu cầu, kiểu lông mong muốn và tình trạng sức khỏe của thú cưng.",
      },
      {
        tieuDe: "Tắm dưỡng lông",
        noiDung: "Tắm bằng sản phẩm dưỡng phù hợp loại lông, sấy khô kỹ.",
      },
      {
        tieuDe: "Cắt tỉa tạo kiểu",
        noiDung: "Cắt tỉa gọn gàng theo giống và theo mong muốn của bạn.",
      },
      {
        tieuDe: "Massage thư giãn",
        noiDung:
          "Massage nhẹ nhàng giúp thú cưng thả lỏng, sau đó chải mượt và hoàn thiện.",
      },
    ],
    loiIch: [
      "Một gói gồm tắm, cắt tỉa và massage, tiết kiệm thời gian.",
      "Lông gọn đẹp, mượt mà, thơm tho.",
      "Thú cưng được thư giãn, bớt căng thẳng.",
      "Phù hợp để chuẩn bị cho các dịp đặc biệt.",
    ],
    luuY: [
      "Nên đặt lịch trước để nhân viên sắp xếp đủ thời gian.",
      "Thú cưng đang ốm hoặc vừa phẫu thuật chưa nên dùng dịch vụ này.",
      "Báo trước nếu thú cưng nhút nhát hoặc dễ hoảng sợ.",
    ],
    cauHoi: [
      {
        hoi: "Spa khác tắm gội ở điểm nào?",
        traLoi:
          "Tắm gội chỉ gồm tắm và sấy cơ bản. Spa thư giãn bao gồm thêm cắt tỉa lông và massage nên thời gian lâu hơn.",
      },
      {
        hoi: "Có chọn kiểu cắt tỉa được không?",
        traLoi:
          "Có. Bạn trao đổi với nhân viên lúc tiếp nhận để chọn kiểu phù hợp với giống và sở thích.",
      },
    ],
  },

  "cat-tia-long": {
    anh: "/img/dich-vu/cat-tia-long.jpg",
    tomTat: "Tạo kiểu gọn gàng, thoáng mát và dễ chăm sóc.",
    tongQuan: [
      "Cắt tỉa lông giúp thú cưng gọn gàng, thoáng mát vào mùa nóng và dễ chải chuốt hằng ngày. Nhân viên cắt tỉa theo đặc điểm của từng giống để thú cưng vừa đẹp vừa thoải mái.",
    ],
    quyTrinh: [
      {
        tieuDe: "Trao đổi kiểu cắt",
        noiDung:
          "Bạn cho biết kiểu mong muốn, nhân viên tư vấn kiểu hợp với giống và độ dài lông.",
      },
      {
        tieuDe: "Chải gỡ rối",
        noiDung: "Gỡ rối và loại bỏ lông chết trước khi cắt.",
      },
      {
        tieuDe: "Cắt tỉa tạo kiểu",
        noiDung: "Cắt tỉa phần thân, chân, đầu và đuôi theo kiểu đã chọn.",
      },
      {
        tieuDe: "Vệ sinh và hoàn thiện",
        noiDung:
          "Làm sạch lông vụn, chải mượt và kiểm tra lại toàn bộ trước khi bàn giao.",
      },
    ],
    loiIch: [
      "Ngoại hình gọn gàng, đáng yêu.",
      "Thoáng mát hơn trong thời tiết nóng.",
      "Giảm rối lông, dễ chải và dễ vệ sinh.",
      "Hạn chế lông rụng bám trong nhà.",
    ],
    luuY: [
      "Lông rối vón cục nặng có thể phải cắt ngắn hơn mong muốn để tránh làm thú cưng đau.",
      "Hãy nói rõ kiểu cắt mong muốn khi tiếp nhận.",
      "Thú cưng sẽ được nghỉ giữa buổi nếu quá mệt hoặc căng thẳng.",
    ],
    cauHoi: [
      {
        hoi: "Có nên cạo trụi lông vào mùa hè không?",
        traLoi:
          "Không nên với nhiều giống, vì lông giúp bảo vệ da khỏi nắng. Nhân viên sẽ tư vấn độ dài phù hợp.",
      },
    ],
  },

  "kham-tong-quat": {
    anh: "/img/dich-vu/kham-tong-quat.jpg",
    tomTat: "Theo dõi sức khỏe định kỳ cùng bác sĩ thú y.",
    tongQuan: [
      "Khám tổng quát là buổi kiểm tra sức khỏe định kỳ do bác sĩ thú y thực hiện. Bác sĩ đánh giá thể trạng chung, giúp phát hiện sớm các vấn đề tiềm ẩn và tư vấn chế độ chăm sóc phù hợp.",
      "Kết quả thăm khám, chẩn đoán và đơn thuốc (nếu có) được ghi vào bệnh án của thú cưng trên hệ thống để theo dõi lâu dài.",
    ],
    quyTrinh: [
      {
        tieuDe: "Hỏi bệnh sử",
        noiDung:
          "Bác sĩ hỏi về ăn uống, sinh hoạt, thuốc đang dùng và các biểu hiện bất thường gần đây.",
      },
      {
        tieuDe: "Khám lâm sàng",
        noiDung:
          "Kiểm tra cân nặng, thân nhiệt, tim phổi, da lông, tai, mắt và răng miệng.",
      },
      {
        tieuDe: "Chẩn đoán và tư vấn",
        noiDung:
          "Bác sĩ nhận định tình trạng sức khỏe, tư vấn dinh dưỡng và hướng xử lý nếu có vấn đề.",
      },
      {
        tieuDe: "Ghi nhận bệnh án",
        noiDung:
          "Thông tin được lưu vào bệnh án để lần khám sau bác sĩ nắm được lịch sử của thú cưng.",
      },
    ],
    loiIch: [
      "Phát hiện sớm vấn đề sức khỏe, xử lý kịp thời.",
      "Được tư vấn dinh dưỡng và chăm sóc phù hợp từng bé.",
      "Theo dõi cân nặng và thể trạng theo thời gian.",
      "Có sẵn lịch sử bệnh án cho các lần khám sau.",
    ],
    luuY: [
      "Mang theo sổ khám hoặc tiêm phòng cũ (nếu có).",
      "Ghi chú trước các biểu hiện bất thường để kể cho bác sĩ.",
      "Báo cho bác sĩ về loại thức ăn và thuốc thú cưng đang dùng.",
    ],
    cauHoi: [
      {
        hoi: "Bao lâu nên khám định kỳ một lần?",
        traLoi:
          "Bác sĩ sẽ tư vấn theo độ tuổi và tình trạng của thú cưng. Thông thường nên khám định kỳ ít nhất mỗi năm một lần.",
      },
      {
        hoi: "Khám xong có được kê đơn thuốc không?",
        traLoi:
          "Nếu cần, bác sĩ sẽ kê đơn và hướng dẫn cách dùng. Đơn thuốc được ghi vào bệnh án của thú cưng.",
      },
    ],
  },

  "nho-long-tai-cat-mong": {
    anh: "/img/dich-vu/nho-long-tai-cat-mong.jpg",
    tomTat: "Vệ sinh tai sạch sẽ, móng gọn gàng, nhanh chóng.",
    tongQuan: [
      "Dịch vụ nhổ lông tai và cắt móng giúp giữ tai thông thoáng, sạch sẽ và móng gọn gàng. Thao tác nhẹ nhàng, nhanh chóng nên thú cưng ít bị căng thẳng.",
    ],
    quyTrinh: [
      {
        tieuDe: "Kiểm tra tai và móng",
        noiDung: "Xem tình trạng tai, độ dài móng để chọn cách xử lý phù hợp.",
      },
      {
        tieuDe: "Nhổ lông tai",
        noiDung: "Loại bỏ lông thừa trong ống tai để tai thông thoáng hơn.",
      },
      {
        tieuDe: "Vệ sinh tai",
        noiDung: "Làm sạch tai bằng dung dịch chuyên dụng cho thú cưng.",
      },
      {
        tieuDe: "Cắt và mài móng",
        noiDung:
          "Cắt móng gọn, mài nhẵn để thú cưng không bị cào xước hay vướng víu khi đi lại.",
      },
    ],
    loiIch: [
      "Tai thông thoáng, sạch sẽ.",
      "Móng gọn, hạn chế cào xước đồ đạc và người.",
      "Thú cưng đi lại thoải mái hơn.",
      "Nhanh gọn, chỉ khoảng 15 phút.",
    ],
    luuY: [
      "Nếu tai đỏ, có mùi hôi hoặc thú cưng hay gãi tai, bạn nên đặt thêm khám tổng quát.",
      "Báo trước nếu thú cưng từng bị chảy máu khi cắt móng hoặc rất nhạy cảm ở chân.",
    ],
    cauHoi: [
      {
        hoi: "Cắt móng có làm thú cưng đau không?",
        traLoi:
          "Nhân viên cắt cẩn thận phần móng an toàn, tránh vùng có mạch máu. Nếu thú cưng sợ, nhân viên sẽ cắt từng chút và nghỉ giữa chừng.",
      },
    ],
  },

  "tiem-phong": {
    anh: "/img/dich-vu/tiem-phong.jpg",
    tomTat: "Bảo vệ thú cưng khỏi các bệnh truyền nhiễm nguy hiểm.",
    tongQuan: [
      "Tiêm phòng giúp cơ thể thú cưng tạo kháng thể chống lại các bệnh truyền nhiễm nguy hiểm ở chó mèo. Một số bệnh, như bệnh dại, còn có thể lây sang người nên tiêm phòng cũng là bảo vệ cả gia đình bạn.",
      "Mỗi lần tiêm được ghi lại trên hệ thống gồm loại vắc-xin, mũi số và ngày tiêm nhắc lại, giúp bạn theo dõi đúng lịch.",
    ],
    quyTrinh: [
      {
        tieuDe: "Khám sàng lọc",
        noiDung:
          "Bác sĩ kiểm tra thể trạng để chắc chắn thú cưng đủ khỏe để tiêm.",
      },
      {
        tieuDe: "Tư vấn vắc-xin và lịch tiêm",
        noiDung:
          "Chọn loại vắc-xin phù hợp độ tuổi, loài và lịch tiêm các mũi tiếp theo.",
      },
      {
        tieuDe: "Tiêm vắc-xin",
        noiDung: "Bác sĩ thực hiện tiêm theo đúng quy trình.",
      },
      {
        tieuDe: "Theo dõi và ghi hồ sơ",
        noiDung:
          "Theo dõi phản ứng sau tiêm, ghi hồ sơ tiêm phòng và hẹn ngày nhắc lại.",
      },
    ],
    loiIch: [
      "Phòng ngừa các bệnh truyền nhiễm nguy hiểm.",
      "Bảo vệ cả thú cưng lẫn các thành viên trong gia đình.",
      "Có hồ sơ tiêm phòng rõ ràng, theo dõi dễ dàng.",
      "Được nhắc đúng ngày tiêm nhắc lại.",
    ],
    luuY: [
      "Thú cưng nên khỏe mạnh khi đi tiêm, đang ốm hoặc sốt hãy báo bác sĩ.",
      "Mang theo sổ tiêm phòng cũ (nếu có).",
      "Tiêm nhắc lại đúng lịch để vắc-xin phát huy hiệu quả.",
      "Sau tiêm, theo dõi thú cưng và liên hệ bác sĩ nếu có biểu hiện bất thường.",
    ],
    cauHoi: [
      {
        hoi: "Thú cưng mấy tháng tuổi thì bắt đầu tiêm được?",
        traLoi:
          "Lịch tiêm phụ thuộc loài và tình trạng của từng bé. Bác sĩ sẽ tư vấn cụ thể khi thăm khám.",
      },
      {
        hoi: "Quên lịch tiêm nhắc lại thì sao?",
        traLoi:
          "Hãy liên hệ phòng khám sớm để bác sĩ đánh giá và sắp xếp lại lịch tiêm phù hợp.",
      },
    ],
  },

  "phau-thuat": {
    anh: "/img/dich-vu/phau-thuat.jpg",
    tomTat: "Phẫu thuật và tiểu phẫu an toàn do bác sĩ thú y thực hiện.",
    ghiChuGia:
      "Đây là giá tham khảo. Chi phí cụ thể phụ thuộc loại ca phẫu thuật và sẽ được bác sĩ tư vấn tại phòng khám.",
    tongQuan: [
      "PetCare cung cấp dịch vụ phẫu thuật và tiểu phẫu cho thú cưng, do bác sĩ thú y trực tiếp thăm khám, tư vấn và thực hiện. Mỗi ca được đánh giá riêng theo tình trạng sức khỏe của thú cưng.",
      "Thông tin ca mổ gồm tên ca, phương pháp và kết quả được lưu thành hồ sơ phẫu thuật để theo dõi sau này.",
    ],
    quyTrinh: [
      {
        tieuDe: "Thăm khám và tư vấn",
        noiDung:
          "Bác sĩ đánh giá tình trạng, giải thích phương án, rủi ro và chi phí dự kiến.",
      },
      {
        tieuDe: "Chuẩn bị trước mổ",
        noiDung:
          "Thực hiện các kiểm tra cần thiết và hướng dẫn bạn cách chuẩn bị (ví dụ nhịn ăn theo chỉ định).",
      },
      {
        tieuDe: "Thực hiện phẫu thuật",
        noiDung: "Bác sĩ tiến hành phẫu thuật theo phương pháp đã tư vấn.",
      },
      {
        tieuDe: "Hồi phục và dặn dò",
        noiDung:
          "Theo dõi thú cưng sau mổ, hướng dẫn chăm sóc tại nhà và hẹn lịch tái khám.",
      },
    ],
    loiIch: [
      "Do bác sĩ thú y trực tiếp thực hiện.",
      "Được tư vấn rõ ràng trước khi quyết định.",
      "Có hồ sơ phẫu thuật lưu trữ đầy đủ.",
      "Hướng dẫn chăm sóc sau mổ cụ thể, có lịch tái khám.",
    ],
    luuY: [
      "Hãy đặt lịch thăm khám trước để bác sĩ tư vấn ca của bạn.",
      "Tuân thủ hướng dẫn của bác sĩ về nhịn ăn, nhịn uống trước mổ.",
      "Hỏi bác sĩ về mọi rủi ro, đặc biệt là về gây mê, trước khi đồng ý.",
    ],
    cauHoi: [
      {
        hoi: "Chi phí phẫu thuật là bao nhiêu?",
        traLoi:
          "Mỗi ca có chi phí khác nhau. Giá hiển thị chỉ là mức tham khảo, bác sĩ sẽ báo giá cụ thể sau khi thăm khám.",
      },
      {
        hoi: "Sau mổ thú cưng cần chăm sóc thế nào?",
        traLoi:
          "Bác sĩ sẽ hướng dẫn chi tiết về vệ sinh vết mổ, chế độ ăn, thuốc và lịch tái khám cho từng ca.",
      },
    ],
  },
};

// Lấy nội dung của 1 dịch vụ; nếu chưa soạn thì dùng nội dung mặc định
export function layNoiDung(dichVu) {
  const co = NOI_DUNG[taoSlug(dichVu.tenDichVu)];
  if (co) return co;

  return {
    anh: "/img/dich-vu/mac-dinh.jpg",
    tomTat: dichVu.moTa || "Dịch vụ chăm sóc thú cưng tại PetCare.",
    tongQuan: [dichVu.moTa || "Dịch vụ chăm sóc thú cưng tại PetCare."],
    quyTrinh: [
      {
        tieuDe: "Tiếp nhận và tư vấn",
        noiDung: "Nhân viên trao đổi nhu cầu và tình trạng của thú cưng.",
      },
      {
        tieuDe: "Thực hiện dịch vụ",
        noiDung: "Dịch vụ được thực hiện bởi nhân viên có kinh nghiệm.",
      },
      {
        tieuDe: "Bàn giao và dặn dò",
        noiDung:
          "Bàn giao thú cưng cho bạn kèm hướng dẫn chăm sóc sau dịch vụ.",
      },
    ],
    loiIch: [
      "Nhân viên giàu kinh nghiệm.",
      "Giá rõ ràng, không phát sinh thêm.",
    ],
    luuY: ["Nên đặt lịch trước để được phục vụ chu đáo."],
    cauHoi: [],
  };
}
