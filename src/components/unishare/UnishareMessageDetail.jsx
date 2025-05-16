import React from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import { IoMdSend } from 'react-icons/io';
import { BsPaperclip, BsEmojiSmile } from 'react-icons/bs';
import userAvatar from '../../assets/avatar-1.png';

const UnishareMessageDetail = ({ conversation }) => {
  const messages = [
    {
      id: 1,
      sender: 'other',
      text: 'Chào bạn, đây là tin nhắn từ giảng viên của lớp React-JS cơ bản. Bạn đã hoàn thành bài tập chưa?',
      time: '10:30 AM',
      avatar: userAvatar
    },
    {
      id: 2,
      sender: 'me',
      text: 'Tôi đã hoàn thành bài tập rồi ạ!',
      time: '10:35 AM',
      avatar: userAvatar
    },
    {
      id: 3,
      sender: 'other',
      text: 'Tốt lắm! Hãy nộp bài tập vào hệ thống trước ngày mai nhé.',
      time: '10:37 AM',
      avatar: userAvatar
    }
  ];

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '10px', height: '100%' }}>
      {/* Header */}
      <Card.Header
        className="bg-white d-flex align-items-center p-3"
        style={{ borderBottom: '1px solid #e9f2f9' }}
      >
        <Image
          src={conversation?.avatar || userAvatar}
          roundedCircle
          width={40}
          height={40}
          className="me-2"
          style={{ border: '2px solid #b3d8f6' }}
        />
        <div>
          <h6 className="mb-0 fw-bold" style={{ color: '#0370b7' }}>
            {conversation?.name || 'Học React-JS cơ bản'}
          </h6>
          <small className="text-muted">
            {conversation?.members || '30 thành viên'}
          </small>
        </div>
      </Card.Header>

      {/* Message Body */}
      <div
        className="p-3"
        style={{
          height: '350px',
          overflowY: 'auto',
          backgroundColor: '#f8fbff'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`d-flex ${message.sender === 'me' ? 'justify-content-end' : 'justify-content-start'} mb-3`}
          >
            {message.sender !== 'me' && (
              <Image
                src={message.avatar}
                roundedCircle
                width={32}
                height={32}
                className="me-2 mt-1"
                style={{ border: '1.5px solid #b3d8f6' }}
              />
            )}
            <div
              style={{
                maxWidth: '70%',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                backgroundColor: message.sender === 'me' ? '#0370b7' : 'white',
                color: message.sender === 'me' ? 'white' : '#333',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div>{message.text}</div>
              <div className="text-end mt-1">
                <small style={{ opacity: 0.7, fontSize: '0.75rem' }}>{message.time}</small>
              </div>
            </div>
            {message.sender === 'me' && (
              <Image
                src={message.avatar}
                roundedCircle
                width={32}
                height={32}
                className="ms-2 mt-1"
                style={{ border: '1.5px solid #b3d8f6' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <Card.Footer className="bg-white p-3">
        <Form className="d-flex align-items-center">
          <Button
            variant="light"
            className="me-2"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <BsPaperclip />
          </Button>
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            style={{ borderRadius: '20px' }}
          />
          <Button
            variant="light"
            className="mx-2"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <BsEmojiSmile />
          </Button>
          <Button
            variant="primary"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <IoMdSend />
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default UnishareMessageDetail;
