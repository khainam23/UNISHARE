import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; // Import useParams
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnishareWelcomeBanner from '../components/unishare/UnishareWelcomeBanner';
import UnshareSidebar from '../components/unishare/UnishareSidebar';
import UnishareCourseSection from '../components/unishare/UnishareCourseSection';
import { newCourses } from '../data/unishareData';

// Import components for the consolidated views
import UnishareCreateCourseForm from '../components/unishare/UnishareCreateCourseForm';
import UnishareMyGroups from '../components/unishare/UnishareMyGroups';
import UnishareMessages from '../components/unishare/UnishareMessages';

const UnisharePage = () => {
  const { section } = useParams(); // Get section from URL
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Update activeSection based on the URL parameter
    // or default to 'home' if section is undefined (e.g., /unishare path)
    setActiveSection(section || 'home');
  }, [section]); // Rerun effect when section param changes

  // Helper function to render the main content based on activeSection
  const renderMainContent = () => {
    switch (activeSection) {
      case 'create-course':
        return <UnishareCreateCourseForm />;
      case 'my-groups':
        return <UnishareMyGroups />;
      case 'messages':
        return <UnishareMessages />;
      case 'home':
      default:
        return (
          <>
            <UnishareWelcomeBanner />
            <UnishareCourseSection 
              title="Nhóm học tiêu biểu"
              courses={newCourses}
            />
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="unishare-page py-4" style={{ backgroundColor: '#e9f5ff', minHeight: 'calc(100vh - 120px)' }}>
        <Container>
          <Row>
            {/* Sidebar Component */}
            <Col md={3}>
              <UnshareSidebar 
                activeSection={activeSection} 
              />
            </Col>
            
            {/* Main Content: Rendered based on activeSection */}
            <Col md={9}>
              {renderMainContent()}
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default UnisharePage;
