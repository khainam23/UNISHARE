import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Nav, Spinner, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GroupHeader from '../components/groups/GroupHeader';
import GroupMembers from '../components/groups/GroupMembers';
import GroupDocuments from '../components/groups/GroupDocuments';
import GroupPosts from '../components/groups/GroupPosts';
import { profileService, chatService } from '../services';
import { BsChatDots } from 'react-icons/bs';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [groupChat, setGroupChat] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId && isMember) {
      fetchGroupChat();
    }
  }, [groupId, isMember]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await profileService.getGroupDetails(groupId);
      
      console.log("Group details response:", response);
      
      if (response.success) {
        setGroup(response.data);
        setIsMember(response.data.is_member === true);
        setIsAdmin(
          response.data.is_admin === true || 
          (response.data.role && ['admin', 'moderator'].includes(response.data.role))
        );
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

  const handleJoinGroup = async (joined, pendingApproval = false) => {
    if (joined) {
      setIsMember(true);
      fetchGroupDetails();
    } else if (pendingApproval) {
      // Handle pending approval
    }
  };

  const handleRefresh = () => {
    fetchGroupDetails();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="py-5">
          <Container>
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading group details...</p>
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
                Back to Groups
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
            <Alert variant="warning">Group not found</Alert>
            <div className="text-center mt-3">
              <Button as={Link} to="/groups" variant="primary">
                Back to Groups
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
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading group details...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <GroupHeader 
              group={group} 
              isMember={isMember} 
              isAdmin={isAdmin} 
              onJoinGroup={handleJoinGroup}
              onRefresh={handleRefresh}
            />
            <Card className="mt-4 border-0 shadow-sm">
              <Card.Body>
                <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                  <Nav.Item>
                    <Nav.Link eventKey="posts">Posts</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="members">Members</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="documents">Documents</Nav.Link>
                  </Nav.Item>
                </Nav>
                <div className="mt-4">
                  {activeTab === 'posts' && <GroupPosts groupId={group.id} />}
                  {activeTab === 'members' && <GroupMembers groupId={group.id} />}
                  {activeTab === 'documents' && <GroupDocuments groupId={group.id} />}
                </div>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default GroupDetailPage;
