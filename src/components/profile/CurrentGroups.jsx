import React from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import { BsPeopleFill } from 'react-icons/bs';
// Placeholder for avatar - replace with actual image path or dynamic loading
import instructorAvatar from '../../assets/avatar-1.png'; // Assuming you have an avatar image

const CurrentGroups = () => {
  const groups = [
    {
      id: 1,
      name: 'Học React Native cơ bản',
      members: 54,
      instructor: 'Thạc sĩ Phan Long',
      instructorAvatar: instructorAvatar,
    },
    {
      id: 2,
      name: 'Học React Native cơ bản',
      members: 54,
      instructor: 'Thạc sĩ Phan Long',
      instructorAvatar: instructorAvatar,
    },
    {
      id: 3,
      name: 'Học React Native cơ bản',
      members: 54,
      instructor: 'Thạc sĩ Phan Long',
      instructorAvatar: instructorAvatar,
    },
    {
      id: 4,
      name: 'Học React Native cơ bản',
      members: 54,
      instructor: 'Thạc sĩ Phan Long',
      instructorAvatar: instructorAvatar,
    },
  ];

  return (
    <Row xs={1} md={1} className="g-4">
      {groups.map((group) => (
        <Col key={group.id}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col md={5} xs={12} className="mb-3 mb-md-0">
                  <Card.Title as="h6" className="mb-1" style={{color: '#0056b3', fontWeight: 'bold'}}>{group.name}</Card.Title>
                  <Card.Link href="#" className="small text-decoration-none">Xem thêm</Card.Link>
                  <div className="d-flex align-items-center text-muted mt-1">
                    <BsPeopleFill className="me-1" />
                    <small>{group.members}</small>
                  </div>
                </Col>
                <Col md={4} xs={12} className="d-flex align-items-center mb-3 mb-md-0">
                  <Image src={group.instructorAvatar} roundedCircle width={40} height={40} className="me-2" />
                  <div>
                    <small className="d-block text-muted" style={{fontSize: '0.8rem'}}>Giảng viên phụ trách nhóm:</small>
                    <small className="fw-bold d-block" style={{fontSize: '0.9rem'}}>{group.instructor}</small>
                    <Card.Link href="#" className="small text-decoration-none" style={{fontSize: '0.8rem'}}>Xem thêm</Card.Link>
                  </div>
                </Col>
                <Col md={3} xs={12} className="text-md-end">
                  <Button variant="primary" size="sm" className="me-2 mb-1 mb-md-0 d-block d-md-inline-block w-100 w-md-auto">Truy cập nhóm</Button>
                  <Button variant="outline-danger" size="sm" className="d-block d-md-inline-block w-100 w-md-auto">Rời nhóm</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CurrentGroups;
