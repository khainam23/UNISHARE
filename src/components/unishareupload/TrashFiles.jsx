import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

const TrashFiles = () => {
  return (
    <>
      {/* Search bar */}
      <InputGroup className="mb-4">
        <InputGroup.Text className="bg-light border-end-0">
          <BsSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Tìm kiếm"
          className="bg-light border-start-0"
        />
      </InputGroup>

      <h4 className="mb-4">Thùng rác</h4>
      
      {/* Empty trash state */}
      <div className="text-center py-5">
        <div className="mb-4">
          <img 
            src="/trash-empty.png" 
            alt="Empty Trash" 
            style={{ width: '120px', height: '120px', opacity: '0.5' }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none';
              const fallbackIcon = document.createElement('div');
              fallbackIcon.innerHTML = '<svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 5L5 19M5.00001 5L19 19" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/></svg>';
              e.target.parentNode.appendChild(fallbackIcon);
            }}
          />
        </div>
        <h5 className="text-muted">Không tìm thấy tập nào đã xóa</h5>
      </div>
    </>
  );
};

export default TrashFiles;
