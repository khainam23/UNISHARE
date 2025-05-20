import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import homeService from '../../services/homeService';
import defaultBlogImage from '../../assets/blog-placeholder.png';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await homeService.getRecentBlogPosts();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <section className="blog-section py-5">
      <Container>
        <h2 className="text-center mb-5">Tin tức & Blog</h2>
        
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
              {blogs.length > 0 ? (
                blogs.map(blog => (
                  <Col md={3} className="mb-4" key={blog.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Img 
                        variant="top" 
                        src={blog.thumbnail || defaultBlogImage} 
                        alt={blog.title}
                      />
                      <Card.Body>
                        <small className="text-muted">{formatDate(blog.created_at)}</small>
                        <Card.Title className="mt-2">{blog.title}</Card.Title>
                        <Card.Text>{blog.excerpt || blog.content.substring(0, 100)}...</Card.Text>
                        <Link to={`/blog/${blog.id}`} className="stretched-link"></Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center py-4">
                  <p>Không có bài viết nào hiện tại.</p>
                </Col>
              )}
            </Row>
            <div className="text-center mt-4">
              <Link to="/blog">
                <Button variant="outline-primary" className="rounded-pill">Xem tất cả bài viết</Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default BlogSection;
