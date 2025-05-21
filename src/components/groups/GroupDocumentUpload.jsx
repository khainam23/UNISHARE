import React, { useState } from 'react';
import { Card, Form, Button, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { documentService } from '../../services';
import { useNavigate, useParams } from 'react-router-dom';
import { BsUpload, BsArrowLeft, BsFileEarmark } from 'react-icons/bs';

const GroupDocumentUpload = () => {
  const { groupId } = useParams();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Auto-fill title with file name without extension
    if (selectedFile && !title) {
      const fileNameWithoutExt = selectedFile.name.split('.').slice(0, -1).join('.');
      setTitle(fileNameWithoutExt);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Vui lòng chọn một tập tin để tải lên');
      return;
    }
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề cho tài liệu');
      return;
    }
    
    try {
      setUploading(true);
      setProgress(0);
      setError('');
      
      // Create a FormData instance to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      
      // Set up progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      const response = await documentService.uploadGroupDocument(groupId, formData);
      
      clearInterval(progressInterval);
      
      if (response.success) {
        setProgress(100);
        setSuccess(true);
        
        // Redirect after short delay
        setTimeout(() => {
          navigate(`/unishare/groups/${groupId}`);
        }, 1500);
      } else {
        throw new Error(response.message || 'Tải lên tài liệu thất bại');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi trong quá trình tải lên');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Function to format file size
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Tải Tài Liệu Lên Nhóm</h5>
          <Button 
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate(`/unishare/groups/${groupId}`)}
          >
            <BsArrowLeft /> Quay lại nhóm
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Tài liệu đã được tải lên thành công!</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tập tin tài liệu</Form.Label>
            <div className="custom-file-upload">
              <input 
                type="file" 
                className="form-control"
                onChange={handleFileChange}
                disabled={uploading}
                id="documentFile"
              />
            </div>
            <Form.Text className="text-muted">
              Định dạng hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT (Tối đa: 50MB)
            </Form.Text>
          </Form.Group>
          
          {file && (
            <div className="selected-file mb-3 p-2 border rounded bg-light">
              <div className="d-flex align-items-center">
                <BsFileEarmark className="me-2 text-primary" />
                <div className="flex-grow-1">
                  <div className="text-truncate">{file.name}</div>
                  <small className="text-muted">{formatFileSize(file.size)}</small>
                </div>
              </div>
            </div>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tài liệu"
              disabled={uploading}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả tài liệu (tùy chọn)"
              disabled={uploading}
            />
          </Form.Group>
          
          {uploading && (
            <div className="mb-3">
              <p className="mb-2">Đang tải lên: {Math.round(progress)}%</p>
              <ProgressBar 
                now={progress} 
                animated 
                variant={progress < 100 ? "primary" : "success"}
              />
            </div>
          )}
          
          <Button 
            variant="primary" 
            type="submit"
            disabled={uploading || !file || !title.trim() || success}
            className="d-flex align-items-center"
          >
            {uploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang tải lên...
              </>
            ) : (
              <>
                <BsUpload className="me-2" /> Tải lên tài liệu
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GroupDocumentUpload;
