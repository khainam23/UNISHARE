import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { BsCloudUpload } from 'react-icons/bs';

const UploadForm = () => {
  return (
    <>
      <h4 className="mb-4">Tải lên tài liệu</h4>
      
      {/* Upload area */}
      <div className="upload-area text-center border rounded p-5 mb-4">
        <div className="mb-3">
          <BsCloudUpload size={40} className="text-primary" />
        </div>
        <div className="mb-3">
          <p>Kéo và thả file tại đây hoặc</p>
        </div>
        <Button variant="outline-primary">
          Chọn file từ thiết bị
        </Button>
        <div className="mt-2 text-muted small">
          <div>Định dạng: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</div>
          <div>Dung lượng tối đa: 10MB</div>
        </div>
      </div>

      {/* File details form */}
      <div className="mt-4">
        <Form>
          <Form.Group className="mb-3" controlId="documentName">
            <Form.Label>Tên tài liệu</Form.Label>
            <Form.Control type="text" placeholder="Nhập tên tài liệu" />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="documentVisibility">
            <Form.Label>Quyền truy cập</Form.Label>
            <Form.Select defaultValue="private">
              <option value="private">Chỉ có bạn</option>
              <option value="public">Tất cả mọi người</option>
              <option value="groupOnly">Chỉ nhóm tham gia</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="documentDescription">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả tài liệu (không bắt buộc)" />
          </Form.Group>
          
          <div className="text-end">
            <Button variant="secondary" className="me-2">
              Hủy
            </Button>
            <Button variant="primary">
              Tải lên
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default UploadForm;
