import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OrderTimeCard = () => {
  const data = {
    labels: ['Afternoon', 'Evening', 'Morning'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#6F95FF', '#9EA8FF', '#D0D7FF'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  const timeData = [
    { label: 'Afternoon', percentage: '45%', color: '#6F95FF' },
    { label: 'Evening', percentage: '35%', color: '#9EA8FF' },
    { label: 'Morning', percentage: '20%', color: '#D0D7FF' }
  ];

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Order Time</h5>
          <Button variant="outline-secondary" size="sm" style={{ fontSize: '12px' }}>View Report</Button>
        </div>
        <div className="position-relative" style={{ height: '180px' }}>
          <Doughnut data={data} options={options} />
          <div 
            className="position-absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '12px', color: '#6c757d' }}>Afternoon</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>1,834 orders</div>
          </div>
        </div>
        <div className="mt-3">
          {timeData.map((item, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: item.color,
                    borderRadius: '3px',
                    marginRight: '8px'
                  }}
                ></div>
                <span style={{ fontSize: '13px' }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '13px' }}>{item.percentage}</span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderTimeCard;
