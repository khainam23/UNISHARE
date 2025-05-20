import React, { useState, useEffect } from 'react';
import { Card, Button, Image, Row, Col, Alert, Spinner } from 'react-bootstrap';
import userAvatar from '../../assets/avatar-1.png';
import UnishareMessageDetail from './UnishareMessageDetail';
import { chatService } from '../../services';

const UnishareMessages = ({ chats = [], loading = false, onChatCreated }) => {
  const [activeTab, setActiveTab] = useState('group');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [messageCache, setMessageCache] = useState({});
  
  // Filter chats based on tab
  const filteredChats = activeTab === 'group' 
    ? chats.filter(chat => chat.type === 'group' || chat.is_group) 
    : chats.filter(chat => chat.type === 'private' || !chat.is_group);

  // Select the first chat by default when component mounts or chats change
  useEffect(() => {
    if (filteredChats.length > 0 && !selectedChat) {
      setSelectedChat(filteredChats[0]);
    }
  }, [filteredChats, selectedChat]);

  // Load messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchMessages = async (chatId) => {
    // Check if we already have cached messages for this chat
    if (messageCache[chatId]) {
      console.log(`Using cached messages for chat ${chatId}`);
      setMessages(messageCache[chatId]);
      return;
    }
    
    try {
      setLoadingMessages(true);
      setError(null);
      
      console.log(`Fetching messages for chat ${chatId}`);
      
      const response = await chatService.getChatMessages(chatId);
      
      if (response.success && response.data) {
        // Ensure we're passing an array
        let messageArray = Array.isArray(response.data) ? response.data : 
                          (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
        
        // Sort messages by creation date in ascending order (oldest first)
        messageArray = messageArray.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateA - dateB;
        });
        
        console.log(`Loaded ${messageArray.length} messages for chat ${chatId}`);
        
        // Cache the messages for this chat
        setMessageCache(prev => ({
          ...prev,
          [chatId]: messageArray
        }));
        
        // Save the messages and ensure scroll position resets when changing chats
        setMessages(messageArray);
      } else {
        console.warn('Message response format unexpected:', response);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại sau.');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedChat(null); // Reset selected chat when changing tabs
  };

  const sendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;
    
    try {
      console.log(`Attempting to send message to chat ${selectedChat.id}:`, content);
      setError(null);
      
      const response = await chatService.sendMessage(selectedChat.id, { content });
      
      console.log('Send message response:', response);
      
      if (response.success) {
        console.log('Message sent successfully');
        
        // Add new message to the cache immediately
        if (response.data) {
          const newMessage = response.data;
          
          // Update message cache for this chat
          setMessageCache(prev => {
            const updatedMessages = [...(prev[selectedChat.id] || []), newMessage];
            return {
              ...prev,
              [selectedChat.id]: updatedMessages
            };
          });
          
          // Update current messages
          setMessages(prev => [...prev, newMessage]);
        } else {
          // Reload messages to show the new message if we don't have message data
          fetchMessages(selectedChat.id);
        }
      } else {
        console.error('Failed to send message:', response.message);
        setError(response.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.');
    }
  };

  // Format the time for display
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Format the last message time for display in the chat list
  const formatChatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
          variant={activeTab === 'private' ? 'primary' : 'light'}
          onClick={() => handleTabChange('private')}
          className="border-0"
          style={{ 
            borderRadius: '5px',
            paddingLeft: '30px',
            paddingRight: '30px',
            fontWeight: 500,
            boxShadow: activeTab === 'private' ? '0 2px 6px rgba(3,112,183,0.2)' : 'none'
          }}
        >
          Cá Nhân
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải cuộc trò chuyện...</p>
        </div>
      ) : (
        <Row>
          {/* Chats List Column */}
          <Col md={selectedChat ? 5 : 12}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '10px' }}>
              <Card.Body className="p-0">
                {filteredChats.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted mb-0">Không có cuộc trò chuyện nào.</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="d-flex align-items-center p-3 border-bottom"
                      style={{ 
                        borderColor: '#e9f2f9',
                        backgroundColor: chat.id === selectedChat?.id ? '#f0f9ff' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <Image
                        src={chat.avatar_url || userAvatar}
                        roundedCircle
                        width={50}
                        height={50}
                        className="me-3"
                        style={{ border: '2px solid #b3d8f6' }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold" style={{ color: '#0370b7', fontSize: '1rem' }}>
                            {chat.name || (chat.participants && chat.participants.length > 0 ? 
                              chat.participants.map(p => p.user?.name).join(', ') : 'Cuộc trò chuyện')}
                          </span>
                          <span className="text-muted small">{formatChatTime(chat.updated_at)}</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                          {chat.last_message?.content || 'Chưa có tin nhắn'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Message Detail Column */}
          {selectedChat && (
            <Col md={7}>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              <UnishareMessageDetail 
                chat={selectedChat}
                messages={messages}
                loading={loadingMessages}
                onSendMessage={sendMessage}
              />
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default UnishareMessages;
