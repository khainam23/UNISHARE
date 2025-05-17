import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Image, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsPeopleFill, BsInfoCircle } from 'react-icons/bs';
import { profileService } from '../../services';
import defaultAvatar from '../../assets/avatar-1.png';

const CurrentGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [groupToLeave, setGroupToLeave] = useState(null);
  const [leaveLoading, setLeaveLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await profileService.getUserGroups({ status: 'active' });
      
      if (response.success) {
        setGroups(response.data || []);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách nhóm');
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError('Không thể tải danh sách nhóm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setGroupToLeave(group);
      setShowLeaveModal(true);
    }
  };

  const confirmLeaveGroup = async () => {
    if (!groupToLeave) return;
    
    try {
      setLeaveLoading(true);
      
      const response = await profileService.leaveGroup(groupToLeave.id);
      
      if (response.success) {
        // Remove the group from the list
        setGroups(prevGroups => prevGroups.filter(group => group.id !== groupToLeave.id));
        setShowLeaveModal(false);
        setGroupToLeave(null);
      } else {
        throw new Error(response.message || 'Không thể rời nhóm');
      }
    } catch (err) {
      console.error("Error leaving group:", err);
      setError('Không thể rời nhóm. Vui lòng thử lại sau.');
    } finally {
      setLeaveLoading(false);
    }
  };

  if (loading && groups.length === 0) {
    return <div className="text-center py-4"><Spinner animation="border" /></div>;
  }

  if (error && groups.length === 0) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (groups.length === 0 && !loading) {
    return (
      <Card className="text-center p-4">
        <Card.Body>
          <BsInfoCircle className="text-muted mb-3" size={30} />
          <h5>Bạn chưa tham gia nhóm nào</h5>
          <p className="text-muted">Tham gia các nhóm để chia sẻ và trao đổi tài liệu với những người khác.</p>
          <Button as={Link} to="/unishare/groups" variant="primary">
            Khám phá nhóm
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="current-groups-container">
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <Row xs={1} md={1} className="g-4">
        {groups.map((group) => (
          <Col key={group.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col md={5} xs={12} className="mb-3 mb-md-0">
                    <Card.Title as="h6" className="mb-1" style={{color: '#0056b3', fontWeight: 'bold'}}>
                      {group.name}
                    </Card.Title>
                    <Link to={`/unishare/groups/${group.id}`} className="small text-decoration-none">
                      Xem thêm
                    </Link>
                    <div className="d-flex align-items-center text-muted mt-1">
                      <BsPeopleFill className="me-1" />
                      <small>{group.member_count || 0}</small>
                    </div>
                  </Col>
                  <Col md={4} xs={12} className="d-flex align-items-center mb-3 mb-md-0">
                    {group.creator && (
                      <>
                        <Image 
                          src={group.creator.avatar || defaultAvatar} 
                          roundedCircle 
                          width={40} 
                          height={40} 
                          className="me-2" 
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <small className="d-block text-muted" style={{fontSize: '0.8rem'}}>
                            {group.type === 'course' ? 'Giảng viên phụ trách:' : 'Người tạo nhóm:'}
                          </small>
                          <small className="fw-bold d-block" style={{fontSize: '0.9rem'}}>
                            {group.creator.name}
                          </small>
                          <Link to={`/profile/${group.creator.id}`} className="small text-decoration-none" style={{fontSize: '0.8rem'}}>
                            Xem thêm
                          </Link>
                        </div>
                      </>
                    )}
                  </Col>
                  <Col md={3} xs={12} className="text-md-end">
                    <Button 
                      as={Link}
                      to={`/unishare/groups/${group.id}`} 
                      variant="primary" 
                      size="sm" 
                      className="me-2 mb-1 mb-md-0 d-block d-md-inline-block w-100 w-md-auto"
                    >
                      Truy cập nhóm
                    </Button>
                    {group.role !== 'admin' && (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="d-block d-md-inline-block w-100 w-md-auto"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Rời nhóm
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận rời nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn rời khỏi nhóm "{groupToLeave?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeaveModal(false)} disabled={leaveLoading}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmLeaveGroup} disabled={leaveLoading}>
            {leaveLoading ? <><Spinner as="span" animation="border" size="sm" /> Đang xử lý...</> : 'Rời nhóm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CurrentGroups;
