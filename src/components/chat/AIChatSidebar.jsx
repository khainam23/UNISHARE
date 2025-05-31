import React, { useState, useEffect, useRef } from 'react';
import { Card, ListGroup, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaRobot, FaTrash, FaEdit, FaComment, FaSearch } from 'react-icons/fa';
import { aiChatService, authService } from '../../services';

const AIChatSidebar = ({ activeChatId, onChatSelect, onNewChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChat, setEditingChat] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatModel, setNewChatModel] = useState('gpt-4');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isComponentMounted = useRef(true);

  useEffect(() => {
    isComponentMounted.current = true;
    fetchChats();
    
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      console.log('AIChatSidebar: Fetching AI chats list');
      const response = await aiChatService.getUserAIChats(null, false);
      
      if (!isComponentMounted.current) {
        console.log('Component unmounted during fetch, aborting update');
        return;
      }
      
      if (response) {
        console.log('AI Chat response received:', response);
        
        let chatsData = [];
        
        if (response.success === true && response.data) {
          chatsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        } else if (response.data) {
          chatsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        } else if (Array.isArray(response)) {
          chatsData = response;
        }
        
        console.log('Processed AI chats data:', chatsData);
        setChats(chatsData);
        
        if (response.success === false) {
          setError(response.message || 'Không thể tải danh sách trò chuyện AI');
        } else {
          setError('');
        }
      } else {
        console.warn('No response received for AI chats');
        setError('Không có phản hồi từ máy chủ');
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching AI chats:', error);
      if (isComponentMounted.current) {
        setError('Lỗi khi tải danh sách trò chuyện AI: ' + (error.message || 'Lỗi không xác định'));
        setChats([]);
      }
    } finally {
      if (isComponentMounted.current) {
        setLoading(false);
      }
    }
  };
  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) {
      setError('Vui lòng nhập tiêu đề trò chuyện');
      return;
    }

    try {
      setCreating(true);
      setError('');
      
      const chatData = {
        title: newChatTitle.trim(),
        model: newChatModel
      };
      
      const response = await aiChatService.createAIChat(chatData);
      
      if (response.success) {
        console.log('AI Chat created successfully:', response.data);
        
        // Add the new chat to the list
        const newChat = response.data;
        setChats(prevChats => [newChat, ...prevChats]);
        
        // Reset form and close modal
        setNewChatTitle('');
        setNewChatModel('gpt-4');
        setShowNewChatModal(false);
        
        // Select the new chat
        if (onNewChat) {
          onNewChat(newChat);
        }
        if (onChatSelect) {
          onChatSelect(newChat.id);
        }
      } else {
        setError(response.message || 'Không thể tạo trò chuyện AI');
      }
    } catch (error) {
      console.error('Error creating AI chat:', error);
      setError('Lỗi khi tạo trò chuyện AI: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setCreating(false);
    }
  };

  const handleEditChat = async () => {    if (!editingChat || !newChatTitle.trim()) {
      setError('Vui lòng nhập tiêu đề trò chuyện');
      return;
    }

    try {
      setUpdating(true);
      setError('');
      
      const updateData = {
        title: newChatTitle.trim(),
        model: newChatModel
      };
      
      const response = await aiChatService.updateAIChat(editingChat.id, updateData);
      
      if (response.success) {
        console.log('AI Chat updated successfully:', response.data);
        
        // Update the chat in the list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === editingChat.id 
              ? { ...chat, ...response.data }
              : chat
          )
        );
        
        // Reset form and close modal
        setNewChatTitle('');
        setNewChatModel('gpt-4');
        setEditingChat(null);
        setShowEditModal(false);
      } else {
        setError(response.message || 'Không thể cập nhật trò chuyện AI');
      }
    } catch (error) {
      console.error('Error updating AI chat:', error);
      setError('Lỗi khi cập nhật trò chuyện AI: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation();
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện AI này?')) {
      return;
    }

    try {
      const response = await aiChatService.deleteAIChat(chatId);
      
      if (response.success) {
        console.log('AI Chat deleted successfully');
        
        // Remove the chat from the list
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        
        // If this was the active chat, clear selection
        if (activeChatId === chatId && onChatSelect) {
          onChatSelect(null);
        }
      } else {
        setError(response.message || 'Không thể xóa trò chuyện AI');
      }
    } catch (error) {
      console.error('Error deleting AI chat:', error);
      setError('Lỗi khi xóa trò chuyện AI: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleEditClick = (chat, event) => {
    event.stopPropagation();
    setEditingChat(chat);
    setNewChatTitle(chat.title);
    setNewChatModel(chat.model || 'gpt-4');
    setShowEditModal(true);
  };

  const availableModels = aiChatService.getAvailableModels();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN');
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="h-100 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-3">
          <h5 className="mb-0 d-flex align-items-center">
            <FaRobot className="me-2" />
            Trò chuyện AI
          </h5>
        </Card.Header>
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-3">
          <h5 className="mb-0 d-flex align-items-center">
            <FaRobot className="me-2" />
            Trò chuyện AI
          </h5>
          <Button 
            variant="light" 
            size="sm" 
            onClick={() => setShowNewChatModal(true)}
            title="Tạo cuộc trò chuyện AI mới"
            className="rounded-circle"
            style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaPlus />
          </Button>
        </Card.Header>
        
        <div className="px-3 pt-3 pb-2">
          <Form.Group className="mb-2 position-relative">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-5"
            />
            <div className="position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}>
              <FaSearch className="text-secondary" />
            </div>
          </Form.Group>
        </div>
        
        <Card.Body className="p-0" style={{ overflowY: 'auto' }}>
          {error && (
            <Alert variant="danger" className="m-2 small">
              {error}
            </Alert>
          )}
          
          {chats.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <div className="empty-state-container py-5">
                <FaComment size={48} className="mb-3 opacity-50 text-primary" />
                <p className="mb-4">Chưa có cuộc trò chuyện AI nào</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowNewChatModal(true)}
                  className="rounded-pill px-3"
                >
                  <FaPlus className="me-2" />
                  Bắt đầu cuộc trò chuyện đầu tiên
                </Button>
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <FaSearch size={32} className="mb-3 opacity-50" />
              <p>Không tìm thấy cuộc trò chuyện phù hợp</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {filteredChats.map((chat) => (
                <ListGroup.Item
                  key={chat.id}
                  action
                  active={activeChatId === chat.id}
                  onClick={() => onChatSelect && onChatSelect(chat.id)}
                  className={`border-0 py-3 px-3 ${activeChatId === chat.id ? 'active-chat' : 'chat-item'}`}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: activeChatId === chat.id ? '4px solid #007bff' : '4px solid transparent',
                    backgroundColor: activeChatId === chat.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent'
                  }}
                >
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="mb-0 text-truncate text-dark" style={{ maxWidth: '170px' }}>
                        {chat.title || 'Cuộc trò chuyện không có tiêu đề'}
                      </h6>
                      <div className="chat-actions opacity-75">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 me-2 text-secondary"
                          onClick={(e) => handleEditClick(chat, e)}
                          title="Chỉnh sửa cuộc trò chuyện"
                        >
                          <FaEdit size={14} />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-danger"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          title="Xóa cuộc trò chuyện"
                        >
                          <FaTrash size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <div>
                        {chat.model && (
                          <Badge bg="secondary" pill className="me-2 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                            {chat.model}
                          </Badge>
                        )}
                        <Badge bg="light" text="dark" pill className="px-2 py-1" style={{ fontSize: '0.7rem' }}>
                          {chat.messages_count || 0} tin nhắn
                        </Badge>
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {formatTimestamp(chat.updated_at)}
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
        
        <Card.Footer className="bg-light p-3 d-flex justify-content-center">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowNewChatModal(true)}
            className="rounded-pill px-3 w-100"
          >
            <FaPlus className="me-2" />
            Tạo cuộc trò chuyện mới
          </Button>
        </Card.Footer>
      </Card>
      
      {/* New Chat Modal */}
      <Modal show={showNewChatModal} onHide={() => setShowNewChatModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Tạo Cuộc Trò Chuyện AI Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu Đề Cuộc Trò Chuyện</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề cuộc trò chuyện..."
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô Hình AI</Form.Label>
              <Form.Select
                value={newChatModel}
                onChange={(e) => setNewChatModel(e.target.value)}
              >
                {availableModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label} - {model.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewChatModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateChat}
            disabled={creating || !newChatTitle.trim()}
          >
            {creating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang tạo...
              </>
            ) : (
              'Tạo Cuộc Trò Chuyện'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Chat Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Chỉnh Sửa Cuộc Trò Chuyện AI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu Đề Cuộc Trò Chuyện</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề cuộc trò chuyện..."
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô Hình AI</Form.Label>
              <Form.Select
                value={newChatModel}
                onChange={(e) => setNewChatModel(e.target.value)}
              >
                {availableModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label} - {model.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditChat}
            disabled={updating || !newChatTitle.trim()}
          >
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang cập nhật...
              </>
            ) : (
              'Cập Nhật Cuộc Trò Chuyện'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      <style jsx>{`
        .chat-item:hover {
          background-color: rgba(0, 123, 255, 0.05);
        }
        .chat-actions {
          visibility: hidden;
        }
        .chat-item:hover .chat-actions,
        .active-chat .chat-actions {
          visibility: visible;
        }
      `}</style>
    </>
  );
};

export default AIChatSidebar;
