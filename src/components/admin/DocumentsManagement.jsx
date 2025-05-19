import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Card, Spinner, Badge, Alert, Modal, Pagination } from 'react-bootstrap';
import { FaSearch, FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel } from 'react-icons/fa';
import { adminService } from '../../services';

const DocumentsManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, statusFilter, sortBy, sortDesc]);

  const fetchDocuments = async (search = '') => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page: currentPage,
        per_page: 10,
        sort_by: sortBy,
        sort_desc: sortDesc,
        search: search || searchTerm
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await adminService.getDocuments(params);
      
      setDocuments(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError('Không thể tải danh sách tài liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments(searchTerm);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  // File icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFileAlt />;
    
    fileType = fileType.toLowerCase();
    
    if (fileType.includes('pdf')) return <FaFilePdf className="text-danger" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className="text-primary" />;
    if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('xls')) return <FaFileExcel className="text-success" />;
    
    return <FaFileAlt />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Action handlers
  const handleView = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleApprove = (document) => {
    // Skip displaying modal if document is already approved
    if (document.is_approved) {
      return; // Document is already approved, do nothing
    }
    
    setSelectedDocument(document);
    setShowApproveModal(true);
  };

  const handleReject = (document) => {
    setSelectedDocument(document);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleDelete = (document) => {
    setSelectedDocument(document);
    setDeleteReason('');
    setShowDeleteModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedDocument) return;
    
    setActionLoading(true);
    
    try {
      // Check if document is already approved
      if (selectedDocument.is_approved) {
        // Update UI to match backend state without making API call
        setShowApproveModal(false);
        return;
      }
      
      const response = await adminService.approveDocument(selectedDocument.id);
      
      // Update document in the local state
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === selectedDocument.id ? { ...doc, is_approved: true } : doc
        )
      );
      
      setShowApproveModal(false);
    } catch (err) {
      console.error("Error approving document:", err);
      
      // Check if error is because document is already approved
      if (err.message && (
          err.message.includes('already approved') || 
          (err.response?.data?.message && err.response.data.message.includes('already approved'))
      )) {
        // Document is already approved, just update the UI to reflect this
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === selectedDocument.id ? { ...doc, is_approved: true } : doc
          )
        );
        setShowApproveModal(false);
      } else {
        // Other error
        setError('Không thể phê duyệt tài liệu. Vui lòng thử lại sau.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedDocument || !rejectReason) return;
    
    setActionLoading(true);
    
    try {
      const response = await adminService.rejectDocument(selectedDocument.id, rejectReason);
      
      // Update document in the local state
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === selectedDocument.id ? { ...doc, is_approved: false } : doc
        )
      );
      
      setShowRejectModal(false);
    } catch (err) {
      console.error("Error rejecting document:", err);
      
      // Check if we have a response with a message in the error
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Không thể từ chối tài liệu. Vui lòng thử lại sau.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDocument) return;
    
    setActionLoading(true);
    
    try {
      await adminService.deleteDocument(selectedDocument.id, deleteReason);
      
      // Remove document from the local state
      setDocuments(prevDocs => 
        prevDocs.filter(doc => doc.id !== selectedDocument.id)
      );
      
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting document:", err);
      setError('Không thể xóa tài liệu. Vui lòng thử lại sau.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisible = 5; // Maximum number of page links to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Adjust start page if end page is at maximum
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Add first page if not visible
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

    // Add visible page links
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

    // Add last page if not visible
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

  return (
    <div className="document-management-container">
      <h4 className="mb-4">Quản Lý Tài Liệu</h4>
      
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            {/* Search bar */}
            <Form className="d-flex mb-2 mb-md-0" onSubmit={handleSearch} style={{ maxWidth: '400px' }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
            
            {/* Filters */}
            <div className="d-flex">
              <Form.Select 
                className="me-2" 
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="approved">Đã duyệt</option>
                <option value="pending">Chờ duyệt</option>
              </Form.Select>
              
              <Form.Select 
                style={{ width: 'auto' }}
                value={`${sortBy}-${sortDesc ? 'desc' : 'asc'}`}
                onChange={(e) => {
                  const [newSortBy, direction] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortDesc(direction === 'desc');
                }}
              >
                <option value="created_at-desc">Mới nhất</option>
                <option value="created_at-asc">Cũ nhất</option>
                <option value="title-asc">Tên (A-Z)</option>
                <option value="title-desc">Tên (Z-A)</option>
                <option value="downloads-desc">Lượt tải (cao-thấp)</option>
                <option value="views-desc">Lượt xem (cao-thấp)</option>
              </Form.Select>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : documents.length > 0 ? (
        <>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Tên tài liệu</th>
                  <th>Người đăng</th>
                  <th>Kích thước</th>
                  <th>Lượt tải</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="file-icon me-2">
                          {getFileIcon(doc.file_type)}
                        </div>
                        <div>
                          <div className="fw-medium">{doc.title}</div>
                          <div className="text-muted small">{doc.subject || 'Không có môn học'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{doc.user ? doc.user.name : 'Không xác định'}</td>
                    <td>{formatFileSize(doc.file_size)}</td>
                    <td>{doc.download_count || 0}</td>
                    <td>
                      {doc.is_approved ? (
                        <Badge bg="success">Đã duyệt</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">Chờ duyệt</Badge>
                      )}
                      {doc.is_official && (
                        <Badge bg="info" className="ms-1">Chính thức</Badge>
                      )}
                    </td>
                    <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="me-1" 
                          title="Xem"
                          onClick={() => handleView(doc)}
                        >
                          <FaEye />
                        </Button>
                        
                        {!doc.is_approved && (
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="me-1" 
                            title="Phê duyệt"
                            onClick={() => handleApprove(doc)}
                          >
                            <FaCheck />
                          </Button>
                        )}
                        
                        {/* Show Reject button for all documents, regardless of approval status */}
                        <Button 
                          variant="warning" 
                          size="sm" 
                          className="me-1" 
                          title="Từ chối"
                          onClick={() => handleReject(doc)}
                        >
                          <FaTimes />
                        </Button>
                        
                        <Button 
                          variant="danger" 
                          size="sm" 
                          title="Xóa"
                          onClick={() => handleDelete(doc)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          {renderPagination()}
        </>
      ) : (
        <Alert variant="info">
          Không tìm thấy tài liệu nào phù hợp với bộ lọc.
        </Alert>
      )}
      
      {/* View Document Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết tài liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <div>
              <h5>{selectedDocument.title}</h5>
              <p className="text-muted">{selectedDocument.description || 'Không có mô tả'}</p>
              
              <hr />
              
              <dl className="row">
                <dt className="col-sm-3">Người đăng</dt>
                <dd className="col-sm-9">{selectedDocument.user?.name || 'Không xác định'}</dd>
                
                <dt className="col-sm-3">Môn học</dt>
                <dd className="col-sm-9">{selectedDocument.subject || 'N/A'}</dd>
                
                <dt className="col-sm-3">Mã môn học</dt>
                <dd className="col-sm-9">{selectedDocument.course_code || 'N/A'}</dd>
                
                <dt className="col-sm-3">Loại file</dt>
                <dd className="col-sm-9">{selectedDocument.file_type || 'N/A'}</dd>
                
                <dt className="col-sm-3">Kích thước</dt>
                <dd className="col-sm-9">{formatFileSize(selectedDocument.file_size)}</dd>
                
                <dt className="col-sm-3">Lượt xem</dt>
                <dd className="col-sm-9">{selectedDocument.view_count || 0}</dd>
                
                <dt className="col-sm-3">Lượt tải</dt>
                <dd className="col-sm-9">{selectedDocument.download_count || 0}</dd>
                
                <dt className="col-sm-3">Trạng thái</dt>
                <dd className="col-sm-9">
                  {selectedDocument.is_approved ? (
                    <Badge bg="success">Đã duyệt</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">Chờ duyệt</Badge>
                  )}
                  {' '}
                  {selectedDocument.is_official && (
                    <Badge bg="info">Chính thức</Badge>
                  )}
                </dd>
                
                <dt className="col-sm-3">Ngày tạo</dt>
                <dd className="col-sm-9">{new Date(selectedDocument.created_at).toLocaleString()}</dd>
              </dl>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Approve Document Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Phê duyệt tài liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn phê duyệt tài liệu "{selectedDocument?.title}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button variant="success" onClick={confirmApprove} disabled={actionLoading}>
            {actionLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Phê duyệt'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Reject Document Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Từ chối tài liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn từ chối tài liệu "{selectedDocument?.title}"?</p>
          <Form.Group>
            <Form.Label>Lý do từ chối</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối tài liệu..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button 
            variant="warning" 
            onClick={confirmReject} 
            disabled={actionLoading || !rejectReason.trim()}
          >
            {actionLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Từ chối'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Document Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa tài liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa tài liệu "{selectedDocument?.title}"?</p>
          <div className="text-danger mb-3">
            <small>Lưu ý: Hành động này không thể hoàn tác.</small>
          </div>
          <Form.Group>
            <Form.Label>Lý do xóa</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={deleteReason} 
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Nhập lý do xóa tài liệu (không bắt buộc)..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Xóa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DocumentsManagement;
