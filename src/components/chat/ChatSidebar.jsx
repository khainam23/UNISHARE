import React, { useState, useEffect } from 'react';
import { ListGroup, Image, Badge, Spinner, Alert, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaUsers, FaUser, FaCircle } from 'react-icons/fa';
import userAvatar from '../../assets/avatar-1.png';
import { chatService } from '../../services';

const ChatSidebar = ({ activeChatId }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await chatService.getUserChats();
        
        // Better error detection - response exists and has expected structure
        if (response && (response.success === true || (response.data && Array.isArray(response.data.data)))) {
          // Make sure we have data in the right structure
          const chatsData = response.data?.data || [];
          console.log('Chats data received:', chatsData);
          setChats(chatsData);
        } else {
          console.error('Error in chat response:', response);
          // Only throw error if response completely missing or malformed
          if (!response || (!response.data && !response.success)) {
            throw new Error(response?.message || 'Không thể tải danh sách cuộc trò chuyện');
          } else {
            // Empty chats list is acceptable
            setChats([]);
          }
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Không thể tải danh sách cuộc trò chuyện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
    
    // Poll for new chats/messages every 30 seconds
    const interval = setInterval(fetchChats, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format timestamp to a readable format
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // If less than 1 minute ago
    if (diffMins < 1) {
      return 'Vừa xong';
    }
    
    // If less than 1 hour ago, show minutes
    if (diffHours < 1) {
      return `${diffMins} phút trước`;
    }
    
    // If less than 24 hours ago, show hours
    if (diffDays < 1) {
      return `${diffHours} giờ trước`;
    }
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    }
    
    // If this year, show date without year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString('vi-VN');
  };

  // Get chat label based on type and members
  const getChatLabel = (chat) => {
    if (chat.name) return chat.name;
    
    // For private chats, get the other user's name
    if (!chat.is_group && chat.participants && chat.participants.length > 0) {
      const otherParticipant = chat.participants.find(
        p => p.user?.id !== chat.current_user?.id
      );
      return otherParticipant?.user?.name || 'Người dùng không xác định';
    }
    
    return 'Cuộc trò chuyện không có tên';
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      chat.name?.toLowerCase().includes(searchTermLower) ||
      chat.participants?.some(participant => 
        participant.user?.name?.toLowerCase().includes(searchTermLower)
      ) ||
      chat.last_message?.content?.toLowerCase().includes(searchTermLower)
    );
  });
  
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải danh sách chat...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }
  
  return (
    <div className="chat-sidebar">
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>
      
      <ListGroup className="shadow-sm chat-list">
        {filteredChats.length === 0 ? (
          <ListGroup.Item className="text-center py-4">
            <p className="mb-0 text-muted">Không có cuộc trò chuyện nào</p>
          </ListGroup.Item>
        ) : (
          filteredChats.map((chat) => {
            const chatLabel = getChatLabel(chat);
            return (
              <ListGroup.Item 
                key={chat.id}
                action
                as={Link}
                to={`/unishare/chats/${chat.id}`}
                active={chat.id.toString() === activeChatId}
                className={`d-flex align-items-center p-3 chat-item ${!chat.is_read ? 'fw-bold' : ''}`}
              >
                <div className="position-relative">
                  <Image 
                    src={chat.avatar || userAvatar} 
                    roundedCircle 
                    width={48} 
                    height={48}
                    className="me-3"
                    style={{ objectFit: 'cover', border: '1px solid #e0e0e0' }}
                  />
                  <div 
                    className="chat-type-indicator position-absolute"
                    style={{ 
                      bottom: '0', 
                      right: '8px', 
                      backgroundColor: chat.is_group ? '#5bc0de' : '#5cb85c',
                      padding: '4px',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '2px solid white'
                    }}
                  >
                    {chat.is_group ? 
                      <FaUsers size={10} color="white" /> : 
                      <FaUser size={10} color="white" />
                    }
                  </div>
                </div>
                
                <div className="flex-grow-1 text-truncate">
                  <div className="d-flex justify-content-between align-items-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-${chat.id}`}>{chatLabel}</Tooltip>}
                    >
                      <div className="chat-name text-truncate fw-semibold">
                        {chatLabel}
                      </div>
                    </OverlayTrigger>
                    <div className="d-flex align-items-center">
                      {!chat.is_read && (
                        <div className="me-2">
                          <FaCircle size={8} color="#0d6efd" />
                        </div>
                      )}
                      <small className="text-muted timestamp">
                        {formatLastMessageTime(chat.last_message?.created_at || chat.updated_at)}
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="last-message text-truncate text-muted small">
                      {chat.last_message ? (
                        <>
                          <span className="sender-name me-1 fw-medium">
                            {chat.last_message.user?.name === chat.current_user?.name ? 'Bạn:' : 
                             chat.last_message.user?.name ? `${chat.last_message.user.name.split(' ').pop()}:` : ''}
                          </span>
                          {chat.last_message.content || 
                           (chat.last_message.attachments?.length ? 'Đã gửi một file đính kèm' : '(Không có nội dung)')}
                        </>
                      ) : (
                        'Chưa có tin nhắn'
                      )}
                    </div>
                    
                    {chat.unread_count > 0 && (
                      <Badge 
                        bg="primary" 
                        pill 
                        className="ms-2 unread-badge"
                        style={{ 
                          minWidth: '20px', 
                          height: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center'
                        }}
                      >
                        {chat.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
            );
          })
        )}
      </ListGroup>
      
      <style jsx="true">{`
        .chat-list .chat-item {
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }
        
        .chat-list .chat-item:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
        
        .chat-list .chat-item.active {
          border-left-color: #0d6efd;
        }
        
        .chat-list .unread-badge {
          font-size: 0.7rem;
        }
        
        .chat-list .timestamp {
          font-size: 0.75rem;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default ChatSidebar;
