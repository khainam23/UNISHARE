import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {
  BsPersonCircle, BsCalendarEvent, BsTelephone, BsEnvelope,
  BsGeoAlt, BsGenderAmbiguous, BsBriefcase
} from 'react-icons/bs';

const ProfileForm = () => {
  return (
    <Form>
      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Tên</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsPersonCircle /></span>
            <Form.Control type="text" defaultValue="Nguyễn Văn A" />
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Ngày Sinh</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsCalendarEvent /></span>
            <Form.Control type="text" defaultValue="21/12/2003" />
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Số Điện Thoại</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsTelephone /></span>
            <Form.Control type="tel" defaultValue="0917639460" readOnly /> {/* Corrected default value */}
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Email</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsEnvelope /></span>
            <Form.Control type="email" defaultValue="nnnttt223344@gmail.com" readOnly />
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Địa Chỉ</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsGeoAlt /></span>
            <Form.Control type="text" defaultValue="216 Núi Thành, Phường Hòa Cường Bắc, Quận Hải Châu, Thành Phố Đà Nẵng." />
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Giới Tính</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsGenderAmbiguous /></span>
            <Form.Select defaultValue="Nam">
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </Form.Select>
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm={3} className="text-muted">Vai Trò</Form.Label>
        <Col sm={9}>
          <div className="input-group">
            <span className="input-group-text"><BsBriefcase /></span>
            <Form.Control type="text" defaultValue="Học Viên" readOnly />
          </div>
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3 px-4">
        Cập nhật hồ sơ
      </Button>
    </Form>
  );
};

export default ProfileForm;
