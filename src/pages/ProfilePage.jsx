import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; // Import useParams
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileAvatarSection from '../components/profile/ProfileAvatarSection';
import EditProfileInfoForm from '../components/profile/EditProfileInfoForm'; // Import the new form
import ChangePasswordForm from '../components/profile/ChangePasswordForm'; // Import ChangePasswordForm
import DocumentsList from '../components/profile/DocumentsList'; // Import DocumentsList
import ParticipationHistory from '../components/profile/ParticipationHistory'; // Import ParticipationHistory
import CurrentGroups from '../components/profile/CurrentGroups'; // Import CurrentGroups

const ProfilePage = () => {
  const { section } = useParams(); // Get the section from URL, e.g., 'edit', 'change-password'

  let currentTitle = "Hồ Sơ Tài Khoản";
  let currentDescription = "Quản lý thông tin hồ sơ cá nhân để bảo mật";
  let ContentComponent = (
    <Row>
      <Col md={8}>
        <ProfileForm />
      </Col>
      <Col md={4}>
        <ProfileAvatarSection />
      </Col>
    </Row>
  );

  if (section === 'edit') {
    currentTitle = "Chỉnh sửa thông tin";
    currentDescription = "Cập nhật thông tin cá nhân của bạn."; // Or use the one from the image if more accurate
    ContentComponent = <EditProfileInfoForm />;
  } else if (section === 'change-password') {
    currentTitle = "Đổi mật khẩu";
    currentDescription = ""; // No description for change password page as per image
    ContentComponent = <ChangePasswordForm />;
  } else if (section === 'documents') {
    currentTitle = "Tài liệu";
    currentDescription = ""; // No description for documents page
    ContentComponent = <DocumentsList />;
  } else if (section === 'history') {
    currentTitle = "Lịch sử tham gia";
    currentDescription = ""; // No description for participation history page
    ContentComponent = <ParticipationHistory />;
  } else if (section === 'groups') {
    currentTitle = "Nhóm học đang tham gia";
    currentDescription = ""; // No description for current groups page
    ContentComponent = <CurrentGroups />;
  }
  // Add more conditions for other sections like 'documents', 'history', etc.

  return (
    <>
      <Header />
      <div className="profile-page-wrapper" style={{ backgroundColor: '#e9f5ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Container>
          <Row>
            {/* Sidebar */}
            <Col md={3}>
              <ProfileSidebar />
            </Col>

            {/* Main Content */}
            <Col md={9}>
              <div className="profile-content bg-white p-4 rounded shadow-sm">
                <h3 className="mb-1">{currentTitle}</h3>
                {/* Conditionally render description if it's relevant for the current view and not empty */}
                {(section === undefined || section === 'details' || section === 'edit') && currentDescription &&
                  <p className="text-muted mb-4">{currentDescription}</p>
                }
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
