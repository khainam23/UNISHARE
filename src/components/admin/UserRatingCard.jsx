import React from 'react';
import { Card } from 'react-bootstrap';

const UserRatingCard = () => {
  const ratingData = {
    overall: 85,
    reviews: [
      { label: 'Web Design', percentage: 92, color: '#00B8D9', bgColor: '#E6F8FB' },
      { label: 'UX Design', percentage: 85, color: '#FF8B00', bgColor: '#FFF3E6' }
    ]
  };

  const renderRatingCircle = (percentage, color, size, thickness, label, position) => {
    const radius = size / 2 - thickness;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="position-relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F0F0F0"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div
          className="position-absolute d-flex flex-column align-items-center justify-content-center"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <span style={{ fontSize: '22px', fontWeight: 'bold', color }}>{percentage}%</span>
          {label && <span style={{ fontSize: '12px', color: '#6c757d' }}>{label}</span>}
        </div>
        {position === 'right' && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '110%', 
            transform: 'translateY(-50%)', 
            fontSize: '14px' 
          }}>
            {label}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <h5 className="card-title mb-4">Your Rating</h5>
        <div className="d-flex justify-content-around mb-4">
          {renderRatingCircle(ratingData.overall, '#FF8B00', 120, 10, 'Your Avg Rating')}
        </div>
        <div className="mt-4">
          {ratingData.reviews.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: item.bgColor,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px'
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: item.color,
                      borderRadius: '2px'
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '14px' }}>{item.label}</span>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ flex: 1 }}>
                  <div className="progress" style={{ height: '8px', backgroundColor: '#f0f0f0' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                </div>
                <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: '600' }}>
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserRatingCard;
