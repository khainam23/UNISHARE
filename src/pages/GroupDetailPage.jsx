import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Nav, Spinner, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GroupHeader from '../components/groups/GroupHeader';
import GroupMembers from '../components/groups/GroupMembers';
import GroupDocuments from '../components/groups/GroupDocuments';
import GroupPosts from '../components/groups/GroupPosts';
import { profileService, chatService, authService } from '../services';
import { BsChatDots, BsArrowLeft } from 'react-icons/bs';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [groupChat, setGroupChat] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
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

  // Fetch group chat if user is a member
  useEffect(() => {
    if (groupId && isMember) {
      fetchGroupChat();
    }
  }, [groupId, isMember]);

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

  const fetchGroupChat = async () => {
    try {
      setChatLoading(true);
      const response = await chatService.getGroupChat(groupId);
      
      if (response.success) {
        setGroupChat(response.data);
      } else {
        console.error('Error fetching group chat:', response.error || response.message);
      }
    } catch (err) {
      console.error('Error fetching group chat:', err);
    } finally {
      setChatLoading(false);
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
    // Optionally update URL to reflect current tab
    // navigate(`/unishare/groups/${groupId}/${tab}`, { replace: true });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="py-5">
          <Container>
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Đang tải thông tin nhóm...</p>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="py-5">
          <Container>
            <Alert variant="danger">{error}</Alert>
            <div className="text-center mt-3">
              <Button as={Link} to="/groups" variant="primary">
                <BsArrowLeft className="me-2" /> Quay lại danh sách nhóm
              </Button>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Header />
        <div className="py-5">
          <Container>
            <Alert variant="warning">Không tìm thấy nhóm</Alert>
            <div className="text-center mt-3">
              <Button as={Link} to="/groups" variant="primary">
                <BsArrowLeft className="me-2" /> Quay lại danh sách nhóm
              </Button>
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
      <Container className="py-4">
        <GroupHeader 
          group={group} 
          isMember={isMember} 
          isAdmin={isAdmin} 
          onJoinGroup={handleJoinGroup}
          onRefresh={refreshGroup}
        />
        
        <Card className="mt-4 border-0 shadow-sm">
          <Card.Body>
            <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabChange}>
              <Nav.Item>
                <Nav.Link eventKey="posts">Bài viết</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="members">Thành viên</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="documents">Tài liệu</Nav.Link>
              </Nav.Item>
              {isMember && groupChat && (
                <Nav.Item>
                  <Nav.Link eventKey="chat">Trò chuyện</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            
            <div className="mt-4">
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
              
              {activeTab === 'documents' && (
                <GroupDocuments 
                  groupId={group.id} 
                  isMember={isMember}
                  userRole={group.role || (isAdmin ? 'admin' : 'member')}
                />
              )}
              
              {activeTab === 'chat' && isMember && groupChat && (
                <div className="mt-3">
                  <Button 
                    as={Link} 
                    to={`/unishare/groups/${group.id}/chat`}
                    variant="primary"
                    className="d-flex align-items-center"
                  >
                    <BsChatDots className="me-2" /> Mở trò chuyện nhóm
                  </Button>
                  <p className="text-muted mt-2">
                    Nhấn vào nút trên để mở giao diện trò chuyện nhóm đầy đủ.
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default GroupDetailPage;
