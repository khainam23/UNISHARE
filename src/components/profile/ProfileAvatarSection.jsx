import React from 'react';
import { Image, Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';
import userAvatar from '../../assets/avatar-1.png'; // Assuming you have an avatar image

const ProfileAvatarSection = () => {
  return (
    <div className="text-center">
      <Image src={userAvatar} width={150} height={150} className="mb-3 img-thumbnail" />
      <Button variant="primary" className="w-100 mb-2">
        <BsUpload className="me-2" /> Chọn Ảnh
      </Button>
      <small className="text-muted d-block">Định dạng: PNG, JPG</small>
      <small className="text-muted d-block">Dung lượng tối đa 1MB</small>
    </div>
  );
};

export default ProfileAvatarSection;
