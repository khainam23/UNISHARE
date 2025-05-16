import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ChangePasswordForm = () => {
  return (
    <Form>
      <Form.Group as={Row} className="mb-3" controlId="currentPassword">
        <Form.Label column sm={4} className="text-md-end">
          Mật khẩu hiện tại
        </Form.Label>
        <Col sm={8}>
          <Form.Control type="password" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="newPassword">
        <Form.Label column sm={4} className="text-md-end">
          Mật khẩu mới
        </Form.Label>
        <Col sm={8}>
          <Form.Control type="password" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-4" controlId="confirmNewPassword">
        <Form.Label column sm={4} className="text-md-end">
          Xác nhận mật khẩu
        </Form.Label>
        <Col sm={8}>
          <Form.Control type="password" />
        </Col>
      </Form.Group>

      <Row>
        <Col sm={{ span: 8, offset: 4 }}>
          <Button variant="primary" type="submit" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
            Đổi mật khẩu
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ChangePasswordForm;
