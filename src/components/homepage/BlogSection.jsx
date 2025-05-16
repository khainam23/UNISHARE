import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import blogImage1 from '../../assets/blog-1.png';
import blogImage2 from '../../assets/blog-2.png';

const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      image: blogImage1,
      title: 'Cách học hiệu quả trong thời đại công nghệ',
      excerpt: 'Khám phá các phương pháp học tập hiệu quả với sự hỗ trợ của công nghệ hiện đại.',
      date: '15/06/2023'
    },
    {
      id: 2,
      image: blogImage2,
      title: 'Xu hướng học trực tuyến trong năm 2023',
      excerpt: 'Tìm hiểu về các xu hướng học trực tuyến mới nhất và cách áp dụng vào việc học tập của bạn.',
      date: '20/06/2023'
    },
    {
      id: 3,
      image: blogImage1,
      title: 'Làm thế nào để duy trì động lực học tập',
      excerpt: 'Những bí quyết giúp bạn duy trì động lực học tập và đạt được mục tiêu của mình.',
      date: '25/06/2023'
    },
    {
      id: 4,
      image: blogImage2,
      title: 'Kỹ năng cần thiết cho thế kỷ 21',
      excerpt: 'Khám phá những kỹ năng quan trọng mà mọi người cần phát triển trong thế kỷ 21.',
      date: '30/06/2023'
    }
  ];

  return (
    <section className="blog-section py-5">
      <Container>
        <h2 className="text-center mb-5">Tin tức Shop</h2>
        <Row>
          {blogs.map(blog => (
            <Col md={3} className="mb-4" key={blog.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img variant="top" src={blog.image} />
                <Card.Body>
                  <small className="text-muted">{blog.date}</small>
                  <Card.Title className="mt-2">{blog.title}</Card.Title>
                  <Card.Text>{blog.excerpt}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="outline-primary" className="rounded-pill">Xem tất cả bài viết</Button>
        </div>
      </Container>
    </section>
  );
};

export default BlogSection;
