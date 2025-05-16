import React from 'react';
import { Nav, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import {
  BsPersonCircle, BsPencilSquare, BsKey, BsFileEarmarkText, BsClockHistory,
  BsPeople, BsBook, BsGear, BsShieldCheck
} from 'react-icons/bs';
// Placeholder for avatar - replace with actual image path or dynamic loading
import userAvatar from '../../assets/avatar-1.png'; // Assuming you have an avatar image

const ProfileSidebar = () => {
  const { section } = useParams();

  const sidebarNavItems = [
    {
      icon: <BsPersonCircle size={20} className="me-2" />,
      text: 'Hồ sơ cá nhân',
      basePath: 'profile', 
      subItems: [
        { text: 'Hồ sơ tài khoản', pathSuffix: undefined, id: 'details' }, // Default, no suffix or specific id
        { text: 'Chỉnh sửa thông tin', pathSuffix: 'edit', id: 'edit' },
        { text: 'Đổi mật khẩu', pathSuffix: 'change-password', id: 'change-password' }
      ]
    },
    { icon: <BsFileEarmarkText size={20} className="me-2" />, text: 'Tài liệu', pathSuffix: 'documents', basePath: 'profile', id: 'documents' },
    { icon: <BsClockHistory size={20} className="me-2" />, text: 'Lịch sử tham gia', pathSuffix: 'history', basePath: 'profile', id: 'history' },
    { icon: <BsPeople size={20} className="me-2" />, text: 'Nhóm học đang tham gia', pathSuffix: 'groups', basePath: 'profile', id: 'groups' },
    { icon: <BsBook size={20} className="me-2" />, text: 'Hướng dẫn sử dụng', pathSuffix: 'guides', basePath: 'profile', id: 'guides' },
    { icon: <BsGear size={20} className="me-2" />, text: 'Cài đặt', pathSuffix: 'settings', basePath: 'profile', id: 'settings' },
    { icon: <BsShieldCheck size={20} className="me-2" />, text: 'Điều khoản người dùng', pathSuffix: 'terms', basePath: 'profile', id: 'terms' }
  ];

  const getFullPath = (basePath, pathSuffix) => {
    return pathSuffix ? `/${basePath}/${pathSuffix}` : `/${basePath}`;
  };

  // Determine if a sub-item or main item is active
  const isActive = (item, subItem = null) => {
    const currentSection = section || 'details'; // Default to 'details' if section is undefined

    if (subItem) {
      return currentSection === subItem.id;
    }
    if (item.subItems) {
      return item.subItems.some(sub => currentSection === sub.id);
    }
    return currentSection === item.id;
  };


  return (
    <div className="profile-sidebar bg-white p-3 rounded shadow-sm mb-4">
      <div className="text-center mb-4">
        <Image src={userAvatar} roundedCircle width={80} height={80} className="mb-2" />
        <h5>Nguyễn Văn A</h5>
        {/* Link to the edit page, assuming 'edit-basic' is the same as 'edit' for now */}
        <Link to={getFullPath('profile', 'edit')} className="text-decoration-none text-primary small">
          <BsPencilSquare className="me-1" /> Sửa hồ sơ
        </Link>
      </div>
      <Nav className="flex-column profile-nav">
        {sidebarNavItems.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {item.subItems ? (
              <>
                <Nav.Link
                  as={Link}
                  // Link to the first subitem or the active one if applicable
                  to={getFullPath(item.basePath, item.subItems.find(sub => isActive(item, sub))?.pathSuffix || item.subItems[0].pathSuffix)}
                  className={`d-flex align-items-center ${isActive(item) ? 'active' : ''}`}
                >
                  {item.icon} {item.text} <span className="ms-auto">{isActive(item) ? '▼' : '▶'}</span>
                </Nav.Link>
                {isActive(item) && ( // Show sub-items if the parent group is active
                  <Nav className="flex-column ms-3">
                    {item.subItems.map((subItem) => (
                      <Nav.Link
                        key={subItem.id}
                        as={Link}
                        to={getFullPath(item.basePath, subItem.pathSuffix)}
                        className={isActive(item, subItem) ? 'active-subitem fw-bold' : ''}
                      >
                        {subItem.text}
                      </Nav.Link>
                    ))}
                  </Nav>
                )}
              </>
            ) : (
              <Nav.Link
                as={Link}
                to={getFullPath(item.basePath, item.pathSuffix)}
                className={`d-flex align-items-center ${isActive(item) ? 'active' : ''}`}
              >
                {item.icon} {item.text}
              </Nav.Link>
            )}
          </React.Fragment>
        ))}
      </Nav>
    </div>
  );
};

export default ProfileSidebar;
