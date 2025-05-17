import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { profileService } from '../services';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await profileService.getProfile();
        setProfileData(data.user);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <div className="text-center my-5">Đang tải thông tin...</div>;
  if (error) return <div className="text-center my-5 text-danger">{error}</div>;
  if (!profileData) return <div className="text-center my-5">Không tìm thấy thông tin hồ sơ</div>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Hồ Sơ Người Dùng</h4>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <h3>{profileData.name}</h3>
                <p className="text-muted">
                  {profileData.roles && profileData.roles.length > 0 
                    ? profileData.roles[0].name.charAt(0).toUpperCase() + profileData.roles[0].name.slice(1) 
                    : 'Người dùng'}
                </p>
              </div>

              <Table bordered hover>
                <tbody>
                  <tr>
                    <td width="30%"><strong>Email:</strong></td>
                    <td>{profileData.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Số điện thoại:</strong></td>
                    <td>{profileData.phone || 'Chưa cập nhật'}</td>
                  </tr>
                  {profileData.student_id && (
                    <tr>
                      <td><strong>Mã sinh viên:</strong></td>
                      <td>{profileData.student_id}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>Trường đại học:</strong></td>
                    <td>{profileData.university || 'Chưa cập nhật'}</td>
                  </tr>
                  <tr>
                    <td><strong>Ngành học:</strong></td>
                    <td>{profileData.department || 'Chưa cập nhật'}</td>
                  </tr>
                  <tr>
                    <td><strong>Giới thiệu:</strong></td>
                    <td>{profileData.bio || 'Chưa cập nhật'}</td>
                  </tr>
                  {/* Removed the "Ảnh đại diện" row that was here */}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
