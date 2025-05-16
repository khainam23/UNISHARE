import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileAvatarSection from '../components/profile/ProfileAvatarSection';
import EditProfileInfoForm from '../components/profile/EditProfileInfoForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import DocumentsList from '../components/profile/DocumentsList';
import ParticipationHistory from '../components/profile/ParticipationHistory';
import CurrentGroups from '../components/profile/CurrentGroups';
import { authService } from '../services';

const ProfilePage = () => {
  const { section } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        setLoading(true);
        const isLoggedIn = authService.isLoggedIn();
        
        if (!isLoggedIn) {
          navigate('/login');
          return;
        }
        
        // Optionally refresh user data
        await authService.getCurrentUser();
      } catch (error) {
        console.error("Authentication error:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Define page content based on section
  let currentTitle = "Hồ Sơ Tài Khoản";
  let currentDescription = "Quản lý thông tin hồ sơ cá nhân để bảo mật";
  let ContentComponent;

  switch (section) {
    case 'edit':
      currentTitle = "Chỉnh sửa thông tin";
      currentDescription = "Cập nhật thông tin cá nhân của bạn.";
      ContentComponent = <EditProfileInfoForm />;
      break;
    case 'change-password':
      currentTitle = "Đổi mật khẩu";
      currentDescription = "";
      ContentComponent = <ChangePasswordForm />;
      break;
    case 'documents':
      currentTitle = "Tài liệu của tôi";
      currentDescription = "";
      ContentComponent = <DocumentsList />;
      break;
    case 'history':
      currentTitle = "Lịch sử hoạt động";
      currentDescription = "";
      ContentComponent = <ParticipationHistory />;
      break;
    case 'groups':
      currentTitle = "Nhóm đang tham gia";
      currentDescription = "";
      ContentComponent = <CurrentGroups />;
      break;
    default:
      ContentComponent = (
        <Row>
          <Col md={8}>
            <ProfileForm />
          </Col>
          <Col md={4}>
            <ProfileAvatarSection />
          </Col>
        </Row>
      );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-page-wrapper" style={{ backgroundColor: '#e9f5ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Container>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Đang tải thông tin tài khoản...</p>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-page-wrapper" style={{ backgroundColor: '#e9f5ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Container>
          <Row>
            {/* Sidebar */}
            <Col md={3}>
              <ProfileSidebar activeSection={section || 'profile'} />
            </Col>

            {/* Main Content */}
            <Col md={9}>
              <div className="profile-content bg-white p-4 rounded shadow-sm">
                <h3 className="mb-1">{currentTitle}</h3>
                {currentDescription && (
                  <p className="text-muted mb-4">{currentDescription}</p>
                )}
                <hr />
                {ContentComponent}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
