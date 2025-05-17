import React, { useState, useEffect } from 'react';
import { Nav, Image, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import {
  BsPersonCircle, BsPencilSquare, BsKey, BsFileEarmarkText, BsClockHistory,
  BsPeople, BsBook, BsGear, BsShieldCheck
} from 'react-icons/bs';
import { authService } from '../../services';
import defaultAvatar from '../../assets/avatar-1.png';

const ProfileSidebar = ({ activeSection }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // First get from local storage
        let userData = authService.getUser();
        if (userData) {
          setUser(userData);
        }

        // Then refresh from API
        const freshUser = await authService.getCurrentUser();
        if (freshUser) {
          setUser(freshUser);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for storage updates (e.g. avatar changes)
    const handleStorageChange = () => {
      const updatedUser = authService.getUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const sidebarNavItems = [
    {
      icon: <BsPersonCircle size={20} className="me-2" />,
      text: 'Hồ sơ cá nhân',
      basePath: 'profile',
      subItems: [
        { text: 'Hồ sơ tài khoản', pathSuffix: undefined, id: 'details' },
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

  const isActive = (item, subItem = null) => {
    const currentSection = activeSection || 'details';

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
        {loading ? (
          <div className="py-2">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <>
            <Image 
              src={user?.avatar || defaultAvatar} 
              roundedCircle 
              width={80} 
              height={80} 
              className="mb-2"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <h5>{user?.name || 'Người dùng'}</h5>
            <Link to="/profile/edit" className="text-decoration-none text-primary small">
              <BsPencilSquare className="me-1" /> Sửa hồ sơ
            </Link>
          </>
        )}
      </div>

      <Nav className="flex-column profile-nav">
        {sidebarNavItems.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {item.subItems ? (
              <>
                <Nav.Link
                  as={Link}
                  to={getFullPath(item.basePath, item.subItems.find(sub => isActive(item, sub))?.pathSuffix || item.subItems[0].pathSuffix)}
                  className={`d-flex align-items-center ${isActive(item) ? 'active' : ''}`}
                >
                  {item.icon} {item.text} <span className="ms-auto">{isActive(item) ? '▼' : '▶'}</span>
                </Nav.Link>
                {isActive(item) && (
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
