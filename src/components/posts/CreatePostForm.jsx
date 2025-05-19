import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { BsFileEarmark, BsImage, BsX } from 'react-icons/bs';

const CreatePostForm = ({ groupId, onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && attachments.length === 0) {
      setError('Vui lòng nhập nội dung hoặc thêm file đính kèm');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('content', content);
      
      if (groupId) {
        formData.append('group_id', groupId);
      }
      
      // Add attachments to form data
      attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}]`, attachment.file);
      });
      
      // Call onSubmit prop with the form data
      await onSubmit(formData);
      
      // Reset form
      setContent('');
      
      // Revoke all object URLs
      attachments.forEach(attachment => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
      
      setAttachments([]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Không thể tạo bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };
  
  return (
    <div className="create-post-form">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        
        {attachments.length > 0 && (
          <div className="attachments-preview mb-3">
            <h6>File đính kèm:</h6>
            <div className="d-flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="attachment-item p-2 border rounded position-relative">
                  {attachment.preview ? (
                    <div className="d-flex flex-column align-items-center">
                      <div 
                        className="attachment-image mb-1" 
                        style={{
                          width: '80px',
                          height: '80px',
                          backgroundImage: `url(${attachment.preview})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <small className="text-truncate" style={{maxWidth: '80px'}}>{attachment.name}</small>
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-center">
                      <BsFileEarmark size={40} className="mb-2" />
                      <small className="text-truncate" style={{maxWidth: '80px'}}>{attachment.name}</small>
                      <small className="text-muted">{formatFileSize(attachment.size)}</small>
                    </div>
                  )}
                  
                  <Button 
                    variant="light" 
                    size="sm" 
                    className="position-absolute top-0 end-0 rounded-circle p-0"
                    style={{width: '24px', height: '24px'}}
                    onClick={() => removeAttachment(index)}
                  >
                    <BsX />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => document.getElementById('file-upload').click()}
              disabled={loading}
            >
              <BsFileEarmark className="me-1" />
              Thêm file
            </Button>
            
            <Button 
              variant="outline-secondary"
              onClick={() => document.getElementById('image-upload').click()}
              disabled={loading}
            >
              <BsImage className="me-1" />
              Thêm ảnh
            </Button>
            
            <input 
              type="file" 
              id="file-upload"
              className="d-none"
              onChange={handleAttachmentChange}
              multiple
              disabled={loading}
            />
            
            <input 
              type="file" 
              id="image-upload"
              className="d-none"
              onChange={handleAttachmentChange}
              accept="image/*"
              multiple
              disabled={loading}
            />
          </div>
          
          <div>
            <Button 
              variant="secondary" 
              className="me-2"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading || (!content.trim() && attachments.length === 0)}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Đang đăng...
                </>
              ) : (
                'Đăng bài'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreatePostForm;
