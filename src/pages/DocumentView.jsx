import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaDownload, FaEye, FaEdit, FaTrash, FaArrowLeft, FaUser, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { profileService } from '../services';

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await profileService.getDocument(id);
        
        if (response.data) {
          setDocument(response.data);
        } else {
          throw new Error('Không thể tải thông tin tài liệu');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err.message || 'Không thể tải thông tin tài liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  // Handle document download
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');
      
      // First try with download-info endpoint
      try {
        console.log(`Initiating download for document ${id}`);
        const downloadResult = await profileService.downloadDocument(id);
        
        if (downloadResult.success) {
          // Update download count in UI if successful
          if (document) {
            setDocument({
              ...document,
              download_count: (document.download_count || 0) + 1
            });
          }
          console.log('Download completed successfully');
        }
      } catch (downloadError) {
        console.error('Primary download method failed:', downloadError);
        
        // Try fallback method - direct browser download
        try {
          console.log('Attempting fallback download method');
          // Get document info first
          const docInfo = await profileService.getDocument(id);
          
          if (docInfo && docInfo.file_path) {
            // Try to construct a direct URL to the file
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';
            const fileUrl = `${baseUrl}storage/${docInfo.file_path}`.replace('/api/api/', '/api/');
            
            console.log(`Opening direct file URL: ${fileUrl}`);
            window.open(fileUrl, '_blank');
            
            // Update download count in UI
            if (document) {
              setDocument({
                ...document,
                download_count: (document.download_count || 0) + 1
              });
            }
          } else {
            throw new Error('Không thể xác định đường dẫn file');
          }
        } catch (fallbackError) {
          console.error('Fallback download method failed:', fallbackError);
          throw downloadError; // Throw the original error
        }
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      setError(err.message || 'Không thể tải xuống tài liệu. Vui lòng thử lại sau.');
    } finally {
      setDownloading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải thông tin tài liệu...</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Header />
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Không thể tải thông tin tài liệu</Alert.Heading>
            <p>{error}</p>
            <div className="d-flex justify-content-between">
              <Button variant="outline-primary" onClick={() => navigate('/unishare-files')}>
                <FaArrowLeft className="me-2" /> Quay lại trang chủ
              </Button>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  // Render document not found
  if (!document) {
    return (
      <>
        <Header />
        <Container className="py-5">
          <Alert variant="warning">
            <Alert.Heading>Không tìm thấy tài liệu</Alert.Heading>
            <p>Tài liệu này không tồn tại hoặc đã bị xóa.</p>
            <Button variant="primary" onClick={() => navigate('/unishare-files')}>
              <FaArrowLeft className="me-2" /> Quay lại trang chủ
            </Button>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-4">
        <Button 
          variant="outline-primary" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Quay lại
        </Button>
        
        <Row>
          {/* Document info */}
          <Col lg={8} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3>{document.title}</h3>
                    <div className="text-muted">
                      {document.subject && <span className="me-3">Môn học: {document.subject}</span>}
                      {document.course_code && <span>Mã môn: {document.course_code}</span>}
                    </div>
                  </div>
                  <div>
                    {document.is_approved ? (
                      <Badge bg="success" className="fs-6">Đã duyệt</Badge>
                    ) : (
                      <Badge bg="warning" text="dark" className="fs-6">Chờ duyệt</Badge>
                    )}
                    {document.is_official && (
                      <Badge bg="primary" className="ms-2 fs-6">Chính thức</Badge>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <h5>Mô tả</h5>
                  <p>{document.description || 'Không có mô tả'}</p>
                </div>
                
                {/* File details */}
                <div className="mb-4">
                  <h5>Thông tin file</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Tên file:</strong> {document.file_name}</p>
                      <p><strong>Loại file:</strong> {document.file_type}</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Kích thước:</strong> {
                          document.file_size ? (
                            (document.file_size / (1024 * 1024)).toFixed(2) + ' MB'
                          ) : 'N/A'
                        }
                      </p>
                      <p>
                        <strong>Ngày tải lên:</strong> {
                          new Date(document.created_at).toLocaleDateString('vi-VN')
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Document actions */}
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="me-3">
                      <FaEye className="me-1 text-primary" /> {document.view_count || 0} lượt xem
                    </span>
                    <span>
                      <FaDownload className="me-1 text-success" /> {document.download_count || 0} lượt tải
                    </span>
                  </div>
                  <div>
                    {error && <span className="text-danger me-3">{error}</span>}
                    
                    {document.user_id === parseInt(localStorage.getItem('user_id')) && (
                      <Button 
                        as={Link}
                        to={`/unishare-files/edit/${document.id}`}
                        variant="outline-primary" 
                        className="me-2"
                      >
                        <FaEdit className="me-1" /> Chỉnh sửa
                      </Button>
                    )}
                    
                    <Button 
                      variant="primary" 
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Đang tải xuống...
                        </>
                      ) : (
                        <>
                          <FaDownload className="me-2" /> Tải xuống
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* User and file preview */}
          <Col lg={4}>
            {/* Document uploader info */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5>Người đăng tải</h5>
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <FaUser className="text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 fw-bold">{document.user?.name || 'Người dùng'}</p>
                    <p className="text-muted mb-0">
                      <FaCalendarAlt className="me-1" /> Ngày đăng: {
                        new Date(document.created_at).toLocaleDateString('vi-VN')
                      }
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            {/* Document preview */}
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <div className="mb-3 p-5 bg-light rounded">
                  <FaFileAlt size={80} className="text-primary" />
                </div>
                <p className="mb-1">
                  <strong>Dung lượng:</strong> {
                    document.file_size ? (
                      (document.file_size / (1024 * 1024)).toFixed(2) + ' MB'
                    ) : 'N/A'
                  }
                </p>
                <p className="mb-3">
                  <strong>Định dạng:</strong> {document.file_type}
                </p>
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Đang tải xuống...
                    </>
                  ) : (
                    <>
                      <FaDownload className="me-2" /> Tải xuống
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Related documents could be added here */}
      </Container>
      <Footer />
    </>
  );
};

export default DocumentView;
