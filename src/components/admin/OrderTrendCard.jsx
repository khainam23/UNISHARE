import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const OrderTrendCard = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Orders',
        data: [25, 40, 30, 50, 35, 60, 45],
        borderColor: '#6F95FF',
        backgroundColor: 'rgba(111, 149, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6F95FF',
        pointBorderColor: '#fff',
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Order</h5>
          <Button variant="outline-secondary" size="sm" style={{ fontSize: '12px' }}>View Report</Button>
        </div>
        <div className="d-flex mb-3">
          <div className="me-3">
            <div className="d-flex align-items-center mb-1">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6F95FF', marginRight: '6px' }}></div>
              <span className="text-muted" style={{ fontSize: '12px' }}>Last 6 days</span>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center mb-1">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E0E8FF', marginRight: '6px' }}></div>
              <span className="text-muted" style={{ fontSize: '12px' }}>Last week</span>
            </div>
          </div>
        </div>
        <div style={{ height: '200px' }}>
          <Line data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderTrendCard;
