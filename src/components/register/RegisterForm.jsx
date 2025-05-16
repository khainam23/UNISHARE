import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaUserGraduate, FaSyncAlt } from 'react-icons/fa';

const RegisterForm = () => {
  const iconStyle = { 
    color: '#0070C0',
    fontSize: '16px'
  };

  return (
    <form>
      {/* Name Field */}
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
            <FaUser style={iconStyle} />
          </span>
          <input
            type="text"
            className="form-control bg-white"
            style={{
              border: '2px solid #0070C0',
              borderLeft: 0,
              borderRadius: '0 50px 50px 0'
            }}
            placeholder="Tên đầy đủ"
            required
          />
        </div>
      </div>
      
      {/* Phone Field */}
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
            <FaPhoneAlt style={iconStyle} />
          </span>
          <input
            type="tel"
            className="form-control bg-white"
            style={{
              border: '2px solid #0070C0',
              borderLeft: 0,
              borderRadius: '0 50px 50px 0'
            }}
            placeholder="Số điện thoại"
            required
          />
        </div>
      </div>
      
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
      
      {/* Confirm Password Field */}
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
            placeholder="Xác nhận mật khẩu"
            required
          />
        </div>
      </div>
      
      {/* User Type Dropdown */}
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
            <FaUserGraduate style={iconStyle} />
          </span>
          <select
            className="form-select bg-white"
            style={{
              border: '2px solid #0070C0',
              borderLeft: 0,
              borderRadius: '0 50px 50px 0'
            }}
            required
          >
            <option value="" selected disabled>Lựa chọn vai trò</option>
            <option value="student">Học sinh / Sinh viên</option>
            <option value="teacher">Giáo viên / Giảng viên</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>
      
      {/* CAPTCHA */}
      <div className="mb-3 captcha-container">
        <div className="d-flex">
          <div
            className="captcha-box flex-grow-1 me-2 p-2 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: '#000',
              border: '2px solid #0070C0',
              borderRadius: '5px'
            }}
          >
            <span
              className="captcha-text fw-bold fs-5 text-white"
              style={{ letterSpacing: '2px' }}
            >
              678901
            </span>
          </div>
          <button type="button" className="btn btn-outline-secondary" style={{ width: '40px' }}>
            <FaSyncAlt />
          </button>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="terms" required />
        <label className="form-check-label" htmlFor="terms">
          <small>Tôi đồng ý với <Link to="/terms" style={{ color: '#0070C0' }}>điều kiện người dùng</Link></small>
        </label>
      </div>
      
      {/* Register Button */}
      <div className="d-grid mb-3">
        <button type="submit" className="btn text-white fw-bold" style={{ backgroundColor: '#0070C0', borderColor: '#0070C0', padding: '10px 0', textTransform: 'uppercase' }}>
          Đăng Ký
        </button>
      </div>
      
      {/* Login Link */}
      <div className="text-center mb-3">
        <small>Đã có tài khoản? <Link to="/login" style={{ color: '#0070C0', fontWeight: 'bold' }}>Đăng nhập ngay</Link></small>
      </div>
    </form>
  );
};

export default RegisterForm;
