import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Nav, Spinner, Alert, Badge } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GroupHeader from '../components/groups/GroupHeader';
import GroupMembers from '../components/groups/GroupMembers';
import GroupPosts from '../components/groups/GroupPosts';
import { profileService, authService } from '../services';
import { BsArrowLeft, BsInfoCircle, BsPeopleFill, BsChatDots, BsCalendar3, BsChevronLeft, BsShare } from 'react-icons/bs';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get current user on component mount
  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  // Fetch group details whenever groupId or refreshKey changes
  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, refreshKey]);

  // Fetch group details from the API
  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await profileService.getGroupDetails(groupId);
      
      if (response.success) {
        setGroup(response.data);
        
        // Check membership status from response
        const memberStatus = 
          response.data.is_member === true || 
          (response.data.role && ['admin', 'moderator', 'member'].includes(response.data.role));
        
        setIsMember(memberStatus);
        
        // Check admin status from response
        const adminStatus = 
          response.data.is_admin === true || 
          (response.data.role && ['admin', 'moderator'].includes(response.data.role));
        
        setIsAdmin(adminStatus);
      } else {
        throw new Error(response.message || 'Failed to load group details');
      }
    } catch (err) {
      console.error('Error fetching group details:', err);
      setError('Could not load group details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle group join status changes
  const handleJoinGroup = async (joined, pendingApproval = false) => {
    if (joined) {
      setIsMember(true);
      refreshGroup();
    } else if (pendingApproval) {
      // Show some UI feedback for pending approval
      alert("Yêu cầu tham gia đã được gửi và đang chờ duyệt");
    }
  };

  // Refresh the group data
  const refreshGroup = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Loading state with modern UI
  if (loading) {
    return (
      <>
        <Header />
        <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
          <Container>
            <div className="text-center loading-animation">
              <div className="loading-pulse mb-4">
                <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <h4 className="text-primary mb-2 fw-bold">Đang tải thông tin nhóm</h4>
              <p className="text-muted">Vui lòng đợi trong giây lát...</p>
              <div className="progress mt-4" style={{ height: '6px' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style={{ width: '100%' }}></div>
              </div>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  // Error state with modern UI
  if (error) {
    return (
      <>
        <Header />
        <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
          <Container>
            <Card className="border-0 shadow-lg mx-auto error-card" style={{ maxWidth: '600px' }}>
              <Card.Body className="p-5 text-center">
                <div className="error-icon-container mb-4">
                  <div className="error-icon-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center">
                    <BsInfoCircle className="display-1 text-danger" />
                  </div>
                </div>
                <h2 className="mb-3 fw-bold">Đã xảy ra lỗi</h2>
                <p className="text-muted mb-4 fs-5">{error}</p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Button as={Link} to="/groups" variant="primary" size="lg" className="px-4 py-2 rounded-pill">
                    <BsChevronLeft className="me-2" /> Quay lại danh sách nhóm
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline-secondary" size="lg" className="px-4 py-2 rounded-pill">
                    Thử lại
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  // Group not found state with modern UI
  if (!group) {
    return (
      <>
        <Header />
        <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
          <Container>
            <Card className="border-0 shadow-lg mx-auto not-found-card" style={{ maxWidth: '600px' }}>
              <Card.Body className="p-5 text-center">
                <div className="not-found-icon-container mb-4">
                  <div className="not-found-icon-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center">
                    <BsInfoCircle className="display-1 text-warning" />
                  </div>
                </div>
                <h2 className="mb-3 fw-bold">Không tìm thấy nhóm</h2>
                <p className="text-muted mb-4 fs-5">Nhóm này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Button as={Link} to="/groups" variant="primary" size="lg" className="px-4 py-2 rounded-pill">
                    <BsChevronLeft className="me-2" /> Quay lại danh sách nhóm
                  </Button>
                  <Button as={Link} to="/groups/discover" variant="outline-primary" size="lg" className="px-4 py-2 rounded-pill">
                    Khám phá nhóm khác
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  // Main content with modern UI
  return (
    <>
      <Header />
      <div className="group-detail-page bg-light pb-5">
        {/* Back button with breadcrumb-like navigation */}
        <div className="bg-white border-bottom py-2">
          <Container>
            <div className="d-flex align-items-center">
              <Link to="/groups" className="text-decoration-none text-secondary d-flex align-items-center">
                <BsChevronLeft className="me-1" /> Nhóm
              </Link>
              <span className="mx-2 text-muted">/</span>
              <span className="text-truncate" style={{ maxWidth: '200px' }}>{group.name}</span>
              
              {/* Share button on the right */}
              <Button 
                variant="light" 
                size="sm" 
                className="ms-auto d-flex align-items-center"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: group.name,
                      text: group.description || 'Tham gia nhóm với tôi!',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Đã sao chép liên kết vào clipboard!');
                  }
                }}
              >
                <BsShare className="me-1" /> Chia sẻ
              </Button>
            </div>
          </Container>
        </div>
        
        {/* Group header section with improved styling */}
        <GroupHeader 
          group={group} 
          isMember={isMember} 
          isAdmin={isAdmin} 
          onJoinGroup={handleJoinGroup}
          onRefresh={refreshGroup}
        />
        
        <Container className="mt-n5">
          {/* Group quick stats */}
          <div className="group-stats-bar mb-4">
            <Row className="g-3">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 stat-card">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 stat-icon">
                      <BsPeopleFill className="text-primary fs-4" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Thành viên</h6>
                      <h4 className="mb-0 fw-bold">{group.member_count || 0}</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 stat-card">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3 stat-icon">
                      <BsChatDots className="text-success fs-4" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Loại nhóm</h6>
                      <h4 className="mb-0 fw-bold">
                        {group.type === 'course' ? 'Khóa học' : 
                         group.type === 'university' ? 'Trường đại học' : 'Sở thích'}
                      </h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 stat-card">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3 stat-icon">
                      <BsCalendar3 className="text-info fs-4" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Ngày tạo</h6>
                      <h4 className="mb-0 fw-bold">
                        {group.created_at ? new Date(group.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
          
          {/* Main content area with tabs */}
          <Card className="border-0 shadow content-card">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <Nav 
                variant="tabs" 
                activeKey={activeTab} 
                onSelect={handleTabChange}
                className="nav-tabs-modern"
              >
                <Nav.Item>
                  <Nav.Link 
                    eventKey="posts" 
                    className="px-4 py-3 rounded-top tab-link"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-2">Bài viết</span>
                      {group.post_count > 0 && (
                        <Badge pill bg="primary" className="pulse-badge">{group.post_count}</Badge>
                      )}
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="members" 
                    className="px-4 py-3 rounded-top tab-link"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-2">Thành viên</span>
                      <Badge pill bg="primary" className="pulse-badge">{group.member_count || 0}</Badge>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            
            <Card.Body className="p-4">
              {activeTab === 'posts' && (
                <GroupPosts 
                  groupId={group.id} 
                  isMember={isMember} 
                  onPostCreated={refreshGroup}
                />
              )}
              
              {activeTab === 'members' && (
                <GroupMembers 
                  groupId={group.id} 
                  isAdmin={isAdmin} 
                  currentUser={user}
                />
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
      
      {/* Add custom CSS for the page */}
      <style jsx="true">{`
        .group-detail-page {
          min-height: calc(100vh - 200px);
        }
        
        /* Modern tab styling */
        .nav-tabs-modern .nav-link {
          border: none;
          margin-right: 5px;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .nav-tabs-modern .nav-link:hover {
          color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.05);
        }
        
        .nav-tabs-modern .nav-link.active {
          color: #0d6efd;
          background-color: #fff;
          border-top: 3px solid #0d6efd;
          border-left: 1px solid #dee2e6;
          border-right: 1px solid #dee2e6;
          border-bottom: none;
        }
        
        .nav-tabs-modern .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #fff;
          z-index: 1;
        }
        
        /* Card animations */
        .stat-card {
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          overflow: hidden;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }
        
        .stat-icon {
          transition: transform 0.3s ease;
        }
        
        /* Badge animation */
        .pulse-badge {
          animation: pulse-animation 2s infinite;
        }
        
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
          }
          70% {
            box-shadow: 0 0 0 5px rgba(13, 110, 253, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
          }
        }
        
        /* Content card styling */
        .content-card {
          border-radius: 12px;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        
        .content-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
        }
        
        /* Loading animation */
        .loading-animation .loading-pulse {
          animation: scale-animation 1.5s infinite;
        }
        
        @keyframes scale-animation {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        /* Error and not found cards */
        .error-card, .not-found-card {
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .error-icon-circle, .not-found-icon-circle {
          width: 120px;
          height: 120px;
          border-radius: 60px;
          transition: all 0.3s ease;
        }
      `}</style>
      
      <Footer />
    </>
  );
};

export default GroupDetailPage;
