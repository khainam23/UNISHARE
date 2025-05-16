import React from 'react';
import { InputGroup, Form, Row, Col, Card } from 'react-bootstrap';
import { BsSearch, BsFileEarmark, BsThreeDotsVertical } from 'react-icons/bs';
import UnishareDropdown from './UnishareDropdown';

const MyFiles = () => {
  // Mock file data
  const myFiles = [
    { id: 1, name: 'Tài liệu Toán cao cấp', type: 'pdf', date: '01/06/2024' },
    { id: 2, name: 'Tài liệu Toán cao cấp', type: 'pdf', date: '01/06/2024' },
    { id: 3, name: 'Tài liệu Toán cao cấp', type: 'pdf', date: '01/06/2024' }
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

      <h4 className="mb-3">File của tôi</h4>

      {/* File cards */}
      <Row>
        {myFiles.map((file) => (
          <Col lg={4} md={6} className="mb-3" key={file.id}>
            <Card className="shadow-sm border h-100">
              <Card.Body className="p-3 pb-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-2">
                      <BsFileEarmark className="text-primary" size={20} />
                    </div>
                    <div>
                      <Card.Title className="mb-0 fs-6 text-truncate" style={{maxWidth: "150px"}}>
                        {file.name}
                      </Card.Title>
                    </div>
                  </div>
                  <UnishareDropdown>
                    <UnishareDropdown.Toggle as="div" className="btn btn-link p-0">
                      <BsThreeDotsVertical />
                    </UnishareDropdown.Toggle>
                    <UnishareDropdown.Menu align="end">
                      <UnishareDropdown.Item>Tải xuống</UnishareDropdown.Item>
                      <UnishareDropdown.Item>Chỉnh sửa</UnishareDropdown.Item>
                      <UnishareDropdown.Item className="text-danger">Xóa</UnishareDropdown.Item>
                    </UnishareDropdown.Menu>
                  </UnishareDropdown>
                </div>
                <Card.Text className="text-muted small mb-0">
                  {file.date}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Large file cards for display */}
      <h4 className="mb-3 mt-4">Đề thi cuối kỳ ngành nghệp vụ</h4>
      <Row>
        {[1, 2, 3].map((index) => (
          <Col lg={4} md={6} className="mb-3" key={index}>
            <Card className="shadow-sm border h-100">
              <div className="p-4">
                <div className="bg-light p-3 mb-3 text-center">
                  <BsFileEarmark size={40} className="text-primary" />
                </div>
                <Card.Title className="text-center mb-0 fs-6">
                  Đề thi cuối kỳ ngành nghệp vụ
                </Card.Title>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default MyFiles;
