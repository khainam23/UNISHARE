import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsPeopleFill, BsChatDots, BsCalendar3, BsBook, BsDoorOpen } from 'react-icons/bs';
import defaultAvatar from '../../assets/avatar-1.png';
import { profileService } from '../../services';
import LeaveGroupModal from './LeaveGroupModal';

const GroupHeader = ({ group, isMember, isAdmin, onJoinGroup, onRefresh }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  const [joinError, setJoinError] = useState('');
  // Use a fallback cover style instead of requiring an image file
  const defaultCoverStyle = {
    backgroundColor: '#6c757d',
    backgroundImage: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)'
  };

  // Double-check membership status from the API
  const [membershipStatus, setMembershipStatus] = useState({
    checked: false,
    isMember: isMember
  });

  useEffect(() => {
    // Set the initial member state from props
    setMembershipStatus(prev => ({...prev, isMember}));
    
    // If the group data is available, verify membership status from the API
    if (group && group.id) {
      checkMembershipStatus();
    }
  }, [group, isMember]);

  const checkMembershipStatus = async () => {
    try {
      // Get group details including membership info
      const response = await profileService.getGroupDetails(group.id);
      
      if (response.success && response.data) {
        // Check if the response data contains role information
        const isMemberFromAPI = response.data.role !== undefined;
        
        // Update the membership status based on the API response
        setMembershipStatus({
          checked: true,
          isMember: isMemberFromAPI
        });
        
        console.log('Membership status from API:', isMemberFromAPI, 'Role:', response.data.role);
      }
    } catch (err) {
      console.error("Error checking membership status:", err);
    }
  };

  const handleJoinGroup = async () => {
    if (!group) return;
    
    try {
      setJoinError('');
      setJoiningGroup(true);
      
      const response = await profileService.joinGroup(group.id);
      
      if (response.success) {
        setShowJoinModal(false);
        
        // If the join was successful without a pending request
        if (response.message && response.message.includes('successfully')) {
          if (onJoinGroup) onJoinGroup(true);
          if (onRefresh) onRefresh();
        } else {
          // A join request was sent (for private groups)
          if (onJoinGroup) onJoinGroup(false, true);
        }
      } else {
        throw new Error(response.message || 'Không thể tham gia nhóm');
      }
    } catch (err) {
      console.error("Error joining group:", err);
      setJoinError('Không thể tham gia nhóm. Vui lòng thử lại sau.');
    } finally {
      setJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeavingGroup(true);
      
      // Check if user is authenticated before proceeding
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authenticated');
        setShowLeaveModal(false);
        
        // Redirect to login page if not authenticated
        window.location.href = '/login';
        return;
      }
      
      console.log(`Attempting to leave group ${group.id}`);
      const response = await profileService.leaveGroup(group.id);
      
      if (response.success) {
        setShowLeaveModal(false);
        if (onRefresh) onRefresh();
      } else {
        // Handle specific error cases
        if (response.message?.includes('Unauthenticated')) {
          console.error('Authentication token expired');
          // Refresh token or redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?expired=true';
          return;
        }
        
        throw new Error(response.message || 'Không thể rời nhóm');
      }
    } catch (err) {
      console.error("Error leaving group:", err);
      // We could show an error message here if needed
      alert(`Lỗi: ${err.message || 'Không thể rời nhóm'}`);
    } finally {
      setLeavingGroup(false);
    }
  };

  if (!group) {
    return null;
  }

  return (
    <>
      <Card className="mb-4 group-header">
        <div 
          className="group-cover position-relative"
          style={{
            height: '200px',
            ...(group.cover_image ? 
              { backgroundImage: `url(${group.cover_image})` } : 
              defaultCoverStyle),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: 'calc(0.375rem - 1px)',
            borderTopRightRadius: 'calc(0.375rem - 1px)'
          }}
        >
          {isAdmin && (
            <Button
              variant="light"
              size="sm"
              className="position-absolute top-0 end-0 m-2"
              as={Link}
              to={`/unishare/groups/${group.id}/edit`}
            >
              Chỉnh sửa nhóm
            </Button>
          )}
        </div>
        
        <Card.Body>
          <Row>
            <Col md={8} className="d-flex flex-column mb-3">
              <div className="d-flex align-items-center mb-2">
                <h3 className="mb-0 me-2">{group.name}</h3>
                <Badge 
                  bg={group.is_private ? 'secondary' : 'success'}
                  className="d-inline-block ms-2"
                >
                  {group.is_private ? 'Nhóm kín' : 'Nhóm công khai'}
                </Badge>
              </div>
              
              <div className="d-flex align-items-center mb-2 text-muted">
                <BsPeopleFill className="me-2" />
                <span className="me-3">{group.member_count || 0} thành viên</span>
                
                {group.type === 'course' && (
                  <>
                    <BsBook className="me-2 ms-3" />
                    <span>{group.course_code || 'Không có mã môn học'}</span>
                  </>
                )}
              </div>
              
              <div className="group-description my-2">
                {group.description || 'Không có mô tả'}
              </div>
              
              {group.created_at && (
                <div className="text-muted mt-auto">
                  <small>
                    <BsCalendar3 className="me-1" /> 
                    Tạo: {new Date(group.created_at).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              )}
            </Col>
            
            <Col md={4} className="d-flex flex-column align-items-end justify-content-between">
              <div className="mb-3 text-md-end">
                {group.type === 'course' ? (
                  <Badge bg="primary" className="me-1">Khóa học</Badge>
                ) : group.type === 'university' ? (
                  <Badge bg="info" className="me-1">Trường đại học</Badge>
                ) : (
                  <Badge bg="secondary" className="me-1">Sở thích</Badge>
                )}
              </div>
              
              <div className="d-flex gap-2">
                {!membershipStatus.isMember ? (
                  <Button 
                    variant="primary"
                    onClick={() => setShowJoinModal(true)}
                    className="d-inline-flex align-items-center"
                  >
                    <BsPeopleFill className="me-1" />
                    Tham gia nhóm
                  </Button>
                ) : (
                  <>
                    <Button 
                      as={Link}
                      to={`/unishare/groups/${group.id}/chat`}
                      variant="outline-primary"
                      className="d-inline-flex align-items-center"
                    >
                      <BsChatDots className="me-1" />
                      Trò chuyện
                    </Button>
                    
                    {isAdmin ? (
                      <Button 
                        as={Link}
                        to={`/unishare/groups/${group.id}/members/manage`}
                        variant="outline-secondary"
                      >
                        Quản lý thành viên
                      </Button>
                    ) : (
                      <Button 
                        variant="outline-danger"
                        onClick={() => setShowLeaveModal(true)}
                        className="d-inline-flex align-items-center"
                      >
                        <BsDoorOpen className="me-1" />
                        Rời nhóm
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Join Group Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tham gia nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn muốn tham gia nhóm <strong>{group.name}</strong>?</p>
          
          {group.is_private && (
            <div className="alert alert-info">
              <strong>Lưu ý:</strong> Đây là nhóm kín. Yêu cầu tham gia của bạn sẽ được gửi đến quản trị viên nhóm để duyệt.
            </div>
          )}
          
          {joinError && (
            <div className="alert alert-danger">
              {joinError}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJoinModal(false)} disabled={joiningGroup}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleJoinGroup} disabled={joiningGroup}>
            {joiningGroup ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang xử lý...
              </>
            ) : group.is_private ? 'Gửi yêu cầu tham gia' : 'Tham gia'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Leave Group Modal */}
      <LeaveGroupModal 
        show={showLeaveModal} 
        onHide={() => setShowLeaveModal(false)} 
        onConfirm={handleLeaveGroup} 
        groupName={group.name}
        isLoading={leavingGroup}
      />
    </>
  );
};

export default GroupHeader;
