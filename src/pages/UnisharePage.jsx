import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnishareWelcomeBanner from '../components/unishare/UnishareWelcomeBanner';
import UnshareSidebar from '../components/unishare/UnishareSidebar';
import UnishareCourseSection from '../components/unishare/UnishareCourseSection';
import UnishareCreateCourseForm from '../components/unishare/UnishareCreateCourseForm';
import UnishareMyGroups from '../components/unishare/UnishareMyGroups';
import UnishareMessages from '../components/unishare/UnishareMessages';
import UnishareRoleDebugger from '../components/unishare/UnishareRoleDebugger';
import { groupService, chatService } from '../services';

// Thời gian cache (10 phút)
const CACHE_DURATION = 10 * 60 * 1000;

const UnisharePage = () => {
  const { section } = useParams();
  const [activeSection, setActiveSection] = useState('home');
  const [appData, setAppData] = useState({
    featuredGroups: [],
    myGroups: [],
    chats: []
  });
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  
  // Theo dõi thời điểm cuối cùng dữ liệu được tải
  const [lastDataFetch, setLastDataFetch] = useState(null);
  
  // Cập nhật activeSection dựa trên URL parameter
  useEffect(() => {
    setActiveSection(section || 'home');
  }, [section]);

  // Hàm tải dữ liệu tập trung - tải tất cả dữ liệu cần thiết trong một lần
  const fetchAllData = useCallback(async (force = false) => {
    // Kiểm tra xem có cần tải lại dữ liệu không
    const now = Date.now();
    if (!force && lastDataFetch && now - lastDataFetch < CACHE_DURATION) {
      console.log('Using cached data, last fetch:', new Date(lastDataFetch).toLocaleTimeString());
      setLoading(false);
      return;
    }
    
    console.log('Fetching all app data at:', new Date().toLocaleTimeString());
    setLoading(true);
    setError(null);
    
    try {
      // Tạo tất cả các promise trước khi chờ kết quả
      const featuredGroupsPromise = groupService.getAllGroups({
        per_page: 6,
        sort_by: 'member_count',
        sort_direction: 'desc'
      }, true);
      
      const myGroupsPromise = groupService.getUserGroups({}, true);
      
      const chatsPromise = chatService.getUserChats({}, true);
      
      // Sử dụng Promise.allSettled để đảm bảo tất cả request hoàn thành
      // Ngay cả khi một số request thất bại
      const [featuredGroupsResult, myGroupsResult, chatsResult] = await Promise.allSettled([
        featuredGroupsPromise,
        myGroupsPromise,
        chatsPromise
      ]);
      
      // Xử lý kết quả featuredGroups
      let featuredGroups = [];
      if (featuredGroupsResult.status === 'fulfilled' && featuredGroupsResult.value.success) {
        featuredGroups = featuredGroupsResult.value.data || [];
      } else if (featuredGroupsResult.status === 'rejected') {
        console.error('Error fetching featured groups:', featuredGroupsResult.reason);
      }
      
      // Xử lý kết quả myGroups
      let myGroups = [];
      if (myGroupsResult.status === 'fulfilled' && myGroupsResult.value.success) {
        myGroups = myGroupsResult.value.data || [];
      } else if (myGroupsResult.status === 'rejected') {
        console.error('Error fetching my groups:', myGroupsResult.reason);
      }
      
      // Xử lý kết quả chats
      let chats = [];
      if (chatsResult.status === 'fulfilled' && chatsResult.value.success) {
        chats = chatsResult.value.data || [];
      } else if (chatsResult.status === 'rejected') {
        console.error('Error fetching chats:', chatsResult.reason);
      }
      
      // Cập nhật trạng thái với tất cả dữ liệu
      setAppData({
        featuredGroups,
        myGroups,
        chats
      });
      
      // Cập nhật thời gian tải dữ liệu
      setLastDataFetch(now);
      
      // Kiểm tra tất cả các request có thành công không để hiển thị lỗi nếu cần
      const allSuccessful = 
        featuredGroupsResult.status === 'fulfilled' && 
        myGroupsResult.status === 'fulfilled' && 
        chatsResult.status === 'fulfilled';
        
      if (!allSuccessful) {
        setError('Một số dữ liệu có thể không được tải đầy đủ. Vui lòng làm mới trang.');
      }
    } catch (err) {
      console.error('Error fetching app data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [lastDataFetch]);

  // Tải dữ liệu khi component được mount hoặc khi yêu cầu làm mới
  useEffect(() => {
    fetchAllData();
    
    // Thêm event listener để tải lại dữ liệu khi cần
    const handleDataRefresh = () => {
      fetchAllData(true);
    };
    
    window.addEventListener('refresh-app-data', handleDataRefresh);
    
    return () => {
      window.removeEventListener('refresh-app-data', handleDataRefresh);
    };
  }, [fetchAllData]);

  // Handler khi nhóm được tạo, rời hoặc chat mới được tạo
  const handleDataUpdated = useCallback(() => {
    // Dispatch custom event để reload dữ liệu
    window.dispatchEvent(new Event('refresh-app-data'));
  }, []);

  // Tối ưu hóa renderMainContent với useMemo
  const renderMainContent = useMemo(() => {
    if (loading && !lastDataFetch) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="my-3">
          {error}
          <div className="mt-2">
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => fetchAllData(true)}
            >
              Thử lại
            </button>
          </div>
        </Alert>
      );
    }

    const { featuredGroups, myGroups, chats } = appData;

    switch (activeSection) {
      case 'create-course':
        return (
          <>
            <UnishareRoleDebugger />
            <UnishareCreateCourseForm onGroupCreated={handleDataUpdated} />
          </>
        );
      
      case 'my-groups':
        return (
          <UnishareMyGroups 
            groups={myGroups} 
            onGroupLeft={handleDataUpdated} 
          />
        );
      
      case 'messages':
        return (
          <UnishareMessages 
            chats={chats} 
            loading={loading && chats.length === 0}
            onChatCreated={handleDataUpdated}
          />
        );
      
      case 'home':
      default:
        return (
          <>
            <UnishareWelcomeBanner />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: '#0370b7' }}>Nhóm học tiêu biểu</h5>
              <Button
                as={Link}
                to="/unishare/create-course"
                className="d-flex align-items-center fw-bold"
                style={{
                  background: 'linear-gradient(90deg, #0370b7 60%, #4fc3f7 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.2rem',
                  boxShadow: '0 2px 8px rgba(3,112,183,0.15)'
                }}
              >
                <i className="fas fa-plus me-2"></i> Tạo nhóm học
              </Button>
            </div>
            <UnishareCourseSection 
              title=""
              courses={featuredGroups}
            />
          </>
        );
    }
  }, [activeSection, loading, error, appData, lastDataFetch, fetchAllData, handleDataUpdated]);

  // Tối ưu hóa sidebar props
  const sidebarProps = useMemo(() => ({
    activeSection,
    hasNewMessages: appData.chats.some(chat => chat.unread_count > 0)
  }), [activeSection, appData.chats]);

  return (
    <>
      <Header />
      <div className="unishare-page py-4" style={{ backgroundColor: '#e9f5ff', minHeight: 'calc(100vh - 120px)' }}>
        <Container>
          <Row>
            {/* Sidebar Component */}
            <Col md={3}>
              <UnshareSidebar {...sidebarProps} />
            </Col>
            
            {/* Main Content: Rendered based on activeSection */}
            <Col md={9}>
              {renderMainContent}
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default UnisharePage;
