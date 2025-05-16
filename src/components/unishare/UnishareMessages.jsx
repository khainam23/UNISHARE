import React, { useState, useEffect } from 'react';
import { Card, Button, Image, Row, Col } from 'react-bootstrap';
import userAvatar from '../../assets/avatar-1.png';
import UnishareMessageDetail from './UnishareMessageDetail';

const groupMessages = [
  {
    id: 1,
    avatar: userAvatar,
    name: 'Học React-JS cơ bản',
    lastMessage: 'Thông báo làm bài tập...',
    time: '11:00 AM 12/05/2023',
    unread: true,
  },
  {
    id: 2,
    avatar: userAvatar,
    name: 'Học React-JS cơ bản',
    lastMessage: 'Thông báo làm bài tập...',
    time: '11:00 AM 12/05/2023',
  },
  {
    id: 3,
    avatar: userAvatar,
    name: 'Học React-JS cơ bản',
    lastMessage: 'Thông báo làm bài tập...',
    time: '11:00 AM 12/05/2023',
  },
  {
    id: 4,
    avatar: userAvatar,
    name: 'Học React-JS cơ bản',
    lastMessage: 'Thông báo làm bài tập...',
    time: '11:00 AM 12/05/2023',
  },
  {
    id: 5,
    avatar: userAvatar,
    name: 'Học React-JS cơ bản',
    lastMessage: 'Thông báo làm bài tập...',
    time: '11:00 AM 12/05/2023',
  },
];

const personalMessages = [
  {
    id: 1,
    avatar: userAvatar,
    name: 'Nguyễn Văn B',
    lastMessage: 'Bạn đã nhận được tài liệu mới.',
    time: '10:30 AM 12/05/2023',
  },
  {
    id: 2,
    avatar: userAvatar,
    name: 'Nguyễn Văn C',
    lastMessage: 'Cảm ơn bạn đã tham gia nhóm.',
    time: '09:15 AM 12/05/2023',
  },
];

const UnishareMessages = () => {
  const [activeTab, setActiveTab] = useState('group');
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Select the first message by default when component mounts
  useEffect(() => {
    if (groupMessages.length > 0 && !selectedMessage) {
      setSelectedMessage(groupMessages[0]);
    }
  }, []);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset selected message when changing tabs
    if (tab === 'group' && groupMessages.length > 0) {
      setSelectedMessage(groupMessages[0]);
    } else if (tab === 'personal' && personalMessages.length > 0) {
      setSelectedMessage(personalMessages[0]);
    } else {
      setSelectedMessage(null);
    }
  };

  return (
    <div className="mb-4">
      <h5 className="fw-bold mb-3" style={{ color: '#0370b7' }}>Tin Nhắn</h5>
      
      {/* Tabs */}
      <div className="mb-3 d-flex">
        <Button
          variant={activeTab === 'group' ? 'primary' : 'light'}
          onClick={() => handleTabChange('group')}
          className="me-2 border-0"
          style={{ 
            borderRadius: '5px',
            paddingLeft: '30px',
            paddingRight: '30px',
            fontWeight: 500,
            boxShadow: activeTab === 'group' ? '0 2px 6px rgba(3,112,183,0.2)' : 'none'
          }}
        >
          Nhóm
        </Button>
        <Button
          variant={activeTab === 'personal' ? 'primary' : 'light'}
          onClick={() => handleTabChange('personal')}
          className="border-0"
          style={{ 
            borderRadius: '5px',
            paddingLeft: '30px',
            paddingRight: '30px',
            fontWeight: 500,
            boxShadow: activeTab === 'personal' ? '0 2px 6px rgba(3,112,183,0.2)' : 'none'
          }}
        >
          Cá Nhân
        </Button>
      </div>

      <Row>
        {/* Messages List Column */}
        <Col md={selectedMessage ? 5 : 12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '10px' }}>
            <Card.Body className="p-0">
              {(activeTab === 'group' ? groupMessages : personalMessages).map((msg, idx, arr) => (
                <div
                  key={msg.id}
                  className={`d-flex align-items-center p-3 ${idx !== arr.length - 1 ? 'border-bottom' : ''}`}
                  style={{ 
                    borderColor: '#e9f2f9',
                    backgroundColor: msg.id === selectedMessage?.id ? '#f0f9ff' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectMessage(msg)}
                >
                  <Image
                    src={msg.avatar}
                    roundedCircle
                    width={50}
                    height={50}
                    className="me-3"
                    style={{ border: '2px solid #b3d8f6' }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold" style={{ color: '#0370b7', fontSize: '1rem' }}>
                        {msg.name}
                      </span>
                      <span className="text-muted small">{msg.time}</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {msg.lastMessage}
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center p-2">
                <Button 
                  variant="light" 
                  className="rounded-circle" 
                  style={{ width: '30px', height: '30px', padding: 0 }}
                >
                  ...
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Message Detail Column */}
        {selectedMessage && (
          <Col md={7}>
            <UnishareMessageDetail conversation={selectedMessage} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default UnishareMessages;
