import React from 'react';
import { Container } from 'react-bootstrap';
import UnishareGroupCard from './UnishareGroupCard';
import { myGroups } from '../../data/unishareData';

const UnishareMyGroups = () => {
  return (
    <div className="my-groups">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold" style={{ color: '#0370b7' }}>Nhóm của tôi</h4>
      </div>
      
      <Container className="p-0">
        {myGroups.map((group) => (
          <UnishareGroupCard key={group.id} group={group} />
        ))}
      </Container>
    </div>
  );
};

export default UnishareMyGroups;
