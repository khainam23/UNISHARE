import React, { useState } from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import userAvatar from '../../assets/avatar-1.png';

const UnishareCreateCourseForm = () => {
  const [formData, setFormData] = useState({
    courseImage: null,
    title: '',
    startDate: '',
    endDate: '',
    memberCount: '',
    members: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, courseImage: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Implement API call to create course
  };

  return (
    <div className="bg-white rounded shadow p-4" style={{ border: '2px solid #b3d8f6', borderRadius: '1rem' }}>
      <h4 className="text-primary mb-4 fw-bold">Tạo nhóm học</h4>
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            {/* Left side form */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">1. Ảnh nhóm:</Form.Label>
              <div className="d-flex align-items-center mb-2">
                <Image 
                  src={formData.courseImage || userAvatar} 
                  alt="Course thumbnail" 
                  style={{ 
                    width: 100, 
                    height: 100, 
                    objectFit: 'cover', 
                    borderRadius: '50%',
                    border: '2px solid #b3d8f6',
                  }}
                />
                <div className="ms-3">
                  <p className="text-muted mb-1">Chọn đăng Png, Jpg</p>
                  <div>
                    <Form.Control 
                      type="file" 
                      id="courseImage" 
                      onChange={handleImageChange}
                      hidden
                    />
                    <label 
                      htmlFor="courseImage" 
                      className="btn btn-outline-primary"
                      style={{
                        fontSize: '0.9rem',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '0.5rem'
                      }}
                    >
                      <BsUpload className="me-2" />
                      Tải lên
                    </label>
                  </div>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">2. Tên nhóm:</Form.Label>
              <Form.Control 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Tên nhóm - Mô tả sơ lược..."
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">3. Giảng viên giảng dạy:</Form.Label>
              <Form.Control 
                type="text" 
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="Họ và tên - Nguyễn Đức Mẫn"
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">4. Mô tả:</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết nhóm..."
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            {/* Right side form */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">5. Ngày bắt đầu:</Form.Label>
              <Form.Control 
                type="date" 
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">6. Ngày kết thúc:</Form.Label>
              <Form.Control 
                type="date" 
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">7. Số lượng viên:</Form.Label>
              <Form.Control 
                type="number" 
                name="memberCount"
                value={formData.memberCount}
                onChange={handleChange}
                placeholder="30"
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">8. Thành viên:</Form.Label>
              <Form.Select 
                name="members"
                value={formData.members}
                onChange={handleChange}
                style={{ borderRadius: '0.5rem', padding: '0.6rem 1rem' }}
              >
                <option value="">Chọn thành viên</option>
                <option value="students">Sinh viên</option>
                <option value="teachers">Giảng viên</option>
                <option value="all">Tất cả</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button variant="secondary" className="px-4" style={{ borderRadius: '0.5rem' }}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="px-4" 
                style={{ 
                  background: 'linear-gradient(90deg, #0370b7 60%, #4fc3f7 100%)',
                  borderRadius: '0.5rem',
                  border: 'none'
                }}
              >
                Tạo nhóm
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UnishareCreateCourseForm;
