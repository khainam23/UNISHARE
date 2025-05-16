import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaUsers, FaBook, FaFileAlt, FaShoppingCart } from 'react-icons/fa';

const StatisticsCards = () => {
  const stats = [
    { title: 'Tổng người dùng', value: '1,856', icon: FaUsers, color: '#0370B7', bgColor: '#E6F3FB' },
    { title: 'Tài liệu đã duyệt', value: '245', icon: FaBook, color: '#28A745', bgColor: '#E8F9EF' },
    { title: 'Chờ duyệt', value: '35', icon: FaFileAlt, color: '#FFC107', bgColor: '#FFF8E6' },
    { title: 'Đơn hàng', value: '68', icon: FaShoppingCart, color: '#6F42C1', bgColor: '#F0E7FA' }
  ];

  return (
    <Row className="mb-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Col md={3} sm={6} className="mb-3" key={index}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div
                  style={{
                    backgroundColor: stat.bgColor,
                    color: stat.color,
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}
                >
                  <IconComponent size={24} />
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '14px' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '600' }}>
                    {stat.value}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default StatisticsCards;
