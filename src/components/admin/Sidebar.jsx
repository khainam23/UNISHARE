import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaChartBar,
  FaEnvelope,
  FaUserShield,
  FaUsers,
  FaUserGraduate,
  FaUserFriends,
  FaCog,
  FaWallet,
  FaQuestionCircle,
  FaKey
} from 'react-icons/fa';
import uniShareLogo from '../../assets/unishare-logo.png';

const NavItem = ({ icon: Icon, text, link, active }) => (
  <Link
    to={link}
    className={`nav-link d-flex align-items-center py-3 px-3 rounded-3 mb-2`}
    style={{
      color: active ? '#ffffff' : '#5A5A5A',
      backgroundColor: active ? '#55A5E9' : 'transparent',
      fontSize: '14px',
      fontWeight: '400'
    }}
  >
    <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '20px' }}>
      <Icon size={16} />
    </div>
    <span>{text}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: FaHome, text: 'Trang Chủ', link: '/admin/home', active: currentPath === '/admin/home' },
    { icon: FaChartBar, text: 'Dashboard', link: '/admin/dashboard', active: currentPath === '/admin/dashboard' },
    { icon: FaEnvelope, text: 'Tin Nhắn', link: '/admin/messages', active: currentPath === '/admin/messages' },
    { icon: FaUserShield, text: 'Quản Lý Báo Cáo', link: '/admin/reports', active: currentPath === '/admin/reports' },
    { icon: FaUsers, text: 'Quản Lý Người Dùng', link: '/admin/users', active: currentPath === '/admin/users' },
    { icon: FaUserGraduate, text: 'Quản Lý Nhóm Học', link: '/admin/study-groups', active: currentPath === '/admin/study-groups' },
    { icon: FaKey, text: 'Quản Lý Phân Quyền', link: '/admin/permissions', active: currentPath === '/admin/permissions' },
  ];

  const otherItems = [
    { icon: FaCog, text: 'Cài Đặt', link: '/admin/settings', active: currentPath === '/admin/settings' },
    { icon: FaWallet, text: 'Tài Khoản', link: '/admin/account', active: currentPath === '/admin/account' },
    { icon: FaQuestionCircle, text: 'Giúp Đỡ', link: '/admin/help', active: currentPath === '/admin/help' },
  ];

  return (
    <div className="sidebar" style={{ 
      width: '280px',
      backgroundColor: '#ffffff', 
      height: '100vh',
      borderRight: '1px solid #f0f0f0',
      padding: '24px 16px'
    }}>
      <div className="d-flex align-items-center px-3 mb-4">
        <img 
          src={uniShareLogo} 
          alt="UNISHARE" 
          style={{ height: '32px' }}
        />
      </div>
      
      <div className="px-2 mb-4">
        <small className="text-muted ps-2 mb-2 d-block" 
               style={{fontSize: '12px'}}>
          Menu
        </small>
        <div className="nav flex-column">
          {menuItems.map((item, index) => (
            <NavItem 
              key={index}
              icon={item.icon}
              text={item.text}
              link={item.link}
              active={item.active}
            />
          ))}
        </div>
      </div>

      <div className="px-2">
        <small className="text-muted ps-2 mb-2 d-block" 
               style={{fontSize: '12px'}}>
          Others
        </small>
        <div className="nav flex-column">
          {otherItems.map((item, index) => (
            <NavItem 
              key={index}
              icon={item.icon}
              text={item.text}
              link={item.link}
              active={item.active}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
