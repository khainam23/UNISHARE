import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import adminService from '../../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Light blue gradient background
  const backgroundStyle = {
    background: 'linear-gradient(to bottom right, #d4eafb, #e6f4fd)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    height: '220px'
  };

  // Central large circle with welcome text
  const mainCircleStyle = {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: '#ffffff',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 4
  };

  // Design elements - circles of varying sizes
  const designElements = [
    // Medium circle top right
    {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#ffffff',
      position: 'absolute',
      top: '16%',
      right: '30%',
      opacity: 0.7,
      zIndex: 2
    },
    // Large light circle top left
    {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: '#ffffff',
      position: 'absolute',
      top: '20%',
      left: '15%',
      opacity: 0.5,
      zIndex: 1
    },
    // Small circle bottom right
    {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      background: '#ffffff',
      position: 'absolute',
      bottom: '20%',
      right: '20%',
      opacity: 0.8,
      zIndex: 2
    },
    // Small circle bottom center
    {
      width: '25px',
      height: '25px',
      borderRadius: '50%',
      background: '#ffffff',
      position: 'absolute',
      bottom: '30%',
      left: '40%',
      opacity: 0.6,
      zIndex: 1
    }
  ];

  // Circular outline elements
  const outlineElements = [
    {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      position: 'absolute',
      top: '60%',
      left: '10%',
      zIndex: 1
    },
    {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      position: 'absolute',
      top: '20%',
      right: '10%',
      zIndex: 1
    }
  ];

  // Wave-like pattern elements
  const wavePatterns = [
    {
      position: 'absolute',
      bottom: '20%',
      right: '5%',
      width: '100px',
      height: '50px',
      zIndex: 1,
      opacity: 0.4
    },
    {
      position: 'absolute',
      top: '15%',
      left: '30%',
      width: '80px',
      height: '40px',
      zIndex: 1,
      opacity: 0.3
    }
  ];

  // Linear elements
  const linearElements = [
    {
      position: 'absolute',
      top: '40%',
      right: '5%',
      width: '30px',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.6)',
      zIndex: 1
    },
    {
      position: 'absolute',
      bottom: '30%',
      left: '15%',
      width: '20px',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.6)',
      zIndex: 1
    }
  ];

  if (loading) {
    return (
      <div className="welcome-section mb-4 d-flex justify-content-center align-items-center" style={backgroundStyle}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="welcome-section mb-4 d-flex justify-content-center align-items-center" style={backgroundStyle}>
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="welcome-section mb-4" style={backgroundStyle}>
      {/* Design elements */}
      {designElements.map((style, index) => (
        <div key={`circle-${index}`} style={style}></div>
      ))}
      
      {/* Outline elements */}
      {outlineElements.map((style, index) => (
        <div key={`outline-${index}`} style={style}></div>
      ))}
      
      {/* Linear elements */}
      {linearElements.map((style, index) => (
        <div key={`line-${index}`} style={style}></div>
      ))}

      {/* Main circle with welcome text */}
      <div style={mainCircleStyle}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#0370B7',
            marginBottom: '4px'
          }}>
            CHÀO MỪNG ĐẾN
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#0370B7',
            marginBottom: '4px',
            letterSpacing: '0.5px'
          }}>
            UNISHARE
          </div>
          <div style={{ 
            fontSize: '10px', 
            color: '#0370B7', 
            opacity: 0.8,
            letterSpacing: '1px'
          }}>
            PHIÊN BẢN BETA
          </div>
        </div>
      </div>
      
      {/* Additional background decorations */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'linear-gradient(to bottom right, transparent, rgba(255, 255, 255, 0.3))',
        borderTopLeftRadius: '100%',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#ffffff',
        opacity: 0.6,
        zIndex: 1
      }}></div>
    </div>
  );
};

export default Dashboard;
