import React, { useEffect, useRef, useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const TrafficChart = () => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  
  useEffect(() => {
    // Import Chart.js dynamically to avoid SSR issues
    const initChart = async () => {
      if (chartRef && chartRef.current) {
        // Dynamic import of Chart.js
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);
        
        // Destroy existing chart if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Traffic data for the chart
        const data = {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
          datasets: [
            {
              label: 'Traffic',
              data: [65, 48, 75, 55, 70, 45, 60, 50, 65, 45, 70, 40, 50, 60],
              backgroundColor: '#6F95FF',
              borderRadius: 4
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
              displayColors: false,
              callbacks: {
                title: function(context) {
                  return `Ngày ${context[0].label}`;
                },
                label: function(context) {
                  return `${context.raw} lượt truy cập`;
                }
              }
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
        
        // Create new chart
        const newChartInstance = new Chart(chartRef.current, {
          type: 'bar',
          data: data,
          options: options
        });
        
        setChartInstance(newChartInstance);
      }
    };
    
    initChart();
    
    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Lưu Lượng Truy Cập</h5>
          <Button variant="outline-secondary" size="sm" style={{ fontSize: '12px' }}>Xem Báo Cáo</Button>
        </div>
        <div className="d-flex mb-3">
          <div className="me-3">
            <div className="d-flex align-items-center mb-1">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6F95FF', marginRight: '6px' }}></div>
              <span className="text-muted" style={{ fontSize: '12px' }}>7 ngày qua</span>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center mb-1">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E0E8FF', marginRight: '6px' }}></div>
              <span className="text-muted" style={{ fontSize: '12px' }}>Tuần trước</span>
            </div>
          </div>
        </div>
        <div style={{ height: '250px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TrafficChart;
