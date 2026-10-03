// đường dẫn được bảo vệ chặn không cho vào trang Admin nếu chưa đăng nhập hoặc sai vai trò
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const vaiTro = localStorage.getItem("vaiTro");

  if (!token) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(vaiTro)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
