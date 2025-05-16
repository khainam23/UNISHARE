import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const EditProfileInfoForm = () => {
  return (
    <Form>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="formGridHo">
          <Form.Label>Họ</Form.Label>
          <Form.Control type="text" defaultValue="Nguyễn" />
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="formGridTenDem">
          <Form.Label>Tên đệm</Form.Label>
          <Form.Control type="text" defaultValue="Văn" />
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="formGridTen">
          <Form.Label>Tên</Form.Label>
          <Form.Control type="text" defaultValue="A" />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="formGridNgaySinh">
          <Form.Label>Ngày sinh</Form.Label>
          <Form.Control type="text" defaultValue="21 / 12 / 2003" placeholder="DD / MM / YYYY" />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="formGridGioiTinh">
          <Form.Label>Giới tính</Form.Label>
          <Form.Select defaultValue="Nam">
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridSoDienThoai">
        <Form.Label>Số điện thoại</Form.Label>
        <Form.Control type="tel" defaultValue="0917639460" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridDiaChi">
        <Form.Label>Địa chỉ</Form.Label>
        <Form.Control type="text" defaultValue="216 Núi Thành, Phường Hòa Cường Bắc, Quận Hải Châu, Thành phố Đà Nẵng" />
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="formGridTPQuanHuyen">
          <Form.Label>TP / Quận / Huyện</Form.Label>
          <Form.Control type="text" defaultValue="216 Núi Thành" />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="formGridTinhThanhPho">
          <Form.Label>Tỉnh / Thành Phố</Form.Label>
          <Form.Control type="text" defaultValue="Đà Nẵng" />
        </Form.Group>
      </Row>

      <div className="text-center"> {/* Centering the button */}
        <Button variant="primary" type="submit" className="px-5 py-2">
          Lưu lại thay đổi
        </Button>
      </div>
    </Form>
  );
};

export default EditProfileInfoForm;
