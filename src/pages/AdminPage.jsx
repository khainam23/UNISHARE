import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/Layout';
import Dashboard from '../components/admin/Dashboard';
import { Container, Row, Col, Card, Button, Nav, Form } from 'react-bootstrap';
import DocumentPreview from '../components/admin/DocumentPreview';
import { FaStar } from 'react-icons/fa';
import { 
  FaUsers, 
  FaBook, 
  FaFileAlt, 
  FaShoppingCart,
  FaEnvelope,
  FaUserShield,
  FaUserGraduate
} from 'react-icons/fa';
import reactIcon from '../assets/react-icon.png';
import avatarPlaceholder from '../assets/avatar-1.png';

const AdminPage = () => {
  // Get tab from URL params and navigation function
  const { tab } = useParams();
  const navigate = useNavigate();
  
  // Default to 'dashboard' if no tab is specified
  const [activeTab, setActiveTab] = useState(tab || 'dashboard');
  const [permissionTab, setPermissionTab] = useState('teacher');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Giảng Viên');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Update activeTab when URL parameter changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab('dashboard');
    }
  }, [tab]);

  // Stats data
  const stats = [
    { title: 'Tổng người dùng', value: '1,856', icon: FaUsers, color: '#0370B7', bgColor: '#E6F3FB' },
    { title: 'Tài liệu đã duyệt', value: '245', icon: FaBook, color: '#28A745', bgColor: '#E8F9EF' },
    { title: 'Chờ duyệt', value: '35', icon: FaFileAlt, color: '#FFC107', bgColor: '#FFF8E6' },
    { title: 'Đơn hàng', value: '68', icon: FaShoppingCart, color: '#6F42C1', bgColor: '#F0E7FA' }
  ];

  // Users data
  const users = [
    { id: 1, name: 'Nguyễn Nhân Tính', role: 'Học sinh' },
    { id: 2, name: 'User 2', role: 'Học sinh' },
    { id: 3, name: 'User 3', role: 'Học sinh' },
    { id: 4, name: 'User 4', role: 'Giảng viên' },
    { id: 5, name: 'User 5', role: 'Học sinh' },
    { id: 6, name: 'User 6', role: 'Học sinh' },
    { id: 7, name: 'User 7', role: 'Giảng viên' },
    { id: 8, name: 'User 8', role: 'Học sinh' },
    { id: 9, name: 'User 9', role: 'Học sinh' },
    { id: 10, name: 'User 10', role: 'Học sinh' }
  ];

  // Messages data
  const messages = [
    {
      id: 1,
      title: 'Học React-JS cơ bản',
      content: 'Thông báo từ lớp học...',
      timestamp: '11/03/2023 9:26 PM',
    },
    {
      id: 2,
      title: 'Học React-JS cơ bản',
      content: 'Thông báo từ lớp học...',
      timestamp: '11/03/2023 9:26 PM',
    },
    {
      id: 3,
      title: 'Học React-JS cơ bản',
      content: 'Thông báo từ lớp học...',
      timestamp: '11/03/2023 9:26 PM',
    },
    {
      id: 4,
      title: 'Học React-JS cơ bản',
      content: 'Thông báo từ lớp học...',
      timestamp: '11/03/2023 9:26 PM',
    },
    {
      id: 5,
      title: 'Học React-JS cơ bản',
      content: 'Thông báo từ lớp học...',
      timestamp: '11/03/2023 9:26 PM',
    },
  ];

  // Permissions data
  const permissionUsers = [
    {
      id: 1,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'teacher'
    },
    {
      id: 2,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'teacher'
    },
    {
      id: 3,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'teacher'
    },
    {
      id: 4,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'teacher'
    },
    {
      id: 5,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'teacher'
    },
    {
      id: 6,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'teacher'
    },
    {
      id: 7,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'student'
    },
    {
      id: 8,
      name: 'Nguyễn Đình Mẫn',
      role: 'Co sở dữ liệu',
      photo: avatarPlaceholder,
      type: 'student'
    },
  ];
  
  // Reports data
  const reports = [
    {
      id: 1,
      document: 'Toán cao cấp c2',
      content: 'Nội dung tài liệu chưa được chính xác',
      reporterEmail: 'nnnttt223344@gmail.com'
    },
    {
      id: 2,
      document: 'Toán cao cấp c2',
      content: 'Nội dung tài liệu chưa được chính xác',
      reporterEmail: 'nnnttt223344@gmail.com'
    },
    {
      id: 3,
      document: 'Toán cao cấp c2',
      content: 'Nội dung tài liệu chưa được chính xác',
      reporterEmail: 'nnnttt223344@gmail.com'
    },
    {
      id: 4,
      document: 'Toán cao cấp c2',
      content: 'Nội dung tài liệu chưa được chính xác',
      reporterEmail: 'nnnttt223344@gmail.com'
    },
    {
      id: 5,
      document: 'Toán cao cấp c2',
      content: 'Nội dung tài liệu chưa được chính xác',
      reporterEmail: 'nnnttt223344@gmail.com'
    },
  ];

  // Teachers data
  const teachers = [
    { id: 1, name: 'Nguyễn Văn Nam', rating: '5.0/5.0', image: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Nguyễn Thái Văn', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=12' },
    { id: 3, name: 'Nguyễn Thái Nhân', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=13' },
    { id: 4, name: 'Nguyễn Văn Minh', rating: '4.7/5.0', image: 'https://i.pravatar.cc/150?img=14' }
  ];

  // Filter users based on permission tab
  const filteredPermissionUsers = permissionUsers.filter(user => user.type === permissionTab);

  // Permission handlers
  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.type === 'teacher' ? 'Giảng Viên' : 'Sinh Viên');
    setIsEditMode(true);
  };
  
  const handleSavePermissions = () => {
    // Save logic would go here
    setIsEditMode(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedUser(null);
  };

  // Report handlers
  const handleInspect = (report) => {
    setSelectedReport(report);
    setShowDocumentPreview(true);
  };

  const handleDelete = (id) => {
    console.log(`Deleting report ${id}`);
  };

  const handleClosePreview = () => {
    setShowDocumentPreview(false);
    setSelectedReport(null);
  };

  const handleDeleteDocument = () => {
    console.log(`Deleting document for report ${selectedReport?.id}`);
    setShowDocumentPreview(false);
    setSelectedReport(null);
  };

  // Function to handle tab changes with navigation
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/admin/${tabName}`);
  };

  // If showing document preview from Reports
  if (showDocumentPreview) {
    return (
      <DocumentPreview 
        report={selectedReport} 
        onClose={handleClosePreview}
        onDelete={handleDeleteDocument}
      />
    );
  }

  // If in permission edit mode
  if (isEditMode) {
    return (
      <AdminLayout>
        <div className="container-fluid px-0" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-4 fw-normal">Quản Lý Phân Quyền / Chỉnh sửa Quyền</h5>
              
              <div className="permission-form">
                <div className="mb-4">
                  <div className="fw-medium mb-2">1. Quyền Với Vai Trò Người Dùng:</div>
                  <div className="role-selector">
                    <Form.Select 
                      className="form-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      style={{ 
                        width: '100%',
                        maxWidth: '260px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="Giảng Viên">Giảng Viên</option>
                      <option value="Sinh Viên">Sinh Viên</option>
                    </Form.Select>
                  </div>
                </div>
                
                <div className="d-flex mt-5">
                  <Button 
                    variant="light" 
                    className="me-2 border"
                    onClick={handleCancelEdit}
                    style={{ 
                      width: '120px',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: '#f8f9fa',
                      borderColor: '#dee2e6'
                    }}
                  >
                    Thoát
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleSavePermissions}
                    style={{ 
                      width: '120px',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: '#253B80',
                      borderColor: '#253B80'
                    }}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Title */}
      <div className="mb-4">
        <h4 className="mb-0 fw-bold">Dashboard</h4>
      </div>
      
      {/* Tab Navigation */}
      <Nav className="mb-4" variant="tabs">
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => handleTabChange('dashboard')}
            style={{ 
              color: activeTab === 'dashboard' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => handleTabChange('users')}
            style={{ 
              color: activeTab === 'users' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Quản Lý Người Dùng
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => handleTabChange('messages')}
            style={{ 
              color: activeTab === 'messages' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Tin Nhắn
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'permissions' ? 'active' : ''}
            onClick={() => handleTabChange('permissions')}
            style={{ 
              color: activeTab === 'permissions' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Quản Lý Phân Quyền
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => handleTabChange('reports')}
            style={{ 
              color: activeTab === 'reports' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Quản Lý Báo Cáo
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      {/* Dashboard Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <Dashboard />
          
          {/* Statistics Cards */}
          <Row className="mb-4">
            {stats.map((stat, index) => (
              <Col md={3} sm={6} className="mb-3" key={index}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex align-items-center">
                    <div
                      style={{
                        backgroundColor: stat.bgColor,
                        color: stat.color,
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px'
                      }}
                    >
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: '14px' }}>
                        {stat.title}
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: '600' }}>
                        {stat.value}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {/* Charts Section - Simple placeholders */}
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Traffic</h5>
                    <Button variant="outline-secondary" size="sm" style={{ fontSize: '12px' }}>View Report</Button>
                  </div>
                  <div className="text-center py-5 bg-light rounded">
                    <p className="mb-0">Traffic chart will appear here after loading Chart.js</p>
                    <small className="text-muted">You may need to install chart.js and react-chartjs-2</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Order Time</h5>
                    <Button variant="outline-secondary" size="sm" style={{ fontSize: '12px' }}>View Report</Button>
                  </div>
                  <div className="text-center py-5 bg-light rounded">
                    <p className="mb-0">Order time chart will appear here</p>
                    <small className="text-muted">Doughnut chart loads after Chart.js</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Bottom Charts & Tables */}
          <Row className="mb-4">
            <Col lg={4} className="mb-4 mb-lg-0">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="card-title mb-4">Your Rating</h5>
                  <div className="text-center py-4">
                    <div className="mb-3" style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF8B00' }}>85%</div>
                    <p className="mb-0">Your Average Rating</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} className="mb-4 mb-lg-0">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="card-title mb-4">Favorite Teacher</h5>
                  {teachers.slice(0, 2).map((teacher) => (
                    <div key={teacher.id} className="d-flex align-items-center mb-3">
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '12px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{teacher.name}</div>
                        <div className="d-flex align-items-center">
                          <FaStar style={{ color: '#FFC107', fontSize: '12px', marginRight: '4px' }} />
                          <span style={{ fontSize: '12px', color: '#6C757D' }}>{teacher.rating}</span>
                        </div>
                      </div>
                      <span className="badge rounded-pill bg-light text-dark" style={{ fontSize: '10px' }}>
                        {teacher.id === 1 ? '5.0/5.0' : teacher.rating}
                      </span>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Order</h5>
                    <Button variant="outline-secondary" size="sm" style={{ fontSize: '12px' }}>View Report</Button>
                  </div>
                  <div className="text-center py-4 bg-light rounded">
                    <p className="mb-0">Order trend chart will appear here</p>
                    <small className="text-muted">Line chart loads after Chart.js</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Latest Transactions Section */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Latest Transactions</h5>
                <Button variant="outline-primary" size="sm">View All</Button>
              </div>
              
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{fontSize: '14px'}}>Transaction ID</th>
                      <th scope="col" style={{fontSize: '14px'}}>Customer</th>
                      <th scope="col" style={{fontSize: '14px'}}>Date</th>
                      <th scope="col" style={{fontSize: '14px'}}>Amount</th>
                      <th scope="col" style={{fontSize: '14px'}}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#TRN-0123</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0', marginRight: '8px'}}></div>
                          <span>Nguyễn Văn A</span>
                        </div>
                      </td>
                      <td>25 Jun 2023</td>
                      <td>250.000đ</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#TRN-0124</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0', marginRight: '8px'}}></div>
                          <span>Trần Thị B</span>
                        </div>
                      </td>
                      <td>25 Jun 2023</td>
                      <td>120.000đ</td>
                      <td><span className="badge bg-warning text-dark">Pending</span></td>
                    </tr>
                    <tr>
                      <td>#TRN-0125</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0', marginRight: '8px'}}></div>
                          <span>Lê Văn C</span>
                        </div>
                      </td>
                      <td>24 Jun 2023</td>
                      <td>350.000đ</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <>
          <div className="mb-4">
            <h5 className="mb-0 fw-bold">Quản Lý Người Dùng</h5>
          </div>

          <Card className="border-0 rounded-3">
            <Card.Body className="p-0">
              <table className="table mb-0">
                <thead>
                  <tr style={{ backgroundColor: '#e9ecef' }}>
                    <th 
                      className="py-3 px-4"
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: '500',
                        borderBottom: 'none'
                      }}
                    >
                      Người dùng
                    </th>
                    <th 
                      className="py-3 px-4"
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: '500',
                        borderBottom: 'none'
                      }}
                    >
                      Quyền Hạn
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ backgroundColor: '#f2f2f2' }}>
                      <td 
                        className="py-3 px-4"
                        style={{ 
                          fontSize: '14px',
                          borderTop: '1px solid #e9ecef',
                          borderBottom: 'none'
                        }}
                      >
                        {user.name}
                      </td>
                      <td 
                        className="py-3 px-4"
                        style={{ 
                          fontSize: '14px',
                          borderTop: '1px solid #e9ecef',
                          borderBottom: 'none'
                        }}
                      >
                        {user.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Messages Tab Content */}
      {activeTab === 'messages' && (
        <>
          <div className="mb-4">
            <h5 className="mb-0 fw-bold">Tin Nhắn</h5>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <div className="m-3 mb-4">
                <Form>
                  <Form.Group className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="rounded-pill py-2 ps-4"
                      style={{ backgroundColor: '#f8f9fa', border: '1px solid #f0f0f0' }}
                    />
                    <div className="position-absolute" style={{ right: '15px', top: '10px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                          stroke="#888888"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 21L16.65 16.65"
                          stroke="#888888"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Form.Group>
                </Form>
              </div>

              <div className="message-list">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className="message-item d-flex align-items-start p-3 border-top"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="message-icon me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '48px', height: '48px', overflow: 'hidden', backgroundColor: '#f0f8ff' }}
                      >
                        <img 
                          src={reactIcon} 
                          alt="React" 
                          style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
                        />
                      </div>
                    </div>
                    <div className="message-content flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{message.title}</h6>
                        <span className="text-muted" style={{ fontSize: '12px' }}>{message.timestamp}</span>
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Permissions Tab Content */}
      {activeTab === 'permissions' && (
        <Card className="border-0 rounded-4 p-0">
          <Card.Body className="p-4">
            <h5 className="mb-4">Quản Lý Phân Quyền</h5>
            
            {/* Tab Navigation */}
            <div className="d-flex mb-4">
              <Button
                variant={permissionTab === 'teacher' ? 'primary' : 'light'}
                className={`me-2 rounded-pill px-4 ${permissionTab !== 'teacher' && 'border'}`}
                onClick={() => setPermissionTab('teacher')}
                style={{
                  backgroundColor: permissionTab === 'teacher' ? '#253B80' : 'white',
                  borderColor: permissionTab !== 'teacher' ? '#dee2e6' : '#253B80',
                  fontSize: '14px'
                }}
              >
                Giảng Viên
              </Button>
              <Button
                variant={permissionTab === 'student' ? 'primary' : 'light'}
                className={`rounded-pill px-4 ${permissionTab !== 'student' && 'border'}`}
                onClick={() => setPermissionTab('student')}
                style={{
                  backgroundColor: permissionTab === 'student' ? '#253B80' : 'white',
                  borderColor: permissionTab !== 'student' ? '#dee2e6' : '#253B80',
                  fontSize: '14px'
                }}
              >
                Sinh viên
              </Button>
            </div>
            
            {/* User list */}
            <div className="user-list">
              {filteredPermissionUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="user-item mb-3 p-3 rounded-3 d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: '#f8f9fa' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="user-photo me-3">
                      <img 
                        src={user.photo}
                        alt={user.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div className="fw-medium" style={{ fontSize: '14px' }}>{user.name}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>Nhóm quyền: {user.role}</div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <Button 
                      variant="light" 
                      className="me-2 border" 
                      size="sm"
                      onClick={() => handleEditPermissions(user)}
                      style={{ fontSize: '12px' }}
                    >
                      Chỉnh sửa quyền
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      style={{ backgroundColor: '#253B80', fontSize: '12px' }}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Reports Tab Content */}
      {activeTab === 'reports' && (
        <Card className="border-0 rounded-4 p-3">
          <Card.Body>
            <h5 className="mb-4">Quản Lý Báo Cáo</h5>
            
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr className="bg-light">
                    <th 
                      style={{ 
                        padding: '15px', 
                        fontSize: '16px', 
                        fontWeight: 'normal',
                        borderRight: '1px solid #dee2e6',
                        backgroundColor: '#e9ecef'
                      }}
                    >
                      Tài Liệu
                    </th>
                    <th 
                      style={{ 
                        padding: '15px', 
                        fontSize: '16px', 
                        fontWeight: 'normal',
                        borderRight: '1px solid #dee2e6',
                        backgroundColor: '#e9ecef'
                      }}
                    >
                      Nội Dung Báo Cáo
                    </th>
                    <th 
                      style={{ 
                        padding: '15px', 
                        fontSize: '16px', 
                        fontWeight: 'normal',
                        borderRight: '1px solid #dee2e6',
                        backgroundColor: '#e9ecef'
                      }}
                    >
                      Tài khoản báo cáo
                    </th>
                    <th 
                      style={{ 
                        padding: '15px', 
                        fontSize: '16px', 
                        fontWeight: 'normal',
                        backgroundColor: '#e9ecef'
                      }}
                    >
                      Đánh Giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td 
                        style={{ 
                          padding: '15px', 
                          fontSize: '14px', 
                          borderRight: '1px solid #dee2e6' 
                        }}
                      >
                        {report.document}
                      </td>
                      <td 
                        style={{ 
                          padding: '15px', 
                          fontSize: '14px', 
                          borderRight: '1px solid #dee2e6' 
                        }}
                      >
                        {report.content}
                      </td>
                      <td 
                        style={{ 
                          padding: '15px', 
                          fontSize: '14px', 
                          borderRight: '1px solid #dee2e6' 
                        }}
                      >
                        {report.reporterEmail}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="light" 
                            size="sm"
                            className="border" 
                            style={{ 
                              borderRadius: '4px',
                              padding: '4px 12px',
                              fontSize: '14px',
                              backgroundColor: '#f8f9fa'
                            }}
                            onClick={() => handleInspect(report)}
                          >
                            Kiểm tra
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            style={{ 
                              borderRadius: '4px',
                              padding: '4px 12px',
                              fontSize: '14px',
                              backgroundColor: '#253B80'
                            }}
                            onClick={() => handleDelete(report.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminPage;
