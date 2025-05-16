import React from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import userAvatar from '../../assets/avatar-1.png';

const UnishareGroupCard = ({ group }) => {
  return (
    <Card className="mb-3 border-0 shadow-sm" style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e3f1fb' }}>
      <Row className="g-0">
        <Col xs={3} md={2} className="bg-primary d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(180deg, #1976d2 0%, #2196f3 100%)', minHeight: '100%' }}>
          <div className="text-center p-2">
            <img 
              src={group?.image || require('../../assets/course-react.png')}
              alt="Course Icon"
              style={{ width: '60px', height: '60px' }}
            />
          </div>
        </Col>
        <Col xs={9} md={7}>
          <Card.Body className="py-3 px-4">
            <div className="d-flex align-items-center mb-1">
              <h6 className="fw-bold text-primary mb-0">{group?.title || 'Học React JS cơ bản'}</h6>
              <span className="ms-2 badge bg-info" style={{ fontSize: '0.7rem', padding: '0.3em 0.6em' }}>
                {group?.level || 'cơ bản'}
              </span>
            </div>
            <p className="text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
              {group?.description || 'Khóa học giúp bạn xây dựng website chuyên nghiệp với ReactJS, làm việc với các thư viện UI và API...'}
            </p>
            <div className="d-flex align-items-center">
              <Image 
                src={group?.instructorAvatar || userAvatar} 
                roundedCircle 
                width={28} 
                height={28} 
                className="me-2" 
                style={{ border: '1.5px solid #b3d8f6' }}
              />
              <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                Giảng viên: <span className="fw-semibold">{group?.instructor || 'Thạc sĩ Phạm Hồng'}</span>
              </small>
            </div>
          </Card.Body>
        </Col>
        <Col xs={12} md={3} className="d-flex flex-column justify-content-center py-3 px-4" style={{ backgroundColor: '#f9fcff' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <small className="text-muted">Số lượng:</small>
            <small className="fw-bold text-dark">{group?.count || '124'} SV</small>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <small className="text-muted">Ngày học:</small>
            <small className="fw-bold text-dark">{group?.date || '12/05/2023'}</small>
          </div>
          <div className="d-flex justify-content-between">
            <Button 
              variant="primary" 
              size="sm" 
              className="w-100 me-2"
              style={{ 
                background: 'linear-gradient(90deg, #0370b7 60%, #4fc3f7 100%)',
                fontSize: '0.85rem',
                borderRadius: '0.5rem',
                border: 'none'
              }}
            >
              Xem thêm
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="w-100 ms-1"
              style={{ 
                fontSize: '0.85rem',
                borderRadius: '0.5rem',
                borderColor: '#dee2e6',
              }}
            >
              Thoát nhóm
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default UnishareGroupCard;
