import React from 'react';
import { Table, Dropdown } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';

const ParticipationHistory = () => {
  const historyItems = [
    { id: 1, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
    { id: 2, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
    { id: 3, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
    { id: 4, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
    { id: 5, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
    { id: 6, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
    { id: 7, groupName: 'Học tập Toán cao cấp c1', instructor: 'Nguyễn Tuân', dateTime: 'Ngày 12/04/2025, 12h00' },
  ];

  return (
    <Table hover responsive className="participation-history-table">
      <thead>
        <tr>
          <th style={{ width: '45%' }}>Tên nhóm đã tham gia</th>
          <th style={{ width: '25%' }}>Giáo viên giảng dạy</th>
          <th style={{ width: '25%' }}>Ngày giờ</th>
          <th style={{ width: '5%' }}></th>
        </tr>
      </thead>
      <tbody>
        {historyItems.map((item) => (
          <tr key={item.id}>
            <td>{item.groupName}</td>
            <td>{item.instructor}</td>
            <td>{item.dateTime}</td>
            <td>
              <Dropdown align="end">
                <Dropdown.Toggle as="a" bsPrefix="p-0" style={{ cursor: 'pointer' }}>
                  <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-view">Xem chi tiết nhóm</Dropdown.Item>
                  <Dropdown.Item href="#/action-instructor">Xem thông tin giáo viên</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ParticipationHistory;
