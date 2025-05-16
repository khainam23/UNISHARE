import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import uniShareLogo from '../assets/unishare-logo.png';
import registerBackground from '../assets/register-background.png';
import { FaSync } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  
  const pageBackgroundStyle = {
    backgroundColor: '#d4eafb',
    backgroundImage: `url(${registerBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset submitted');
  };

  const handleCancel = () => {
    // Navigate back or to login
    window.history.back();
  };

  return (
    <div className="reset-password-page" style={pageBackgroundStyle}>
      <Header />
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <span className="breadcrumb-text" style={{ color: '#333' }}>Trang chủ &gt; Đặt lại mật khẩu</span>
          <Link to="/" className="back-link" style={{ color: '#003366', fontWeight: 500 }}>
            Đăng xuất <i className="fas fa-sign-out-alt"></i>
          </Link>
        </div>
      </div>

      <main className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="reset-password-container p-4 p-md-5 shadow" style={{ backgroundColor: '#fff', borderRadius: '12px' }}>
              <h2 className="text-center mb-4" style={{ fontSize: '1.75rem', color: '#0070C0', fontWeight: 'bold' }}>
                ĐẶT LẠI MẬT KHẨU
              </h2>

              <p className="text-center mb-4 small text-muted">
                Đã gửi liên kết xác nhận vào email của bạn:
              </p>

              <form onSubmit={handleSubmit}>
                {/* New Password Field */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Mật khẩu mới <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Xác nhận mật khẩu mới <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* CAPTCHA */}
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="captcha-box me-2 bg-dark text-white px-4 py-2" style={{ borderRadius: '4px' }}>
                      67R90
                    </div>
                    <button type="button" className="btn btn-outline-secondary" style={{ height: '38px', width: '38px' }}>
                      <FaSync />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CAPTCHA"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline-secondary flex-grow-1"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    style={{ backgroundColor: '#0070C0' }}
                  >
                    Xác nhận
                  </button>
                </div>
              </form>

              {/* Footer Logo */}
              <div className="text-center mt-5">
                <Link to="/">
                  <img
                    src={uniShareLogo}
                    alt="UNISHARE"
                    style={{ height: '60px', marginBottom: '10px' }}
                  />
                </Link>
                <div className="fw-bold text-primary">UNISHARE</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
