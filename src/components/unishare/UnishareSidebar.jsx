import React from 'react';
import { Nav, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import userAvatar from '../../assets/avatar-1.png'; // Import from assets folder
import { FaHome, FaUsers, FaComments, FaHistory, FaCog, FaFileContract, FaPlus } from 'react-icons/fa';

const UnshareSidebar = ({ activeSection = 'home' }) => {
  return (
    <>
      <div
        className="sidebar bg-white shadow-sm mb-4 p-3"
        style={{
          border: '2px solid #b3d8f6',
          borderRadius: '1rem',
          minWidth: 250,
        }}
      >
        <Link to="/unishare/create-course" className="text-decoration-none">
          <Button
            variant="primary"
            className="w-100 mb-3 d-flex align-items-center justify-content-center fw-bold"
            style={{
              background: 'linear-gradient(90deg, #0370b7 60%, #4fc3f7 100%)',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(3,112,183,0.08)'
            }}
          >
            <FaPlus className="me-2" /> Tạo nhóm học
          </Button>
        </Link>
        
        <Nav className="flex-column gap-1">
          <Nav.Link
            as={Link}
            to="/unishare"
            active={activeSection === 'home'}
            className={`d-flex align-items-center py-2 px-3 fw-bold ${activeSection !== 'home' ? 'text-primary sidebar-link' : ''}`}
            style={{
              borderRadius: '0.5rem',
              marginBottom: 2,
              boxShadow: activeSection === 'home' ? '0 1px 4px rgba(3,112,183,0.04)' : 'none',
            }}
          >
            <FaHome className="me-2" />
            Trang chủ
          </Nav.Link>
          
          <Nav.Link
            as={Link}
            to="/unishare/my-groups"
            active={activeSection === 'my-groups'}
            className={`d-flex align-items-center py-2 px-3 fw-bold ${activeSection !== 'my-groups' ? 'text-primary sidebar-link' : ''}`}
            style={{ borderRadius: '0.5rem' }}
          >
            <FaUsers className="me-2" />
            Nhóm của tôi
          </Nav.Link>
          
          <Nav.Link
            as={Link}
            to="/unishare/messages"
            active={activeSection === 'messages'}
            className={`d-flex align-items-center py-2 px-3 fw-bold ${activeSection !== 'messages' ? 'text-primary sidebar-link' : ''}`}
            style={{ borderRadius: '0.5rem' }}
          >
            <FaComments className="me-2" />
            Tin nhắn
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/unishare/history"
            active={activeSection === 'history'}
            className={`d-flex align-items-center py-2 px-3 fw-bold ${activeSection !== 'history' ? 'text-primary sidebar-link' : ''}`}
            style={{ borderRadius: '0.5rem' }}
          >
            <FaHistory className="me-2" />
            Lịch sử tham gia
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/unishare/settings"
            active={activeSection === 'settings'}
            className={`d-flex align-items-center py-2 px-3 fw-bold ${activeSection !== 'settings' ? 'text-primary sidebar-link' : ''}`}
            style={{ borderRadius: '0.5rem' }}
          >
            <FaCog className="me-2" />
            Cài đặt
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/unishare/terms"
            active={activeSection === 'terms'}
            className={`d-flex align-items-center py-2 px-3 fw-bold ${activeSection !== 'terms' ? 'text-primary sidebar-link' : ''}`}
            style={{ borderRadius: '0.5rem' }}
          >
            <FaFileContract className="me-2" />
            Điều khoản người dùng
          </Nav.Link>
        </Nav>
      </div>
      <div
        className="announcements bg-white shadow-sm p-3"
        style={{
          border: '2px solid #b3d8f6',
          borderRadius: '1rem',
        }}
      >
        <h5 className="mb-3 fw-bold" style={{ color: '#0370b7', fontSize: '1.15rem' }}>Thông báo</h5>
        {[
          { id: 1, title: 'Học React Js Cơ bản', time: 'Thông báo làm bài tập...', avatar: userAvatar, instructor: 'Học React Js Cơ bản' },
          { id: 2, title: 'Học React Js Cơ bản', time: 'Thông báo làm bài tập...', avatar: userAvatar, instructor: 'Học React Js Cơ bản' },
          { id: 3, title: 'Học React Js Cơ bản', time: 'Thông báo làm bài tập...', avatar: userAvatar, instructor: 'Học React Js Cơ bản' },
          { id: 4, title: 'Học React Js Cơ bản', time: 'Thông báo làm bài tập...', avatar: userAvatar, instructor: 'Học React Js Cơ bản' },
          { id: 5, title: 'Học React Js Cơ bản', time: 'Thông báo làm bài tập...', avatar: userAvatar, instructor: 'Học React Js Cơ bản' },
        ].map((item, idx, arr) => (
          <div
            key={item.id}
            className={`announcement-item d-flex align-items-center mb-3 pb-3${idx !== arr.length - 1 ? ' border-bottom' : ''}`}
            style={{ borderColor: '#e3f1fb' }}
          >
            <Image
              src={item.avatar}
              roundedCircle
              width={32}
              height={32}
              className="me-2"
              style={{ border: '1.5px solid #b3d8f6' }}
            />
            <div>
              <strong className="d-block" style={{ color: '#0370b7', fontSize: '0.98rem' }}>{item.instructor}</strong>
              <small className="text-muted" style={{ fontSize: '0.85rem' }}>{item.time}</small>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .sidebar-link:hover {
          background: #e3f1fb !important;
          color: #0370b7 !important;
        }
        .sidebar .nav-link.active, .sidebar .nav-link.active:focus {
          background: #0370b7 !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
};

export default UnshareSidebar;
