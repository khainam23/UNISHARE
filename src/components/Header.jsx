import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import uniShareLogo from '../assets/unishare-logo.png'; // Use the same import as footer
import userAvatar from '../assets/avatar-1.png';

const Header = () => {
  const isLoggedIn = true;

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
          </Nav>
          {isLoggedIn ? (
            <Nav className="align-items-center">
              <Nav.Link href="#notifications" className="me-2">
                <FaBell size={20} style={{ color: '#0370b7' }} />
              </Nav.Link>
              <NavDropdown
                title={
                  <>
                    <Image
                      src={userAvatar}
                      roundedCircle
                      className="me-2"
                      style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    />
                    Nguyễn Văn A
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
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/logout">
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Button as={Link} to="/login" variant="primary" className="rounded-pill">Đăng nhập</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
