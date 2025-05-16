import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { BsPeopleFill, BsClockHistory } from 'react-icons/bs';
import userAvatar from '../../assets/avatar-1.png';

const UnishareCourseCard = ({ course }) => {
  return (
    <Card
      className="h-100 border-0"
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 24px 0 rgba(3,112,183,0.10)',
        background: 'transparent',
      }}
    >
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(180deg, #1976d2 0%, #2196f3 100%)',
          minHeight: 110,
          padding: '1.25rem 1rem 0.5rem 1rem',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <img 
            src={require('../../assets/course-react.png')} 
            alt="react" 
            style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 12 }} 
          />
        </div>
        <h6
          className="mb-0 fw-bold text-center"
          style={{ fontSize: '1.1rem', color: '#fff', letterSpacing: 0.2 }}
        >
          {course?.title || 'Xây dựng Website bằng React - JS'}
        </h6>
      </div>
      <Card.Body
        className="p-0"
        style={{
          background: '#f6f6f6',
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
          padding: 0,
        }}
      >
        <div className="px-3 pt-3 pb-2">
          <p
            className="mb-2 text-primary fw-semibold"
            style={{ fontSize: '0.95rem', color: '#1976d2' }}
          >
            {course?.description || course?.title || 'Xây dựng Website bằng React - JS'}
          </p>
          <div className="d-flex align-items-center mb-2">
            <Image
              src={course?.instructorAvatar || userAvatar}
              roundedCircle
              width={24}
              height={24}
              className="me-2"
            />
            <small className="text-muted" style={{ fontSize: '0.92rem' }}>
              Giảng viên: <span className="fw-semibold" style={{ color: '#222' }}>{course?.instructor || 'Nguyễn Đức Mẫn'}</span>
            </small>
          </div>
        </div>
        <div
          className="d-flex justify-content-between align-items-center px-3 pb-3"
          style={{ fontSize: '0.98rem' }}
        >
          <span className="text-muted d-flex align-items-center">
            <BsPeopleFill className="me-1" />
            <span style={{ fontWeight: 500 }}>{course?.students || course?.members || 0}</span>
          </span>
          <span className="text-muted d-flex align-items-center">
            <BsClockHistory className="me-1" />
            <span style={{ fontWeight: 500 }}>{course?.date || '100 giờ'}</span>
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UnishareCourseCard;
