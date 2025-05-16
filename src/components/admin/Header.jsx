import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import userAvatar from '../../assets/avatar-1.png';

const Header = () => {
  return (
    <header className="admin-header" style={{ padding: '15px 20px' }}>
      <div className="container-fluid px-0">
        <div className="row align-items-center">
          <div className="col">
            <div className="search-bar position-relative">
              <input 
                type="text" 
                className="form-control"
                placeholder="Tìm kiếm..." 
                style={{ 
                  height: '38px', 
                  paddingLeft: '38px', 
                  paddingRight: '15px',
                  fontSize: '13px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px'
                }}
              />
              <FaSearch 
                className="position-absolute text-muted" 
                style={{ left: '14px', top: '12px', fontSize: '13px' }}
              />
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <div className="notification-bell position-relative me-3">
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaBell size={16} color="#555" />
                  <span 
                    className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.6rem' }}
                  >
                    3
                  </span>
                </div>
              </div>
              <div className="user-profile d-flex align-items-center">
                <div className="user-avatar me-2">
                  <img 
                    src={userAvatar}
                    alt="User" 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <span className="fw-medium d-block" style={{ fontSize: '13px', color: '#333' }}>
                    Nguyễn Minh Tiến
                  </span>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Admin</small>
                </div>
                <div className="ms-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
