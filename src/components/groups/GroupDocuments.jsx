import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Spinner, Alert, Pagination, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsSearch, BsUpload, BsFileEarmark, BsDownload, BsEye } from 'react-icons/bs';
import { documentService } from '../../services';

const GroupDocuments = ({ groupId, userRole }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchDocuments(currentPage, searchTerm);
  }, [groupId, currentPage]);

  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to delay the search
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchDocuments(1, searchTerm);
    }, 500);
    
    setSearchTimeout(timeoutId);
    
    // Clean up the timeout when the component unmounts or searchTerm changes
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  const fetchDocuments = async (page, search = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Log the request for debugging
      console.log(`Fetching documents for group ${groupId}, page ${page}, search: '${search}'`);
      
      const response = await documentService.getGroupDocuments(groupId, { 
        page, 
        per_page: 10,
        search
      });
      
      // Log the response for debugging
      console.log('Group documents response:', response);
      
      if (response.success) {
        setDocuments(response.data || []);
        setTotalPages(response.meta?.last_page || 1);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách tài liệu');
      }
    } catch (err) {
      console.error("Error fetching group documents:", err);
      setError('Không thể tải danh sách tài liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId) => {
    try {
      await documentService.downloadDocument(documentId);
    } catch (error) {
      console.error("Error downloading document:", error);
      setError('Không thể tải xuống tài liệu. Vui lòng thử lại sau.');
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        />
        {items}
        <Pagination.Next 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        />
      </Pagination>
    );
  };

  if (loading && documents.length === 0) {
    return <div className="text-center py-4"><Spinner animation="border" /></div>;
  }

  return (
    <div className="group-documents-container">
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Tài liệu nhóm</h5>
            {(userRole === 'admin' || userRole === 'moderator') && (
              <Button
                variant="primary"
                size="sm"
                as={Link}
                to={`/unishare/groups/${groupId}/upload`}
                className="d-flex align-items-center"
              >
                <BsUpload className="me-1" /> Tải lên tài liệu mới
              </Button>
            )}
          </div>
          
          <Form>
            <InputGroup className="mb-3">
              <InputGroup.Text id="search-addon">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm tài liệu..."
                aria-label="Tìm kiếm tài liệu"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Form>
          
          {loading && (
            <div className="text-center py-2 mb-3"><Spinner animation="border" size="sm" /></div>
          )}
          
          {documents.length === 0 && !loading ? (
            <Alert variant="info">
              {searchTerm ? 'Không tìm thấy tài liệu nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có tài liệu nào trong nhóm này.'}
            </Alert>
          ) : (
            <Row xs={1} className="g-3">
              {documents.map((document) => (
                <Col key={document.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        <div className="document-icon me-3">
                          <BsFileEarmark size={32} className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <Card.Title as="h6" className="mb-1">
                            <Link to={`/unishare-files/view/${document.id}`} className="text-decoration-none">
                              {document.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="text-muted small mb-1">
                            {document.file_type?.toUpperCase()} • {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                          </Card.Text>
                          <Card.Text className="text-muted small">
                            Đăng bởi: {document.user?.name || 'Unknown'} • {new Date(document.created_at).toLocaleDateString('vi-VN')}
                          </Card.Text>
                        </div>
                        <div className="d-flex">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleDownload(document.id)}
                          >
                            <BsDownload />
                          </Button>
                          <Button
                            as={Link}
                            to={`/unishare-files/view/${document.id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            <BsEye />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
      
      {renderPagination()}
    </div>
  );
};

export default GroupDocuments;
