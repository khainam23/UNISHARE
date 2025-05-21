import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Spinner, Alert, Pagination, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsSearch, BsUpload, BsFileEarmark, BsDownload, BsEye, BsFilter } from 'react-icons/bs';
import { documentService } from '../../services';

const GroupDocuments = ({ groupId, isMember }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments(currentPage, searchTerm);
  }, [groupId, currentPage, sortBy, sortDirection]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchDocuments(1, searchTerm);
    }, 500);
    
    setSearchTimeout(timeoutId);
    
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
      
      const response = await documentService.getGroupDocuments(groupId, { 
        page, 
        per_page: 10,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection
      });
      
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
      setError('');
      await documentService.downloadDocument(documentId);
    } catch (error) {
      console.error("Error downloading document:", error);
      setError('Không thể tải xuống tài liệu. Vui lòng thử lại sau.');
    }
  };

  const changeSorting = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      setSortBy(field);
      setSortDirection('desc');
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

  const getFileIcon = (fileType) => {
    // Return appropriate icon based on file type
    return <BsFileEarmark className="text-primary" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
            {isMember && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/unishare/groups/${groupId}/documents/upload`)}
                className="d-flex align-items-center"
              >
                <BsUpload className="me-1" /> Tải lên tài liệu
              </Button>
            )}
          </div>
          
          <div className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                variant="outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <BsFilter /> Lọc
              </Button>
            </InputGroup>
          </div>
          
          {showFilters && (
            <div className="mb-3 p-3 border rounded bg-light">
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Sắp xếp theo</Form.Label>
                    <Form.Select 
                      value={sortBy}
                      onChange={(e) => changeSorting(e.target.value)}
                    >
                      <option value="created_at">Ngày tạo</option>
                      <option value="title">Tiêu đề</option>
                      <option value="file_size">Kích thước</option>
                      <option value="download_count">Lượt tải</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Thứ tự</Form.Label>
                    <Form.Select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                    >
                      <option value="desc">Giảm dần</option>
                      <option value="asc">Tăng dần</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
          
          {loading && documents.length > 0 && (
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
                          {getFileIcon(document.file_type)}
                        </div>
                        <div className="flex-grow-1">
                          <Card.Title as="h6" className="mb-1">
                            <Link to={`/unishare/documents/view/${document.id}`} className="text-decoration-none">
                              {document.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="text-muted small mb-1">
                            {document.file_type?.toUpperCase()} • {formatFileSize(document.file_size)}
                            {document.download_count > 0 && ` • ${document.download_count} downloads`}
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
                            to={`/unishare/documents/view/${document.id}`}
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
