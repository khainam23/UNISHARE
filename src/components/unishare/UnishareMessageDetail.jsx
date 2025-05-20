import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Image, Spinner } from 'react-bootstrap';
import { IoMdSend } from 'react-icons/io';
import { BsPaperclip, BsEmojiSmile } from 'react-icons/bs';
import userAvatar from '../../assets/avatar-1.png';
import { authService } from '../../services';

const UnishareMessageDetail = ({ chat, messages = [], loading = false, onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const previousMessagesLengthRef = useRef(0);

  // Ensure messages is always an array
  const messagesList = Array.isArray(messages) ? messages : 
                      (messages && messages.data && Array.isArray(messages.data)) ? messages.data : [];

  // Get current user when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = authService.getUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Smart scrolling: Only auto-scroll when new messages arrive or when explicitly set
  useEffect(() => {
    // Check if new messages were added
    const newMessagesAdded = messagesList.length > previousMessagesLengthRef.current;
    const isNewChat = previousMessagesLengthRef.current === 0 && messagesList.length > 0;
    previousMessagesLengthRef.current = messagesList.length;
    
    // Only scroll if:
    // 1. This is the first load of a new chat 
    // 2. New messages were added AND either:
    //    a. User hasn't scrolled up manually or
    //    b. User was already at the bottom
    if (isNewChat || (newMessagesAdded && (shouldScrollToBottom || !userScrolled))) {
      // Use setTimeout to ensure scrolling happens after render is complete
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
    }
  }, [messagesList, shouldScrollToBottom, userScrolled]);

  // When chat changes, reset scroll state and force scroll to bottom
  useEffect(() => {
    setUserScrolled(false);
    setShouldScrollToBottom(true);
    // Reset the container scroll first
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
    // Then scroll to bottom with a delay to ensure rendering is complete
    setTimeout(() => {
      scrollToBottom('auto');
    }, 100);
    
    // Reset the messages length reference when chat changes
    previousMessagesLengthRef.current = 0;
  }, [chat?.id]);

  // Helper to check if scrolled to bottom
  const isScrolledToBottom = () => {
    if (!messagesContainerRef.current) return true;
    
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom to consider "at bottom"
    
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Scroll to bottom function with behavior option
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      // Use scrollIntoView on the end reference
      messagesEndRef.current.scrollIntoView({ 
        behavior: behavior, 
        block: 'end',
        inline: 'nearest'
      });
      
      // Prevent page scrolling by focusing on the container
      // This keeps scrolling contained within the messages area
      messagesContainerRef.current.focus();
    }
  };

  // Track scroll position to determine if auto-scroll should happen
  const handleScroll = (e) => {
    // Determine if we're at the bottom
    const isAtBottom = isScrolledToBottom();
    
    // Only set userScrolled to true if we're not at the bottom
    // This helps distinguish between user scrolling up vs down
    if (!isAtBottom && !userScrolled) {
      setUserScrolled(true);
    } else if (isAtBottom && userScrolled) {
      // If user has scrolled back to bottom, reset the userScrolled flag
      setUserScrolled(false);
    }
    
    // Update shouldScrollToBottom based on whether we're at the bottom
    setShouldScrollToBottom(isAtBottom);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    console.log('Sending message:', messageInput);
    
    // Ensure we scroll to bottom after sending a new message
    setShouldScrollToBottom(true);
    setUserScrolled(false);
    
    if (onSendMessage) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: '10px', height: '100%' }}>
      {/* Header */}
      <Card.Header
        className="bg-white d-flex align-items-center p-3"
        style={{ borderBottom: '1px solid #e9f2f9' }}
      >
        <Image
          src={chat?.avatar_url || userAvatar}
          roundedCircle
          width={40}
          height={40}
          className="me-2"
          style={{ border: '2px solid #b3d8f6' }}
        />
        <div>
          <h6 className="mb-0 fw-bold" style={{ color: '#0370b7' }}>
            {chat?.name || 'Cuộc trò chuyện'}
          </h6>
          <small className="text-muted">
            {chat?.participants?.length || 0} thành viên
          </small>
        </div>
      </Card.Header>

      {/* Message Body */}
      <div
        ref={messagesContainerRef}
        className="p-3 message-container"
        style={{
          height: '350px',
          overflowY: 'auto',
          backgroundColor: '#f8fbff',
          outline: 'none' // Remove focus outline
        }}
        onScroll={handleScroll}
        tabIndex="-1" // Make div focusable but not in tab order
      >
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="sm" />
            <p className="mt-2 small">Đang tải tin nhắn...</p>
          </div>
        ) : messagesList.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messagesList.map((message) => {
            const isCurrentUser = currentUser && message.user_id === currentUser.id;
            
            return (
              <div
                key={message.id || `msg-${Math.random()}`}
                className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'} mb-3`}
              >
                {!isCurrentUser && (
                  <Image
                    src={message.user?.avatar_url || userAvatar}
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
                    backgroundColor: isCurrentUser ? '#0370b7' : 'white',
                    color: isCurrentUser ? 'white' : '#333',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div>{message.content}</div>
                  <div className="text-end mt-1">
                    <small style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                      {formatMessageTime(message.created_at)}
                    </small>
                  </div>
                </div>
                {isCurrentUser && (
                  <Image
                    src={currentUser?.avatar_url || userAvatar}
                    roundedCircle
                    width={32}
                    height={32}
                    className="ms-2 mt-1"
                    style={{ border: '1.5px solid #b3d8f6' }}
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card.Footer className="bg-white p-3">
        <Form className="d-flex align-items-center" onSubmit={handleSendMessage}>
          <Button
            variant="light"
            className="me-2"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
            type="button"
          >
            <BsPaperclip />
          </Button>
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            style={{ borderRadius: '20px' }}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button
            variant="light"
            className="mx-2"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
            type="button"
          >
            <BsEmojiSmile />
          </Button>
          <Button
            variant="primary"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
            type="submit"
            disabled={!messageInput.trim()}
          >
            <IoMdSend />
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default UnishareMessageDetail;
