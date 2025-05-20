import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import homeService from '../../services/homeService';
import defaultDocumentImage from '../../assets/document-placeholder.png';

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await homeService.getFreeDocuments();
        setDocuments(data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <section className="documents-section py-5">
      <Container>
        <h2 className="text-center mb-5">Tài liệu tham khảo miễn phí</h2>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <>
            <Row>
              {documents.length > 0 ? (
                documents.map(doc => (
                  <Col md={2} sm={6} className="mb-4" key={doc.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Img 
                        variant="top" 
                        src={doc.thumbnail || defaultDocumentImage} 
                        alt={doc.title}
                        className="document-thumbnail"
                      />
                      <Card.Body className="text-center">
                        <Card.Title className="small text-truncate">{doc.title}</Card.Title>
                        <Link to={`/documents/${doc.id}`}>
                          <Button variant="link" className="text-decoration-none">Tải xuống</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center py-4">
                  <p>Không có tài liệu nào hiện tại.</p>
                </Col>
              )}
            </Row>
            <div className="text-center mt-4">
              <Link to="/documents">
                <Button variant="outline-primary" className="rounded-pill">Xem tất cả tài liệu</Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default DocumentsSection;
