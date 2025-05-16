import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { BsCloudUpload, BsFileEarmark } from 'react-icons/bs';

const UploadDocumentModal = ({ show, handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle file upload logic here
    console.log('File to upload:', selectedFile);
    // Close the modal after submission
    handleClose();
    // Reset form
    setSelectedFile(null);
    setFileName('');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Tải lên tài liệu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4 py-3 bg-light rounded">
            <div className="mb-3">
              <BsCloudUpload size={40} className="text-primary" />
            </div>
            
            <div className="mb-3">
              {selectedFile ? (
                <div className="selected-file d-flex align-items-center justify-content-center">
                  <BsFileEarmark className="me-2" />
                  <span>{fileName}</span>
                </div>
              ) : (
                <p>Kéo và thả file tại đây hoặc</p>
              )}
            </div>
            
            <div>
              <Form.Group controlId="formFile" className="mb-0">
                <Form.Label className="btn btn-outline-primary mb-0">
                  Chọn file từ thiết bị
                </Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </Form.Group>
              <div className="mt-2 text-muted small">
                <div>Định dạng: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</div>
                <div>Dung lượng tối đa: 10MB</div>
              </div>
            </div>
          </div>
          
          <Form.Group className="mb-3" controlId="documentName">
            <Form.Label>Tên tài liệu</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Nhập tên tài liệu"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="documentVisibility">
            <Form.Label>Quyền truy cập</Form.Label>
            <Form.Select>
              <option value="private">Chỉ có bạn</option>
              <option value="public">Tất cả mọi người</option>
              <option value="groupOnly">Chỉ nhóm tham gia</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="documentDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Nhập mô tả tài liệu (không bắt buộc)"
            />
          </Form.Group>
          
          <Row className="mt-4">
            <Col className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Tải lên
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UploadDocumentModal;
