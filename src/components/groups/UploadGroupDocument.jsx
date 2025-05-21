import React, { useState } from 'react';
import { Card, Form, Button, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { BsUpload, BsX } from 'react-icons/bs';
import { documentService } from '../../services';
import { useNavigate } from 'react-router-dom';

const UploadGroupDocument = ({ groupId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      setFileError('Tệp quá lớn. Kích thước tối đa là 50MB.');
      setFile(null);
      e.target.value = '';
      return;
    }
    
    setFileError('');
    setFile(selectedFile);
  };
  
  const removeFile = () => {
    setFile(null);
    setFileError('');
    // Reset the file input
    document.getElementById('document-file').value = '';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề tài liệu');
      return;
    }
    
    if (!file) {
      setFileError('Vui lòng chọn tệp để tải lên');
      return;
    }
    
    try {
      setError('');
      setIsUploading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);
      
      // Upload document
      const response = await documentService.uploadGroupDocument(groupId, formData);
      
      if (response.success) {
        // Navigate back to group documents
        navigate(`/unishare/groups/${groupId}`, { state: { activeTab: 'documents' } });
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.message || 'Không thể tải lên tài liệu. Vui lòng thử lại sau.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Tải tài liệu lên nhóm</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề tài liệu <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề tài liệu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả ngắn về tài liệu (không bắt buộc)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tệp tài liệu <span className="text-danger">*</span></Form.Label>
            
            {fileError && <Alert variant="danger">{fileError}</Alert>}
            
            {!file ? (
              <div className="file-upload-area p-4 border rounded text-center">
                <BsUpload size={32} className="mb-2 text-muted" />
                <p className="mb-2">Kéo thả tệp vào đây hoặc nhấn để chọn tệp</p>
                <small className="text-muted d-block mb-3">Kích thước tối đa: 50MB</small>
                <Button
                  variant="outline-primary"
                  onClick={() => document.getElementById('document-file').click()}
                  disabled={isUploading}
                >
                  Chọn tệp
                </Button>
                <Form.Control
                  type="file"
                  id="document-file"
                  className="d-none"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div className="selected-file p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">{file.name}</div>
                    <div className="text-muted small">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={removeFile}
                    disabled={isUploading}
                  >
                    <BsX size={24} />
                  </Button>
                </div>
              </div>
            )}
          </Form.Group>
          
          {isUploading && (
            <div className="mb-3">
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                animated 
              />
              <small className="text-muted d-block mt-1 text-center">
                Đang tải lên, vui lòng chờ...
              </small>
            </div>
          )}
          
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/unishare/groups/${groupId}`)}
              disabled={isUploading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isUploading || !title.trim() || !file}
            >
              {isUploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Đang tải lên...
                </>
              ) : 'Tải lên'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UploadGroupDocument;
