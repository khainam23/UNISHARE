import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsPeopleFill, BsChatDots, BsCalendar3, BsBook, BsDoorOpen, BsExclamationTriangle } from 'react-icons/bs';
import defaultAvatar from '../../assets/avatar-1.png';
import { profileService, groupService } from '../../services';
import LeaveGroupModal from './LeaveGroupModal';

const GroupHeader = ({ group, isMember, isAdmin, onJoinGroup, onRefresh }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinRequestPending, setJoinRequestPending] = useState(false);
  
  // Use a fallback cover style instead of requiring an image file
  const defaultCoverStyle = {
    backgroundColor: '#6c757d',
    backgroundImage: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)'
  };

  // Check for pending join requests when component mounts
  useEffect(() => {
    if (group && group.id && !isMember) {
      checkJoinRequestStatus();
    }
  }, [group, isMember]);

  // Check if the user has a pending join request
  const checkJoinRequestStatus = async () => {
    try {
      const response = await groupService.checkJoinRequestStatus(group.id);
      if (response.success && response.data.status === 'pending') {
        setJoinRequestPending(true);
      }
    } catch (error) {
      console.error("Error checking join request status:", error);
    }
  };

  const handleJoinGroup = async () => {
    if (!group) return;
    
    try {
      setJoinError('');
      setJoiningGroup(true);
      
      const response = await groupService.joinGroup(group.id);
      
      if (response.success) {
        setShowJoinModal(false);
        
        // If the join was successful without pending
        if (response.data?.status === 'approved' || (response.message && response.message.includes('successfully'))) {
          if (onJoinGroup) onJoinGroup(true);
        } else {
          // A join request was sent (for private groups)
          setJoinRequestPending(true);
          if (onJoinGroup) onJoinGroup(false, true);
        }
      } else {
        // Handle error response without throwing
        console.error("Error joining group:", response.message);
        setJoinError(response.message || 'Không thể tham gia nhóm. Vui lòng thử lại sau.');
      }
    } catch (err) {
      // This will only catch unexpected errors that weren't handled by the service
      console.error("Unexpected error joining group:", err);
      setJoinError('Không thể tham gia nhóm. Vui lòng thử lại sau.');
    } finally {
      setJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeavingGroup(true);
      
      const response = await groupService.leaveGroup(group.id);
      
      if (response.success) {
        setShowLeaveModal(false);
        
        // Notify parent component to refresh
        if (onRefresh) onRefresh();
      } else {
        throw new Error(response.message || 'Không thể rời nhóm');
      }
    } catch (err) {
      console.error("Error leaving group:", err);
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
      <Card className="mb-4 group-header shadow-sm">
        <div 
          className="group-cover position-relative"
          style={{
            height: '200px',
            ...(group.cover_image ? 
              { backgroundImage: `url(${group.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : 
              defaultCoverStyle),
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
                {!isMember ? (
                  joinRequestPending ? (
                    <Alert variant="info" className="p-2 mb-0 d-flex align-items-center">
                      <BsExclamationTriangle className="me-2" />
                      Yêu cầu tham gia đang chờ duyệt
                    </Alert>
                  ) : (
                    <Button 
                      variant="primary"
                      onClick={() => setShowJoinModal(true)}
                      className="d-inline-flex align-items-center"
                    >
                      <BsPeopleFill className="me-1" />
                      Tham gia nhóm
                    </Button>
                  )
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
      <LeaveGroupModal 
        show={showLeaveModal} 
        onHide={() => setShowLeaveModal(false)} 
        onConfirm={handleLeaveGroup} 
        groupName={group.name}
        isLoading={leavingGroup}
      />
      
      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tham gia nhóm</h5>
                <button type="button" className="btn-close" onClick={() => setShowJoinModal(false)} disabled={joiningGroup}></button>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowJoinModal(false)} 
                  disabled={joiningGroup}
                >
                  Hủy
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleJoinGroup} 
                  disabled={joiningGroup}
                >
                  {joiningGroup ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : group.is_private ? 'Gửi yêu cầu tham gia' : 'Tham gia'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupHeader;
