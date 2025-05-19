import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/Layout';
import Dashboard from '../components/admin/Dashboard';
import { Container, Row, Col, Card, Button, Nav, Form, Spinner, Alert } from 'react-bootstrap';
import DocumentPreview from '../components/admin/DocumentPreview';
import StatisticsCards from '../components/admin/StatisticsCards';
import UserManagement from '../components/admin/UserManagement';
import PermissionsManager from '../components/admin/PermissionsManager';
import TrafficChart from '../components/admin/TrafficChart';
import OrderTimeCard from '../components/admin/OrderTimeCard';
import OrderTrendCard from '../components/admin/OrderTrendCard';
import UserRatingCard from '../components/admin/UserRatingCard';
import FavoriteTeacherCard from '../components/admin/FavoriteTeacherCard';
import DocumentsManagement from '../components/admin/DocumentsManagement';
import GroupManagement from '../components/admin/GroupManagement';
import { 
  FaStar, 
  FaUsers, 
  FaBook, 
  FaFileAlt, 
  FaShoppingCart 
} from 'react-icons/fa';
import reactIcon from '../assets/react-icon.png';
import avatarPlaceholder from '../assets/avatar-1.png';
import { adminService } from '../services';

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
  
  // Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Add state for API data
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [permissionUsers, setPermissionUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  // Use refs to track if API calls are already in progress
  const loadingRef = useRef({
    dashboard: false,
    users: false,
    messages: false,
    permissions: false,
    reports: false,
    teachers: false
  });

  // Update activeTab when URL parameter changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab('dashboard');
    }
  }, [tab]);

  // Fetch dashboard stats when dashboard tab is active
  useEffect(() => {
    if (activeTab === 'dashboard' && !loadingRef.current.dashboard) {
      fetchDashboardStats();
    }
  }, [activeTab]);
  
  // Fetch users when users tab is active
  useEffect(() => {
    if (activeTab === 'users' && !loadingRef.current.users) {
      fetchUsers();
    }
  }, [activeTab]);
  
  // Fetch messages when messages tab is active
  useEffect(() => {
    if (activeTab === 'messages' && !loadingRef.current.messages) {
      fetchMessages();
    }
  }, [activeTab]);
  
  // Fetch permission users when permissions tab is active
  useEffect(() => {
    if (activeTab === 'permissions' && !loadingRef.current.permissions) {
      fetchPermissionUsers();
    }
  }, [activeTab, permissionTab]);
  
  // Fetch reports when reports tab is active
  useEffect(() => {
    if (activeTab === 'reports' && !loadingRef.current.reports) {
      fetchReports();
    }
  }, [activeTab]);
  
  // Fetch favorite teachers for dashboard
  useEffect(() => {
    if (activeTab === 'dashboard' && !loadingRef.current.teachers) {
      fetchTeachers();
    }
  }, [activeTab]);
  
  // API fetch functions
  const fetchDashboardStats = async () => {
    // Skip if already loading
    if (loadingRef.current.dashboard || loading) return;
    
    setLoading(true);
    loadingRef.current.dashboard = true;
    setError('');
    
    try {
      const data = await adminService.getDashboardStats();
      
      // Transform the data into the format our component expects
      const formattedStats = [
        { 
          title: 'Tổng người dùng', 
          value: data.users?.total.toLocaleString() || '0', 
          icon: FaUsers, 
          color: '#0370B7', 
          bgColor: '#E6F3FB' 
        },
        { 
          title: 'Tài liệu đã duyệt', 
          value: data.content?.documents?.approved.toLocaleString() || '0', 
          icon: FaBook, 
          color: '#28A745', 
          bgColor: '#E8F9EF' 
        },
        { 
          title: 'Chờ duyệt', 
          value: data.reports?.pending.toLocaleString() || '0', 
          icon: FaFileAlt, 
          color: '#FFC107', 
          bgColor: '#FFF8E6' 
        },
        { 
          title: 'Đơn hàng', 
          value: data.orders?.total.toLocaleString() || '0', 
          icon: FaShoppingCart, 
          color: '#6F42C1', 
          bgColor: '#F0E7FA' 
        }
      ];
      
      setStats(formattedStats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard statistics. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current.dashboard = false;
    }
  };
  
  const fetchUsers = useCallback(async () => {
    if (loadingRef.current.users || loading) return;
    
    setLoading(true);
    loadingRef.current.users = true;
    setError('');
    
    try {
      const response = await adminService.getUsers();
      
      // Format users data for our component
      const formattedUsers = response.data?.data?.map(user => ({
        id: user.id,
        name: user.name,
        role: user.roles?.[0]?.name === 'admin' ? 'Admin' : 
              user.roles?.[0]?.name === 'moderator' ? 'Người kiểm duyệt' :
              user.roles?.[0]?.name === 'lecturer' ? 'Giảng viên' : 'Học sinh'
      })) || [];
      
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current.users = false;
    }
  }, []);
  
  const fetchMessages = useCallback(async () => {
    if (loadingRef.current.messages || loading) return;
    
    setLoading(true);
    loadingRef.current.messages = true;
    setError('');
    
    try {
      const response = await adminService.getMessages();
      
      // For now, we'll keep using mock data for messages
      // In a real implementation, you'd format the API response
      setMessages([
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
      ]);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages data. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current.messages = false;
    }
  }, []);
  
  const fetchPermissionUsers = useCallback(async () => {
    if (loadingRef.current.permissions || loading) return;
    
    setLoading(true);
    loadingRef.current.permissions = true;
    setError('');
    
    try {
      const rolesToFetch = permissionTab === 'teacher' ? ['lecturer'] : ['student'];
      const response = await adminService.getUsers({ role: rolesToFetch.join(',') });
      
      // Format users data for permissions tab
      const formattedUsers = response.data?.data?.map(user => ({
        id: user.id,
        name: user.name,
        role: user.department || 'Không có thông tin',
        photo: user.avatar || avatarPlaceholder,
        type: permissionTab
      })) || [];
      
      setPermissionUsers(formattedUsers);
    } catch (err) {
      console.error('Failed to fetch permission users:', err);
      setError('Failed to load user permissions data. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current.permissions = false;
    }
  }, [permissionTab]);
  
  const fetchReports = useCallback(async () => {
    if (loadingRef.current.reports || loading) return;
    
    setLoading(true);
    loadingRef.current.reports = true;
    setError('');
    
    try {
      const response = await adminService.getReports();
      
      // Format reports data for our component
      const formattedReports = response.data?.map(report => ({
        id: report.id,
        document: report.reportable_type === 'App\\Models\\Document' ? 
          report.reportable?.title || 'Tài liệu đã bị xóa' : 
          'Nội dung khác',
        content: report.reason || 'Không có lý do cụ thể',
        reporterEmail: report.reporter?.email || 'Không xác định'
      })) || [];
      
      setReports(formattedReports);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports data. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current.reports = false;
    }
  }, []);
  
  const fetchTeachers = useCallback(async () => {
    if (loadingRef.current.teachers || loading) return;
    
    setLoading(true);
    loadingRef.current.teachers = true;
    
    try {
      const response = await adminService.getTeachers({ sort: 'rating', limit: 4 });
      
      // Format teachers data for our component
      const formattedTeachers = response.data?.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        rating: teacher.rating?.toFixed(1) + '/5.0' || '4.5/5.0',
        image: teacher.avatar || `https://i.pravatar.cc/150?img=${10 + teacher.id % 10}`
      })) || [];
      
      if (formattedTeachers.length > 0) {
        setTeachers(formattedTeachers);
      } else {
        // Fallback to mock data if no teachers found
        setTeachers([
          { id: 1, name: 'Nguyễn Văn Nam', rating: '5.0/5.0', image: 'https://i.pravatar.cc/150?img=11' },
          { id: 2, name: 'Nguyễn Thái Văn', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=12' },
          { id: 3, name: 'Nguyễn Thái Nhân', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=13' },
          { id: 4, name: 'Nguyễn Văn Minh', rating: '4.7/5.0', image: 'https://i.pravatar.cc/150?img=14' }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      // Fallback to mock data if API fails
      setTeachers([
        { id: 1, name: 'Nguyễn Văn Nam', rating: '5.0/5.0', image: 'https://i.pravatar.cc/150?img=11' },
        { id: 2, name: 'Nguyễn Thái Văn', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=12' },
        { id: 3, name: 'Nguyễn Thái Nhân', rating: '4.8/5.0', image: 'https://i.pravatar.cc/150?img=13' },
        { id: 4, name: 'Nguyễn Văn Minh', rating: '4.7/5.0', image: 'https://i.pravatar.cc/150?img=14' }
      ]);
    } finally {
      setLoading(false);
      loadingRef.current.teachers = false;
    }
  }, []);

  // Filter users based on permission tab
  const filteredPermissionUsers = permissionUsers.filter(user => user.type === permissionTab);

  // Permission handlers
  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.type === 'teacher' ? 'Giảng Viên' : 'Sinh Viên');
    setIsEditMode(true);
  };
  
  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Convert displayed role to backend role value
      const roleValue = selectedRole === 'Giảng Viên' ? 'lecturer' : 
                         selectedRole === 'Sinh Viên' ? 'student' : 
                         selectedRole === 'Quản trị viên' ? 'admin' : 'student';
      
      await adminService.updateUserRole(selectedUser.id, roleValue);
      
      // Refresh the user list after update
      fetchPermissionUsers();
      setIsEditMode(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update permissions:', err);
      setError('Failed to update permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedUser(null);
  };

  // Report handlers
  const handleInspect = async (report) => {
    setLoading(true);
    setError('');
    
    try {
      const reportDetails = await adminService.getReportDetails(report.id);
      setSelectedReport({
        ...report,
        details: reportDetails
      });
      setShowDocumentPreview(true);
    } catch (err) {
      console.error('Failed to fetch report details:', err);
      setError('Failed to load report details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await adminService.resolveReport(id, 'reject', 'Report rejected by admin');
      // Refresh reports list
      fetchReports();
    } catch (err) {
      console.error('Failed to delete report:', err);
      setError('Failed to delete report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowDocumentPreview(false);
    setSelectedReport(null);
  };

  const handleDeleteDocument = async () => {
    if (!selectedReport || !selectedReport.details?.reportable?.id) {
      setShowDocumentPreview(false);
      setSelectedReport(null);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Delete the document
      await adminService.deleteDocument(
        selectedReport.details.reportable.id,
        'Deleted due to report: ' + selectedReport.content
      );
      
      // Mark report as resolved
      await adminService.resolveReport(
        selectedReport.id,
        'resolve',
        'Document deleted due to valid report'
      );
      
      // Refresh reports list and close preview
      fetchReports();
      setShowDocumentPreview(false);
      setSelectedReport(null);
    } catch (err) {
      console.error('Failed to delete document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setLoading(false);
    }
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
        loading={loading}
        error={error}
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
              
              {error && <Alert variant="danger">{error}</Alert>}
              
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
                      disabled={loading}
                    >
                      <option value="Giảng Viên">Giảng Viên</option>
                      <option value="Sinh Viên">Sinh Viên</option>
                      <option value="Quản trị viên">Quản trị viên</option>
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" animation="border" /> : 'Cập nhật'}
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
      
      {/* Error display */}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
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
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'documents' ? 'active' : ''}
            onClick={() => handleTabChange('documents')}
            style={{ 
              color: activeTab === 'documents' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Quản Lý Tài Liệu
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            className={activeTab === 'groups' ? 'active' : ''}
            onClick={() => handleTabChange('groups')}
            style={{ 
              color: activeTab === 'groups' ? '#0370B7' : '#6c757d',
              cursor: 'pointer'
            }}
          >
            Quản Lý Nhóm
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
      )}
      
      {/* Dashboard Tab Content */}
      {!loading && activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <Dashboard />
          
          {/* Statistics Cards */}
          <StatisticsCards stats={stats} />
          
          {/* Charts Section */}
          <Row>
            <Col lg={8} className="mb-4">
              <TrafficChart />
            </Col>
            <Col lg={4} className="mb-4">
              <OrderTimeCard />
            </Col>
          </Row>
          
          {/* Bottom Charts & Tables */}
          <Row className="mb-4">
            <Col lg={4} className="mb-4 mb-lg-0">
              <UserRatingCard />
            </Col>
            <Col lg={4} className="mb-4 mb-lg-0">
              <FavoriteTeacherCard teachers={teachers} />
            </Col>
            <Col lg={4}>
              <OrderTrendCard />
            </Col>
          </Row>
        </>
      )}

      {/* Users Tab Content */}
      {!loading && activeTab === 'users' && (
        <UserManagement />
      )}

      {/* Messages Tab Content */}
      {!loading && activeTab === 'messages' && (
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
      {!loading && activeTab === 'permissions' && (
        <PermissionsManager />
      )}

      {/* Reports Tab Content */}
      {!loading && activeTab === 'reports' && (
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

      {/* Documents Tab Content */}
      {!loading && activeTab === 'documents' && (
        <DocumentsManagement />
      )}

      {/* Groups Tab Content */}
      {!loading && activeTab === 'groups' && (
        <GroupManagement />
      )}
    </AdminLayout>
  );
};

export default AdminPage;
