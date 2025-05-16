import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const iconStyle = { 
    color: '#0070C0',
    fontSize: '16px'
  };

  return (
    <form>
      {/* Email Field */}
      <div className="mb-3">
        <div className="input-group">
          <span
            className="input-group-text bg-white"
            style={{
              border: '2px solid #0070C0',
              borderRight: 0,
              borderRadius: '50px 0 0 50px'
            }}
          >
            <FaEnvelope style={iconStyle} />
          </span>
          <input
            type="email"
            className="form-control bg-white"
            style={{
              border: '2px solid #0070C0',
              borderLeft: 0,
              borderRadius: '0 50px 50px 0'
            }}
            placeholder="Email"
            required
          />
        </div>
      </div>
      
      {/* Password Field */}
      <div className="mb-3">
        <div className="input-group">
          <span
            className="input-group-text bg-white"
            style={{
              border: '2px solid #0070C0',
              borderRight: 0,
              borderRadius: '50px 0 0 50px'
            }}
          >
            <FaLock style={iconStyle} />
          </span>
          <input
            type="password"
            className="form-control bg-white"
            style={{
              border: '2px solid #0070C0',
              borderLeft: 0,
              borderRadius: '0 50px 50px 0'
            }}
            placeholder="Mật khẩu"
            required
          />
        </div>
      </div>
      
      {/* Forgot Password Link */}
      <div className="text-end mb-3">
        <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#0070C0' }}>Quên mật khẩu?</Link>
      </div>
      
      {/* Login Button */}
      <div className="d-grid mb-3">
        <button type="submit" className="btn text-white fw-bold" style={{ backgroundColor: '#0070C0', borderColor: '#0070C0', padding: '10px 0', textTransform: 'uppercase' }}>
          Đăng Nhập
        </button>
      </div>
      
      {/* Register Link */}
      <div className="text-center mb-3">
        <small>Chưa có tài khoản? <Link to="/register" style={{ color: '#0070C0', fontWeight: 'bold' }}>Đăng ký ngay</Link></small>
      </div>
    </form>
  );
};

export default LoginForm;
