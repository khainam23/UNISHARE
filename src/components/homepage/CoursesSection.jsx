import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import courseImage1 from '../../assets/course-1.png';
import courseImage2 from '../../assets/course-2.png';
import courseImage3 from '../../assets/course-3.png';
import courseImage4 from '../../assets/course-4.png';

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      image: courseImage1,
      title: 'Khóa học cơ bản',
      description: 'Khóa học dành cho người mới bắt đầu với các kiến thức nền tảng.',
      price: '299.000đ'
    },
    {
      id: 2,
      image: courseImage2,
      title: 'Khóa học nâng cao',
      description: 'Khóa học chuyên sâu giúp nâng cao kỹ năng chuyên môn.',
      price: '499.000đ'
    },
    {
      id: 3,
      image: courseImage3,
      title: 'Khóa học chuyên đề',
      description: 'Khóa học tập trung vào các chủ đề cụ thể và chuyên sâu.',
      price: '399.000đ'
    },
    {
      id: 4,
      image: courseImage4,
      title: 'Khóa học đặc biệt',
      description: 'Khóa học đặc biệt với sự tham gia của các chuyên gia hàng đầu.',
      price: '599.000đ'
    }
  ];

  return (
    <section className="courses-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Khóa học phổ biến nhất</h2>
        <Row>
          {courses.map(course => (
            <Col md={3} sm={6} className="mb-4" key={course.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img variant="top" src={course.image} />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">{course.price}</span>
                    <Button variant="outline-primary" size="sm">Chi tiết</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="outline-primary" className="rounded-pill">Xem tất cả khóa học</Button>
        </div>
      </Container>
    </section>
  );
};

export default CoursesSection;
