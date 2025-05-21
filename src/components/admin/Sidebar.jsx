import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaBook, FaUsers, FaUserFriends, 
         FaUserShield, FaKey, 
         FaCog, FaQuestionCircle } from 'react-icons/fa';

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

  // Group menu items based on functionality areas from the permission structure
  const menuItems = [
    { icon: FaHome, text: 'Trang Chủ', link: '/admin/home', active: currentPath === '/admin/home' },
    { icon: FaChartBar, text: 'Dashboard', link: '/admin/dashboard', active: currentPath === '/admin/dashboard' },
    { icon: FaBook, text: 'Quản Lý Tài Liệu', link: '/admin/documents', active: currentPath.includes('/admin/documents') },
    { icon: FaUsers, text: 'Quản Lý Người Dùng', link: '/admin/users', active: currentPath === '/admin/users' },
    { icon: FaUserFriends, text: 'Quản Lý Nhóm', link: '/admin/groups', active: currentPath.includes('/admin/groups') },
    { icon: FaUserShield, text: 'Quản Lý Báo Cáo', link: '/admin/reports', active: currentPath === '/admin/reports' },
    { icon: FaKey, text: 'Quản Lý Phân Quyền', link: '/admin/permissions', active: currentPath === '/admin/permissions' },
  ];

  const otherItems = [
    { icon: FaCog, text: 'Cài Đặt', link: '/admin/settings', active: currentPath === '/admin/settings' },
    { icon: FaQuestionCircle, text: 'Giúp Đỡ', link: '/admin/help', active: currentPath === '/admin/help' },
  ];

  return (
    <div className="admin-sidebar bg-white shadow-sm p-3 h-100">
      <div className="sidebar-brand mb-4 py-2">
        <h5 className="mb-0 fw-bold text-primary">UNISHARE ADMIN</h5>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavItem 
            key={index}
            icon={item.icon}
            text={item.text}
            link={item.link}
            active={item.active}
          />
        ))}
        
        <div className="sidebar-divider my-3"></div>
        
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
  );
};

export default Sidebar;
