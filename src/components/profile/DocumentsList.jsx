import React, { useState } from 'react';
import { Table, Dropdown, Button } from 'react-bootstrap';
import { BsFileEarmarkText, BsThreeDotsVertical, BsCloudUpload } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import UploadDocumentModal from './UploadDocumentModal';

const DocumentsList = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  
  const documents = [
    { id: 1, name: 'Toan cao cap world', access: 'Chỉ có bạn', date: 'Ngày 12/04/2025, 12h00' },
    { id: 2, name: 'Toan cao cap world', access: 'Chỉ có bạn', date: 'Ngày 12/04/2025, 12h00' },
    { id: 3, name: 'Toan cao cap world', access: 'Chỉ có bạn', date: 'Ngày 12/04/2025, 12h00' },
    { id: 4, name: 'Toan cao cap world', access: 'Chỉ có bạn', date: 'Ngày 12/04/2025, 12h00' },
    { id: 5, name: 'Toan cao cap world', access: 'Chỉ có bạn', date: 'Ngày 12/04/2025, 12h00' },
  ];

  const handleNavigateToUniShare = () => {
    navigate('/unishare/upload');
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Danh sách tài liệu</h5>
        <Button 
          variant="primary" 
          onClick={handleNavigateToUniShare}
          className="d-flex align-items-center"
        >
          <BsCloudUpload className="me-2" /> Tải lên tài liệu
        </Button>
      </div>
      
      <Table hover responsive className="documents-table">
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Tên</th>
            <th style={{ width: '25%' }}>Ai có thể truy cập</th>
            <th style={{ width: '20%' }}>Ngày giờ</th>
            <th style={{ width: '5%' }}></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td><BsFileEarmarkText className="me-2 text-primary" /> {doc.name}</td>
              <td>{doc.access}</td>
              <td>{doc.date}</td>
              <td>
                <Dropdown align="end">
                  <Dropdown.Toggle as="a" bsPrefix="p-0" style={{ cursor: 'pointer' }}>
                    <BsThreeDotsVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Xem chi tiết</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Chỉnh sửa</Dropdown.Item>
                    <Dropdown.Item href="#/action-3" className="text-danger">Xóa</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Upload Document Modal */}
      <UploadDocumentModal 
        show={showUploadModal} 
        handleClose={handleCloseUploadModal} 
      />
    </>
  );
};

export default DocumentsList;
