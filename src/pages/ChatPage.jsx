import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaFile, FaImage, FaUsers, FaUserCircle, FaInfoCircle, FaTimesCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { chatService, authService } from '../services';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMessage from '../components/chat/ChatMessage';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch chat data and messages
  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Fetch chat details
        const chatResponse = await chatService.getChat(chatId);
        console.log('Chat response:', chatResponse);
        
        // Check for success property first, then fallback to checking if data exists
        if (chatResponse && (chatResponse.success === true || chatResponse.data)) {
          // Get the chat data based on the response structure
          const chatData = chatResponse.data || chatResponse;
          setChat(chatData);
          
          try {
            // Fetch chat messages
            const messagesResponse = await chatService.getChatMessages(chatId);
            console.log('Messages response:', messagesResponse);
            
            if (messagesResponse && (messagesResponse.success === true || messagesResponse.data)) {
              // Access data correctly based on the response structure
              const messagesData = messagesResponse.data?.data || messagesResponse.data || [];
              setMessages(messagesData);
              
              // Mark chat as read
              try {
                await chatService.markChatAsRead(chatId);
              } catch (markReadError) {
                console.warn('Failed to mark chat as read:', markReadError);
              }
            } else {
              console.warn('No messages data:', messagesResponse);
              setMessages([]);
            }
          } catch (messagesError) {
            console.error('Error loading messages:', messagesError);
            setMessages([]);
            // Don't set error state here to still show chat with empty messages
          }
        } else {
          throw new Error(chatResponse?.message || 'Không thể tải thông tin chat');
        }
      } catch (err) {
        console.error('Error loading chat:', err);
        setError(err.message || 'Không thể tải cuộc trò chuyện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
    
    // Poll for new messages every 10 seconds
    const pollInterval = setInterval(() => {
      if (chatId && !error) {
        fetchNewMessages();
      }
    }, 10000);
    
    return () => clearInterval(pollInterval);
  }, [chatId]);

  // Function to fetch new messages without reloading all data
  const fetchNewMessages = async () => {
    if (!chatId || !chat) return;
    
    try {
      // Only fetch messages, not the entire chat
      const messagesResponse = await chatService.getChatMessages(chatId);
      
      if (messagesResponse && (messagesResponse.success === true || messagesResponse.data)) {
        const messagesData = messagesResponse.data?.data || messagesResponse.data || [];
        setMessages(messagesData);
        
        // Mark chat as read
        await chatService.markChatAsRead(chatId);
      }
    } catch (err) {
      console.warn('Error fetching new messages:', err);
      // Don't set error state for background polling
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAttachmentChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    
    // Revoke object URL if it's an image to free up memory
    if (newAttachments[index].preview) {
      URL.revokeObjectURL(newAttachments[index].preview);
    }
    
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) {
      return;
    }
    
    try {
      setSending(true);
      
      const formData = new FormData();
      formData.append('content', newMessage);
      
      // Add attachments to form data
      attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}]`, attachment.file);
      });
      
      const response = await chatService.sendMessage(chatId, formData);
      
      if (response.success || response.data) {
        // Add new message to the list
        if (response.data) {
          setMessages(prevMessages => [response.data, ...prevMessages]);
        }
        
        // Clear form
        setNewMessage('');
        
        // Revoke all object URLs
        attachments.forEach(attachment => {
          if (attachment.preview) {
            URL.revokeObjectURL(attachment.preview);
          }
        });
        
        setAttachments([]);
      } else {
        throw new Error(response.message || 'Không thể gửi tin nhắn');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setSending(false);
    }
  };

  // Get chat name based on type
  const getChatName = () => {
    if (!chat) return 'Cuộc trò chuyện';
    
    if (chat.name) return chat.name;
    
    // For private chats, get the other user's name
    if (!chat.is_group && chat.participants && chat.participants.length > 0) {
      const otherParticipant = chat.participants.find(
        p => p.user?.id !== currentUser?.id
      );
      return otherParticipant?.user?.name || 'Người dùng không xác định';
    }
    
    return 'Cuộc trò chuyện không có tên';
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    // Force reload the current chat
    window.location.reload();
  };

  return (
    <>
      <Header />
      <div className="chat-page py-4" style={{ backgroundColor: '#f5f8fa', minHeight: 'calc(100vh - 120px)' }}>
        <Container fluid>
          <Row>
            {/* Chat Sidebar */}
            <Col md={3} className="mb-3">
              <ChatSidebar activeChatId={chatId} />
            </Col>
            
            {/* Main Chat Area */}
            <Col md={9}>
              <Card className="shadow-sm border-0 h-100">
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Đang tải cuộc trò chuyện...</p>
                  </div>
                ) : error ? (
                  <Alert variant="danger" className="m-3">
                    <div className="d-flex align-items-center mb-3">
                      <FaExclamationTriangle className="me-2" size={24} />
                      <div className="fw-bold">Có lỗi xảy ra</div>
                    </div>
                    <p>{error}</p>
                    <div className="d-flex gap-2 mt-3">
                      <Button variant="outline-primary" onClick={handleRetry}>
                        <FaArrowLeft className="me-2" /> Thử lại
                      </Button>
                      <Button variant="outline-secondary" onClick={() => navigate('/unishare/chats')}>
                        Quay lại danh sách chat
                      </Button>
                    </div>
                  </Alert>
                ) : (
                  <>
                    {/* Chat Header */}
                    <Card.Header className="bg-white border-bottom d-flex align-items-center p-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className={`chat-icon rounded-circle d-flex align-items-center justify-content-center me-2 ${chat?.is_group ? 'bg-info' : 'bg-success'} text-white`}
                          style={{ width: 40, height: 40 }}
                        >
                          {chat?.is_group ? <FaUsers size={20} /> : <FaUserCircle size={20} />}
                        </div>
                        <div>
                          <h5 className="mb-0">{getChatName()}</h5>
                          <small className="text-muted">
                            {chat?.is_group ? 
                              `${chat.participants?.length || 0} thành viên` : 
                              'Trò chuyện riêng tư'}
                          </small>
                        </div>
                      </div>
                      
                      <div className="ms-auto">
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          onClick={() => setShowParticipants(true)}
                          className="d-flex align-items-center"
                        >
                          <FaInfoCircle className="me-1" /> Chi tiết
                        </Button>
                      </div>
                    </Card.Header>
                    
                    {/* Chat Messages */}
                    <Card.Body className="p-3 overflow-auto" style={{ maxHeight: '60vh', minHeight: '60vh' }}>
                      {messages.length === 0 ? (
                        <div className="text-center text-muted p-5">
                          <div className="mb-3">
                            {chat?.is_group ? 
                              <FaUsers size={48} className="text-secondary" /> : 
                              <FaUserCircle size={48} className="text-secondary" />
                            }
                          </div>
                          <h5>Chưa có tin nhắn nào</h5>
                          <p>Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <ChatMessage 
                            key={message.id} 
                            message={message} 
                            isOwnMessage={currentUser && message.user_id === currentUser.id}
                          />
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </Card.Body>
                    
                    {/* Message Input */}
                    <Card.Footer className="bg-white border-top p-3">
                      <Form onSubmit={handleSendMessage}>
                        {attachments.length > 0 && (
                          <div className="attachments-preview mb-2 p-2 border rounded bg-light">
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">Đính kèm ({attachments.length})</small>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-muted"
                                onClick={() => {
                                  // Revoke all object URLs before clearing
                                  attachments.forEach(att => {
                                    if (att.preview) URL.revokeObjectURL(att.preview);
                                  });
                                  setAttachments([]);
                                }}
                              >
                                Xóa tất cả
                              </Button>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {attachments.map((attachment, index) => (
                                <div key={index} className="attachment-item border rounded p-2 position-relative"
                                     style={{ maxWidth: 120 }}>
                                  {attachment.preview ? (
                                    <div className="text-center mb-1">
                                      <img 
                                        src={attachment.preview} 
                                        alt={attachment.name} 
                                        className="img-fluid rounded" 
                                        style={{ maxHeight: 60, maxWidth: 100 }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-center mb-1">
                                      <FaFile className="text-muted" size={24} />
                                    </div>
                                  )}
                                  <small className="text-truncate d-block" style={{ fontSize: '0.7rem' }}>
                                    {attachment.name}
                                  </small>
                                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                                    {(attachment.size / 1024).toFixed(1)} KB
                                  </small>
                                  <Button
                                    variant="light"
                                    size="sm"
                                    className="position-absolute top-0 end-0 p-0 rounded-circle"
                                    style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                    onClick={() => removeAttachment(index)}
                                  >
                                    <FaTimesCircle size={12} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="d-flex">
                          <div className="me-2">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Đính kèm tệp</Tooltip>}
                            >
                              <Button 
                                variant="light" 
                                className="border d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                                onClick={() => document.getElementById('file-upload').click()}
                                disabled={sending}
                              >
                                <FaFile />
                              </Button>
                            </OverlayTrigger>
                            <input 
                              type="file" 
                              id="file-upload"
                              className="d-none"
                              onChange={handleAttachmentChange}
                              multiple
                              disabled={sending}
                            />
                          </div>
                          
                          <div className="me-2">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Đính kèm hình ảnh</Tooltip>}
                            >
                              <Button 
                                variant="light" 
                                className="border d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                                onClick={() => document.getElementById('image-upload').click()}
                                disabled={sending}
                              >
                                <FaImage />
                              </Button>
                            </OverlayTrigger>
                            <input 
                              type="file" 
                              id="image-upload"
                              className="d-none"
                              onChange={handleAttachmentChange}
                              accept="image/*"
                              multiple
                              disabled={sending}
                            />
                          </div>
                          
                          <Form.Control
                            type="text"
                            placeholder="Nhập tin nhắn của bạn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="me-2"
                            disabled={sending}
                          />
                          
                          <Button 
                            variant="primary" 
                            type="submit" 
                            className="d-flex align-items-center justify-content-center"
                            style={{ width: 45, height: 40 }}
                            disabled={sending || (!newMessage.trim() && attachments.length === 0)}
                          >
                            {sending ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FaPaperPlane />
                            )}
                          </Button>
                        </div>
                      </Form>
                    </Card.Footer>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Participants Modal */}
      <Modal show={showParticipants} onHide={() => setShowParticipants(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thành viên cuộc trò chuyện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chat?.participants?.length > 0 ? (
            <div className="participant-list">
              {chat.participants.map((participant, index) => (
                <div key={index} className="d-flex align-items-center mb-2 p-2 border-bottom">
                  <div 
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                    style={{ width: 40, height: 40, overflow: 'hidden' }}
                  >
                    {participant.user?.avatar ? (
                      <img 
                        src={participant.user.avatar} 
                        alt={participant.user?.name} 
                        className="img-fluid"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <FaUserCircle size={24} className="text-secondary" />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      {participant.user?.name || 'Người dùng không xác định'}
                      {participant.is_admin && (
                        <Badge bg="info" className="ms-2">Admin</Badge>
                      )}
                      {participant.user?.id === currentUser?.id && (
                        <Badge bg="secondary" className="ms-2">Bạn</Badge>
                      )}
                    </div>
                    <small className="text-muted">
                      {participant.joined_at ? `Tham gia: ${new Date(participant.joined_at).toLocaleDateString('vi-VN')}` : ''}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Không có thành viên nào</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowParticipants(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default ChatPage;
