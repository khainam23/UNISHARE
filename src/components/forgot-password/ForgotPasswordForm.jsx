import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaSyncAlt } from 'react-icons/fa';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would handle the forgot password request
    // For now, we'll simulate navigation to the next screen
    setTimeout(() => {
      window.location.href = '/reset-password';
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text" style={{ backgroundColor: 'white', border: '1px solid #ced4da' }}>
            <FaEnvelope style={{ color: '#0070C0' }} />
          </span>
          <input 
            type="email" 
            className="form-control" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text" style={{ backgroundColor: 'white', border: '1px solid #ced4da' }}>
            <FaSyncAlt style={{ color: '#0070C0' }} />
          </span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Mã xác nhận" 
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="d-flex justify-content-between mb-4">
        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ 
            borderRadius: '5px',
            width: '45%',
            backgroundColor: '#6c757d',
            border: 'none'
          }}
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
          style={{ 
            borderRadius: '5px',
            width: '45%',
            backgroundColor: '#0070C0',
            border: 'none'
          }}
        >
          Tiếp tục
        </button>
      </div>

      <div className="text-center mt-4 mb-3">
        <small>Đã nhớ mật khẩu? <Link to="/login" style={{ color: '#0070C0', fontWeight: 'bold' }}>Đăng nhập ngay</Link></small>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
