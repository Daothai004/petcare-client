import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import MyPets from "./pages/MyPets";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAppointments from "./pages/Admin/AdminAppointments";
import AdminServices from "./pages/Admin/AdminServices";
import AdminStaff from "./pages/Admin/AdminStaff";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminStaffAccounts from "./pages/Admin/AdminStaffAccounts";
import AdminMedicalRecords from "./pages/Admin/AdminMedicalRecords";
import AdminChatbotLogs from "./pages/Admin/AdminChatbotLogs";
import AdminPets from "./pages/Admin/AdminPets";
import AdminVaccinations from "./pages/Admin/AdminVaccinations";
import AdminSurgeries from "./pages/Admin/AdminSurgeries";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminWorkSchedule from "./pages/Admin/AdminWorkSchedule";
import AdminAllWorkSchedules from "./pages/Admin/AdminAllWorkSchedules";
import ChatWidget from "./components/ChatWidget";
import MyAppointments from "./pages/MyAppointments";
import PaymentPage from "./pages/PaymentPage";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import OrderPaymentPage from "./pages/OrderPaymentPage";
// App.jsx giờ không còn chứa giao diện thật nữa, mà chỉ đóng vai trò
// "bảng định tuyến" - quyết định địa chỉ (URL) nào thì hiển thị trang (component) nào.
// Giống như việc quản lý nhiều Form trong 1 project WinForms, nhưng thay vì
// gọi form2.Show(), ở đây React tự chuyển trang dựa theo địa chỉ trên thanh URL.

function App() {
  return (
    // BrowserRouter: "bọc" toàn bộ app để bật tính năng điều hướng nhiều trang
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dang-nhap" element={<Login />} />
                <Route path="/dang-ky" element={<Register />} />
                <Route path="/dat-lich" element={<BookAppointment />} />
                <Route
                  path="/thu-cung-cua-toi"
                  element={
                    <ProtectedRoute allowedRoles={["KhachHang"]}>
                      <MyPets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lich-hen-cua-toi"
                  element={
                    <ProtectedRoute allowedRoles={["KhachHang"]}>
                      <MyAppointments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/thanh-toan/:id"
                  element={
                    <ProtectedRoute allowedRoles={["KhachHang"]}>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/san-pham" element={<Products />} />
                <Route
                  path="/gio-hang"
                  element={
                    <ProtectedRoute allowedRoles={["KhachHang"]}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/don-hang-cua-toi"
                  element={
                    <ProtectedRoute allowedRoles={["KhachHang"]}>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/thanh-toan-don-hang/:id"
                  element={
                    <ProtectedRoute allowedRoles={["KhachHang"]}>
                      <OrderPaymentPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
              <ChatWidget />
            </>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["NhanVien", "QuanTriVien", "BacSiThuY"]}
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="lich-hen" element={<AdminAppointments />} />

          <Route
            path="benh-an"
            element={
              <ProtectedRoute allowedRoles={["BacSiThuY", "QuanTriVien"]}>
                <AdminMedicalRecords />
              </ProtectedRoute>
            }
          />

          <Route
            path="dich-vu"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="nhan-su"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="khach-hang"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="tai-khoan"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminStaffAccounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="chatbot-logs"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminChatbotLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="thu-cung"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminPets />
              </ProtectedRoute>
            }
          />
          <Route
            path="tiem-phong"
            element={
              <ProtectedRoute allowedRoles={["BacSiThuY", "QuanTriVien"]}>
                <AdminVaccinations />
              </ProtectedRoute>
            }
          />
          <Route
            path="phau-thuat"
            element={
              <ProtectedRoute allowedRoles={["BacSiThuY", "QuanTriVien"]}>
                <AdminSurgeries />
              </ProtectedRoute>
            }
          />
          <Route
            path="san-pham"
            element={
              <ProtectedRoute allowedRoles={["NhanVien", "QuanTriVien"]}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="don-hang"
            element={
              <ProtectedRoute allowedRoles={["NhanVien", "QuanTriVien"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="lich-lam-viec-cua-toi"
            element={
              <ProtectedRoute allowedRoles={["NhanVien", "BacSiThuY"]}>
                <AdminWorkSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="lich-lam-viec"
            element={
              <ProtectedRoute allowedRoles={["QuanTriVien"]}>
                <AdminAllWorkSchedules />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
