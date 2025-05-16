import React from 'react';
import { InputGroup, Form, Table } from 'react-bootstrap';
import { BsSearch, BsFileEarmark, BsThreeDotsVertical } from 'react-icons/bs';

const UploadHistory = () => {
  // Mock upload history data
  const uploadHistory = [
    { id: 1, fileName: 'Đề cương thi giữa kỳ ngành CNTT.pdf', date: '10/06/2024 10:45', status: 'success' },
    { id: 2, fileName: 'Tài liệu ôn tập cuối kỳ.docx', date: '05/06/2024 15:30', status: 'success' },
    { id: 3, fileName: 'Slide bài giảng lập trình Java.pptx', date: '01/06/2024 08:00', status: 'success' },
    { id: 4, fileName: 'Báo cáo thực tập nhóm 3.pdf', date: '25/05/2024 14:20', status: 'success' },
    { id: 5, fileName: 'Bảng mẫu đồ án cuối kỳ.xlsx', date: '20/05/2024 09:15', status: 'success' }
  ];

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

      <h4 className="mb-4">Lịch sử upload</h4>
      
      {/* Upload history table */}
      <Table hover responsive className="upload-history-table">
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Tên tập tin</th>
            <th style={{ width: '25%' }}>Ngày upload</th>
            <th style={{ width: '15%' }}>Trạng thái</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {uploadHistory.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">
                <div className="d-flex align-items-center">
                  <BsFileEarmark className="me-2 text-primary" />
                  <span>{item.fileName}</span>
                </div>
              </td>
              <td className="align-middle">{item.date}</td>
              <td className="align-middle">
                <span className="badge bg-success">Thành công</span>
              </td>
              <td className="align-middle">
                <div className="dropdown">
                  <button className="btn btn-link p-0" type="button" data-bs-toggle="dropdown">
                    <BsThreeDotsVertical />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#">Xem chi tiết</a></li>
                    <li><a className="dropdown-item" href="#">Tải xuống</a></li>
                    <li><a className="dropdown-item text-danger" href="#">Xóa khỏi lịch sử</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex="-1">Previous</a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default UploadHistory;
