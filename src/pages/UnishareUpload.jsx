import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import subcomponents
import UnishareSidebar from '../components/unishareupload/UnishareSidebar';
import UploadForm from '../components/unishareupload/UploadForm';
import MyFiles from '../components/unishareupload/MyFiles';
import SharedFiles from '../components/unishareupload/SharedFiles';
import UploadHistory from '../components/unishareupload/UploadHistory';
import TrashFiles from '../components/unishareupload/TrashFiles';
import Welcome from '../components/unishareupload/Welcome';

const UniShareUpload = ({ activeSection: propSection }) => {
  const { section: paramSection } = useParams();
  const navigate = useNavigate();
  
  // Use the prop if available, otherwise fallback to URL param, then default to 'home'
  const activeSection = propSection || paramSection || 'home';
  
  // If navigating directly to /unishare/upload without a section, show home by default
  useEffect(() => {
    if (!propSection && !paramSection) {
      navigate('/unishare/home');
    }
  }, [propSection, paramSection, navigate]);

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return <UploadForm />;
      case 'my-files':
        return <MyFiles />;
      case 'shared':
        return <SharedFiles />;
      case 'history':
        return <UploadHistory />;
      case 'trash':
        return <TrashFiles />;
      case 'home':
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      <Header />
      <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
        <Container>
          <Row>
            {/* Left sidebar */}
            <Col md={3}>
              <UnishareSidebar activeSection={activeSection} />
            </Col>

            {/* Main content area */}
            <Col md={9}>
              <div className="bg-white rounded p-4 shadow-sm" style={{ borderRadius: '0.75rem' }}>
                {renderContent()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default UniShareUpload;
