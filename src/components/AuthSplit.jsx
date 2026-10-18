// Bố cục chia đôi dùng chung (Đăng nhập, Đăng ký, Quên mật khẩu, Đặt lịch):
// một bên là form, một bên là ảnh kèm logo và tên thương hiệu.
function AuthSplit({ anh, tieuDe, moTa, chanTrang, rong, children }) {
  return (
    <div className={`auth-split ${rong ? "auth-split-wide" : ""}`}>
      <div className="auth-split-form">
        <div className="auth-split-form-inner">
          <h1>{tieuDe}</h1>
          {moTa && <p className="auth-split-sub">{moTa}</p>}
          {children}
        </div>
      </div>

      <div
        className="auth-split-art"
        style={{ backgroundImage: `url(${anh})` }}
      >
        <div className="auth-split-art-overlay">
          <div className="auth-brand">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="8" r="2.2" />
              <circle cx="12" cy="5" r="2.2" />
              <circle cx="18" cy="8" r="2.2" />
              <path d="M12 12c-4 0-7 2.7-7 6 0 1.7 1.3 3 3 3 1.6 0 2-1 4-1s2.4 1 4 1c1.7 0 3-1.3 3-3 0-3.3-3-6-7-6z" />
            </svg>
            <span className="auth-brand-name">PetCare</span>
            <p className="auth-brand-tagline">
              Chăm sóc thú cưng, đặt lịch chỉ trong 1 phút
            </p>
          </div>
          {chanTrang && <div className="auth-art-footer">{chanTrang}</div>}
        </div>
      </div>
    </div>
  );
}

export default AuthSplit;
