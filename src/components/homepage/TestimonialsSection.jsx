import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import avatar1 from '../../assets/avatar-1.png';
import avatar2 from '../../assets/avatar-2.png';
import avatar3 from '../../assets/avatar-3.png';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Sinh viên',
      avatar: avatar1,
      content: 'Tôi đã học được rất nhiều kiến thức bổ ích từ các khóa học trên Unishare. Giao diện dễ sử dụng và nội dung được trình bày rõ ràng.'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Nhân viên văn phòng',
      avatar: avatar2,
      content: 'Unishare là nền tảng tuyệt vời để học thêm kỹ năng mới. Tôi đã học được nhiều điều giúp ích cho công việc của mình.'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      role: 'Giáo viên',
      avatar: avatar3,
      content: 'Tôi rất ấn tượng với chất lượng các khóa học và tài liệu trên Unishare. Đây là một nền tảng đáng tin cậy cho việc học tập.'
    }
  ];

  return (
    <section className="testimonials-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Học viên nói gì về Unishare</h2>
        <Row>
          {testimonials.map(testimonial => (
            <Col md={4} className="mb-4" key={testimonial.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="rounded-circle me-3" 
                      width="60" 
                      height="60"
                    />
                    <div>
                      <h5 className="mb-0">{testimonial.name}</h5>
                      <p className="text-muted mb-0">{testimonial.role}</p>
                    </div>
                  </div>
                  <Card.Text>"{testimonial.content}"</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
