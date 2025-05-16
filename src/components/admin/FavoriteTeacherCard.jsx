import React from 'react';
import { Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const FavoriteTeacherCard = () => {
  const teachers = [
    { id: 1, name: 'Nguyễn Văn Nam', rating: '5.0/5.0', image: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Nguyễn Thái Văn', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=12' },
    { id: 3, name: 'Nguyễn Thái Nhân', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=13' },
    { id: 4, name: 'Nguyễn Văn Minh', rating: '4.7/5.0', image: 'https://i.pravatar.cc/150?img=14' }
  ];

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <h5 className="card-title mb-4">Favorite Teacher</h5>
        <div>
          {teachers.map((teacher) => (
            <div key={teacher.id} className="d-flex align-items-center mb-3">
              <img
                src={teacher.image}
                alt={teacher.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '12px'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{teacher.name}</div>
                <div className="d-flex align-items-center">
                  <FaStar style={{ color: '#FFC107', fontSize: '12px', marginRight: '4px' }} />
                  <span style={{ fontSize: '12px', color: '#6C757D' }}>{teacher.rating}</span>
                </div>
              </div>
              <span className="badge rounded-pill bg-light text-dark" style={{ fontSize: '10px' }}>
                {teacher.id === 1 ? '5.0/5.0' : teacher.rating}
              </span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FavoriteTeacherCard;
