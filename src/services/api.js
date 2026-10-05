import axios from "axios";

// Đây là "cầu nối" duy nhất giữa Frontend và Backend.
// Đổi đúng địa chỉ + cổng mà project PetCare.API đang chạy (xem trong Properties/launchSettings.json
// hoặc dòng chữ hiện lên khi bạn bấm F5 chạy Backend trong Visual Studio).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:62747/api",
});

// Interceptor: đoạn code này tự động chạy TRƯỚC MỌI request gửi đi,
// tự lấy token đã lưu (sau khi đăng nhập) và đính kèm vào header Authorization.
// Nhờ vậy các trang gọi API không cần tự viết lại việc gắn token mỗi lần.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Các hàm gọi API cho từng nhóm chức năng — Component chỉ cần gọi các hàm này,
// không cần biết chi tiết địa chỉ endpoint hay cú pháp axios.
// Dịch vụ đang hoạt động - dùng cho trang chủ & form đặt lịch của khách hàng
export const getServices = () => api.get("/services");

// TẤT CẢ dịch vụ, kể cả dịch vụ đã ngừng cung cấp - chỉ dùng ở trang quản trị,
// để Admin còn nhìn thấy và bật lại được những dịch vụ đang tắt
export const getAllServices = () => api.get("/services/all");
export const getAppointments = () => api.get("/appointments");
export const createAppointment = (data) => api.post("/appointments", data);
export const cancelAppointment = (id) => api.put(`/appointments/${id}/huy`);
// Cập nhật trạng thái lịch hẹn (xác nhận, hoàn tất...) - chỉ Nhân viên/Admin gọi được
export const updateAppointmentStatus = (id, trangThai) =>
  api.put(`/appointments/${id}/trang-thai`, { trangThaiMoi: trangThai });

// Gọi API đăng ký tài khoản mới - data là object { hoTen, email, soDienThoai, matKhau }
export const registerUser = (data) => api.post("/auth/register", data);

// Gọi API đăng nhập - data là object { email, matKhau }
export const loginUser = (data) => api.post("/auth/login", data);

// Chỉ Admin gọi được - tạo tài khoản Nhân viên/Admin mới
// data là object { hoTen, email, soDienThoai, matKhau, vaiTro }
export const registerStaff = (data) => api.post("/auth/register-staff", data);

// Lấy danh sách thú cưng - dùng để đổ vào ô chọn (dropdown) trong form đặt lịch
export const getPets = () => api.get("/pets");

// Lấy danh sách nhân sự - dùng để đổ vào ô chọn nhân viên/bác sĩ thực hiện dịch vụ
export const getStaff = () => api.get("/staff");
export const getStaffAccounts = () => api.get("/staff/accounts");

// Số liệu thống kê tổng quan cho trang Admin (lịch hẹn hôm nay, doanh thu, khách hàng...)
export const getDashboard = () => api.get("/admin/dashboard");

// doanh thu theo dịch vụ
export const getRevenueByService = () =>
  api.get("/admin/doanh-thu-theo-dich-vu");
// Danh sách khách hàng - chỉ Admin xem được
export const getCustomers = () => api.get("/admin/customers");

// Quản lý Dịch vụ (thêm/sửa/xóa) - chỉ Admin gọi được
export const createService = (data) => api.post("/services", data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Quản lý Nhân sự (thêm/sửa/xóa) - chỉ Admin gọi được
export const createStaffMember = (data) => api.post("/staff", data);
export const updateStaffMember = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaffMember = (id) => api.delete(`/staff/${id}`);

export const getMedicalRecords = (thuCungId) =>
  api.get(`/medicalrecords?thuCungId=${thuCungId}`);
export const createMedicalRecord = (data) => api.post("/medicalrecords", data);

export const getMyPets = () => api.get("/pets/mine");
export const createPet = (data) => api.post(`/pets`, data);
export const updatePet = (id, data) => api.put(`/pets/${id}`, data);
export const deletePet = (id) => api.delete(`/pets/${id}`);
// chatbot
export const askChatbot = (cauHoi) => api.post("/chatbot/ask", { cauHoi });
export const getChatbotLogs = () => api.get("/chatbot/logs");

export const getMyAppointments = () => api.get("/appointments/mine");

export const getAdminPets = () => api.get("/admin/pets");

export const thanhToanLichHen = (id) =>
  api.put(`/appointments/${id}/thanh-toan`);

// Tiêm phòng (Bác sĩ + Admin)
export const getVaccinations = (thuCungId) =>
  api.get(thuCungId ? `/vaccinations?thuCungId=${thuCungId}` : "/vaccinations");
export const createVaccination = (data) => api.post("/vaccinations", data);
export const updateVaccination = (id, data) =>
  api.put(`/vaccinations/${id}`, data);
export const deleteVaccination = (id) => api.delete(`/vaccinations/${id}`);

// Phẫu thuật (Bác sĩ + Admin)
export const getSurgeries = (thuCungId) =>
  api.get(thuCungId ? `/surgeries?thuCungId=${thuCungId}` : "/surgeries");
export const createSurgery = (data) => api.post("/surgeries", data);
export const updateSurgery = (id, data) => api.put(`/surgeries/${id}`, data);
export const deleteSurgery = (id) => api.delete(`/surgeries/${id}`);

// Sản phẩm (Nhân viên spa + Admin)
export const getProducts = () => api.get("/products");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Sản phẩm - xem công khai (khách, kể cả chưa đăng nhập)
export const getPublicProducts = () => api.get("/products/public");

// Đơn hàng
export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/mine");
export const cancelOrder = (id) => api.put(`/orders/${id}/huy`);
export const thanhToanDonHang = (id) => api.put(`/orders/${id}/thanh-toan`);

// Quản lý đơn hàng - Nhân viên/Admin
export const getAllOrders = () => api.get("/orders");
export const updateOrderStatus = (id, trangThai) =>
  api.put(`/orders/${id}/trang-thai`, { trangThaiMoi: trangThai });

// Lịch làm việc
export const getMyWorkSchedule = () => api.get("/workschedules/mine");
export const getAllWorkSchedules = () => api.get("/workschedules");
export const createWorkSchedule = (data) => api.post("/workschedules", data);
export const updateWorkSchedule = (id, data) =>
  api.put(`/workschedules/${id}`, data);
export const deleteWorkSchedule = (id) => api.delete(`/workschedules/${id}`);
// Hồ sơ cá nhân của người đang đăng nhập
export const getProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);

// Quên mật khẩu (khách hàng): data là { email, soDienThoai, matKhauMoi }
export const forgotPassword = (data) => api.post("/auth/quen-mat-khau", data);

// Phản hồi: khách gửi đánh giá/khiếu nại/góp ý, Admin xem và trả lời
export const createFeedback = (data) => api.post("/feedback", data);
export const getMyFeedback = () => api.get("/feedback/mine");
export const getAllFeedback = () => api.get("/feedback");
export const replyFeedback = (id, traLoi) =>
  api.put(`/feedback/${id}/tra-loi`, { traLoi });

export default api;
