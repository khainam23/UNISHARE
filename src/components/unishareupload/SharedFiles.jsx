import React from 'react';
import { InputGroup, Form, Row, Col, Card } from 'react-bootstrap';
import { BsSearch, BsFileEarmark, BsThreeDotsVertical } from 'react-icons/bs';

const SharedFiles = () => {
  // Mock shared documents data
  const sharedDocuments = [
    { id: 1, name: 'Đề thi trắc nghiệm nghiệp vụ', type: 'pdf', date: '01/06/2024' },
    { id: 2, name: 'Đề thi trắc nghiệm nghiệp vụ', type: 'pdf', date: '01/06/2024' },
    { id: 3, name: 'Đề thi trắc nghiệm nghiệp vụ', type: 'pdf', date: '01/06/2024' },
    { id: 4, name: 'Đề thi trắc nghiệm nghiệp vụ', type: 'pdf', date: '01/06/2024' },
    { id: 5, name: 'Đề thi trắc nghiệm nghiệp vụ', type: 'pdf', date: '01/06/2024' },
    { id: 6, name: 'Đề thi trắc nghiệm nghiệp vụ', type: 'pdf', date: '01/06/2024' }
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

      <h4 className="mb-3">Được chia sẻ</h4>

      {/* Display shared documents in two rows */}
      <Row>
        <Col md={12}>
          <h6 className="text-muted mb-3">Tuần trước</h6>
        </Col>
      </Row>
      
      {/* First row of documents */}
      <Row className="mb-4">
        {sharedDocuments.slice(0, 3).map((doc) => (
          <Col lg={4} md={6} className="mb-3" key={doc.id}>
            <Card className="shadow-sm h-100">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-light rounded p-2 me-2">
                    <BsFileEarmark className="text-primary" />
                  </div>
                  <div className="me-auto">
                    <Card.Title className="fs-6 mb-0 text-truncate" style={{maxWidth: "150px"}}>
                      {doc.name}
                    </Card.Title>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-link btn-sm text-muted p-0" type="button" data-bs-toggle="dropdown">
                      <BsThreeDotsVertical />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><a className="dropdown-item" href="#">Xem chi tiết</a></li>
                      <li><a className="dropdown-item" href="#">Tải xuống</a></li>
                    </ul>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={12}>
          <h6 className="text-muted mb-3">Tháng trước</h6>
        </Col>
      </Row>
      
      {/* Second row of documents */}
      <Row>
        {sharedDocuments.slice(3, 6).map((doc) => (
          <Col lg={4} md={6} className="mb-3" key={doc.id}>
            <Card className="shadow-sm h-100">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-light rounded p-2 me-2">
                    <BsFileEarmark className="text-primary" />
                  </div>
                  <div className="me-auto">
                    <Card.Title className="fs-6 mb-0 text-truncate" style={{maxWidth: "150px"}}>
                      {doc.name}
                    </Card.Title>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-link btn-sm text-muted p-0" type="button" data-bs-toggle="dropdown">
                      <BsThreeDotsVertical />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><a className="dropdown-item" href="#">Xem chi tiết</a></li>
                      <li><a className="dropdown-item" href="#">Tải xuống</a></li>
                    </ul>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SharedFiles;
