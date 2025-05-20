import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import homeService from '../../services/homeService';
import avatar1 from '../../assets/avatar-1.png';
import avatar2 from '../../assets/avatar-2.png';
import avatar3 from '../../assets/avatar-3.png';

// Default avatar images mapping
const defaultAvatars = [avatar1, avatar2, avatar3];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await homeService.getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="testimonials-section py-5 bg-light">
        <Container className="text-center">
          <h2 className="mb-5">Học viên nói gì về Unishare</h2>
          <Spinner animation="border" variant="primary" />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonials-section py-5 bg-light">
        <Container className="text-center">
          <h2 className="mb-5">Học viên nói gì về Unishare</h2>
          <p className="text-danger">{error}</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="testimonials-section py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Học viên nói gì về Unishare</h2>
        <Row>
          {testimonials.map((testimonial, index) => (
            <Col md={4} className="mb-4" key={testimonial.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={testimonial.avatar || defaultAvatars[index % defaultAvatars.length]} 
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
