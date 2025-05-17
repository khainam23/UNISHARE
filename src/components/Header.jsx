import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Image, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import uniShareLogo from '../assets/unishare-logo.png';
import userAvatar from '../assets/avatar-1.png';
import { authService } from '../services';
import { isAdmin, isModerator } from '../utils/roleUtils';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status when component mounts
    const checkLoginStatus = async () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          // First set from localStorage (faster)
          const localUser = authService.getUser();
          if (localUser) {
            setUser(localUser);
          }
          
          // Then refresh from API (to get the latest data)
          const freshUser = await authService.getCurrentUser();
          if (freshUser) {
            setUser(freshUser);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    
    checkLoginStatus();
    
    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={uniShareLogo}
            alt="UniShare Logo"
            style={{ height: '40px', objectFit: 'contain' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/unishare">UniShare</Nav.Link>
            <Nav.Link as={Link} to="/about">Về UniSHARE</Nav.Link>
            <Nav.Link as={Link} to="/groups">Group</Nav.Link>
            <Nav.Link as={Link} to="/lecturers">Giảng Viên</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/contact">Liên hệ</Nav.Link>
            
            {/* Show Admin link for admin and moderator users */}
            {isLoggedIn && user && (isAdmin(user) || isModerator(user)) && (
              <Nav.Link as={Link} to="/admin" className="text-danger">
                Quản trị
                {isAdmin(user) && <Badge bg="danger" className="ms-1">Admin</Badge>}
                {isModerator(user) && !isAdmin(user) && <Badge bg="warning" className="ms-1">Mod</Badge>}
              </Nav.Link>
            )}
          </Nav>
          {isLoggedIn && user ? (
            <Nav className="align-items-center">
              <Nav.Link href="#notifications" className="me-2">
                <FaBell size={20} style={{ color: '#0370b7' }} />
              </Nav.Link>
              <NavDropdown
                title={
                  <>
                    <Image
                      src={user.avatar || userAvatar}
                      roundedCircle
                      className="me-2"
                      style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = userAvatar;
                      }}
                    />
                    {user.name}
                  </>
                }
                id="user-profile-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Hồ Sơ Tài Khoản
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile/settings">
                  Cài đặt
                </NavDropdown.Item>
                {(isAdmin(user) || isModerator(user)) && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Quản trị hệ thống
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <div className="d-flex gap-2">
              <Button as={Link} to="/login" variant="primary" className="rounded-pill">Đăng nhập</Button>
              <Button as={Link} to="/register" variant="outline-primary" className="rounded-pill">Đăng ký</Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
