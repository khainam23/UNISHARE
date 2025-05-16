import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';
import uniShareLogo from '../assets/unishare-logo.png'; // Corrected path

const Footer = () => {
  return (
    <footer className="bg-white py-5">
      <Container>
        <Row className="mb-4">
          <Col md={3} className="mb-4 mb-md-0">
            <div className="mb-4">
              <Image src={uniShareLogo} alt="UNISHARE" style={{ maxWidth: '200px' }} />
            </div>
            <h5 className="text-primary mb-3">Thông Tin Liên Hệ :</h5>
            <div className="d-flex align-items-center mb-3">
              <div className="text-primary me-3">
                <i className="fas fa-phone-alt bg-light rounded-circle p-2 text-primary"></i>
              </div>
              <div>0917639460 / 0905817290</div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <div className="text-primary me-3">
                <i className="fas fa-envelope bg-light rounded-circle p-2 text-primary"></i>
              </div>
              <div>nnntt1223344@gmail.com</div>
            </div>
            <div className="d-flex align-items-center">
              <div className="text-primary me-3">
                <i className="fas fa-map-marker-alt bg-light rounded-circle p-2 text-primary"></i>
              </div>
              <div>254 Nguyễn Văn Linh , Phường Thác Gián , Quận Thanh Thế , Thành Phố Đà Nẵng</div>
            </div>
          </Col>
          
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="text-primary mb-4">Các Danh Mục :</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-dark">Về UNISHARE</Link>
              </li>
              <li className="mb-2">
                <Link to="/support" className="text-decoration-none text-dark">Hỗ Trợ</Link>
              </li>
              <li className="mb-2">
                <Link to="/lecturers" className="text-decoration-none text-dark">Giảng Viên</Link>
              </li>
              <li className="mb-2">
                <Link to="/resources" className="text-decoration-none text-dark">Tài Liệu</Link>
              </li>
              <li className="mb-2">
                <Link to="/groups" className="text-decoration-none text-dark">Group</Link>
              </li>
              <li>
                <Link to="/news" className="text-decoration-none text-dark">Tin Tức</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={{span: 3, offset: 3}}>
            <h5 className="text-primary mb-4">Theo Dõi Chúng Tôi :</h5>
            <div className="d-flex mb-4">
              <Link to="#" className="me-3">
                <FaFacebookF size={28} style={{color: '#1877F2'}} />
              </Link>
              <Link to="#" className="me-3">
                <FaYoutube size={28} style={{color: '#FF0000'}} />
              </Link>
              <Link to="#" className="me-3">
                <FaInstagram size={28} style={{color: '#C13584'}} />
              </Link>
              <Link to="#">
                <FaTwitter size={28} style={{color: '#000000'}} />
              </Link>
            </div>
            <div>
              <Link to="/privacy" className="text-decoration-none text-dark d-block mb-2">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="text-decoration-none text-dark">
                Điều khoản dịch vụ
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
