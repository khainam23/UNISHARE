import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import document1 from '../../assets/document-1.png';
import document2 from '../../assets/document-2.png';
import document3 from '../../assets/document-3.png';
import document4 from '../../assets/document-4.png';
import document5 from '../../assets/document-5.png';

const DocumentsSection = () => {
  const documents = [
    { id: 1, image: document1 },
    { id: 2, image: document2 },
    { id: 3, image: document3 },
    { id: 4, image: document4 },
    { id: 5, image: document5 }
  ];

  return (
    <section className="documents-section py-5">
      <Container>
        <h2 className="text-center mb-5">Tài liệu tham khảo miễn phí</h2>
        <Row>
          {documents.map(doc => (
            <Col md={2} sm={6} className="mb-4" key={doc.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img variant="top" src={doc.image} />
                <Card.Body className="text-center">
                  <Button variant="link" className="text-decoration-none">Tải xuống</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="outline-primary" className="rounded-pill">Xem tất cả tài liệu</Button>
        </div>
      </Container>
    </section>
  );
};

export default DocumentsSection;
