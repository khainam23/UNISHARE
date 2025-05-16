import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import uniShareLogo from '../assets/unishare-logo.png'; // Import logo
import registerBackground from '../assets/register-background.png';

const ForgotPasswordPage = () => {
  const pageBackgroundStyle = {
    backgroundColor: '#d4eafb',
    backgroundImage: `url(${registerBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh'
  };

  return (
    <div className="forgot-password-page" style={pageBackgroundStyle}>
      <Header />
      
      <div className="container my-3">
        <div className="d-flex justify-content-between align-items-center">
          <span className="breadcrumb-text" style={{ color: '#333' }}>Trang chủ &gt; Quên mật khẩu</span>
          <Link to="/" className="back-link" style={{ color: '#003366', fontWeight: 500 }}>Quay Lại <i className="fas fa-arrow-right"></i></Link>
        </div>
      </div>

      <main className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="forgot-password-container p-4 p-md-5 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '12px' }}>
              <h2 className="text-center mb-3" style={{ fontSize: '2rem', color: '#0070C0', fontWeight: 'bold' }}>QUÊN MẬT KHẨU</h2>
              
              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email đã đăng ký</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    placeholder="Nhập email của bạn" 
                    required 
                  />
                </div>
                
                <div className="mb-4">
                  <div className="d-flex align-items-center">
                    <div className="captcha-box me-2 p-2 bg-dark text-white" style={{ width: '60%', borderRadius: '5px' }}>
                      CAPTCHA
                    </div>
                    <button type="button" className="btn btn-outline-secondary" style={{ width: '40px' }}>
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nhập mã CAPTCHA" 
                    required 
                  />
                </div>
                
                <div className="d-flex justify-content-between mb-4">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ width: '45%' }}
                    onClick={() => window.history.back()}
                  >
                    Quay lại
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '45%', backgroundColor: '#0070C0' }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <img 
                  src={uniShareLogo} 
                  alt="Unishare Logo" 
                  style={{ height: '60px', marginBottom: '10px' }}
                />
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

export default ForgotPasswordPage;
