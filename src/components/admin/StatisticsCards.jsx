import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { FaUsers, FaBook, FaFileAlt, FaShoppingCart } from 'react-icons/fa';
import adminService from '../../services/adminService';

const StatisticsCards = () => {
  const [stats, setStats] = useState([
    { title: 'Tổng người dùng', value: '0', icon: FaUsers, color: '#0370B7', bgColor: '#E6F3FB' },
    { title: 'Tài liệu đã duyệt', value: '0', icon: FaBook, color: '#28A745', bgColor: '#E8F9EF' },
    { title: 'Chờ duyệt', value: '0', icon: FaFileAlt, color: '#FFC107', bgColor: '#FFF8E6' },
    { title: 'Đơn hàng', value: '0', icon: FaShoppingCart, color: '#6F42C1', bgColor: '#F0E7FA' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        
        if (data) {
          const updatedStats = [
            { 
              title: 'Tổng người dùng', 
              value: data.users?.total.toLocaleString() || '0', 
              icon: FaUsers, 
              color: '#0370B7', 
              bgColor: '#E6F3FB' 
            },
            { 
              title: 'Tài liệu đã duyệt', 
              value: data.content?.documents?.approved.toLocaleString() || '0', 
              icon: FaBook, 
              color: '#28A745', 
              bgColor: '#E8F9EF' 
            },
            { 
              title: 'Chờ duyệt', 
              value: data.reports?.pending.toLocaleString() || '0', 
              icon: FaFileAlt, 
              color: '#FFC107', 
              bgColor: '#FFF8E6' 
            },
            { 
              title: 'Đơn hàng', 
              value: data.orders?.total.toLocaleString() || '0', 
              icon: FaShoppingCart, 
              color: '#6F42C1', 
              bgColor: '#F0E7FA' 
            }
          ];
          
          setStats(updatedStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} className="mb-3" key={index}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Spinner animation="border" size="sm" />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

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
