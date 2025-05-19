import React, { useState } from 'react';
import { Card, Button, Image, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsThreeDotsVertical, BsHeart, BsHeartFill, BsChat, BsShare } from 'react-icons/bs';
import defaultAvatar from '../../assets/avatar-1.png';

const PostItem = ({ post, groupContext = false }) => {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleLike = () => {
    // Toggle like state - in real implementation, this would call an API
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };
  
  return (
    <Card className="post-item">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <Image 
              src={post.author?.avatar || defaultAvatar} 
              roundedCircle 
              width={48} 
              height={48}
              className="me-2"
              style={{ objectFit: 'cover' }}
            />
            <div>
              <h6 className="mb-0">
                <Link to={`/profile/${post.author?.id}`} className="text-decoration-none">
                  {post.author?.name || 'Unknown User'}
                </Link>
              </h6>
              <small className="text-muted">{formatDate(post.created_at)}</small>
              {groupContext && post.group && (
                <small className="text-muted d-block">
                  in <Link to={`/unishare/groups/${post.group.id}`}>{post.group.name}</Link>
                </small>
              )}
            </div>
          </div>
          
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="btn-no-arrow">
              <BsThreeDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {post.can_edit && (
                <Dropdown.Item as={Link} to={`/unishare/posts/${post.id}/edit`}>Chỉnh sửa</Dropdown.Item>
              )}
              {post.can_delete && (
                <Dropdown.Item className="text-danger">Xóa</Dropdown.Item>
              )}
              <Dropdown.Item>Báo cáo</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
        <div className="post-content mb-3">
          <p>{post.content}</p>
          
          {/* Display post attachments if any */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="post-attachments mt-3">
              {/* Simplified - in a real implementation, you'd handle different attachment types */}
              {post.attachments.map((attachment, index) => (
                <div key={index} className="post-attachment mb-2">
                  <Link to={attachment.url} target="_blank" className="text-decoration-none">
                    {attachment.name || 'Attachment'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="post-stats d-flex justify-content-between align-items-center text-muted mb-2">
          <div>
            {likeCount > 0 && (
              <small>
                <BsHeartFill className="text-danger me-1" />
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </small>
            )}
          </div>
          <div>
            {post.comments_count > 0 && (
              <small>
                {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
              </small>
            )}
          </div>
        </div>
        
        <hr />
        
        <div className="post-actions d-flex justify-content-between">
          <Button 
            variant="link" 
            className={`d-flex align-items-center ${liked ? 'text-danger' : 'text-muted'}`}
            onClick={handleLike}
          >
            {liked ? <BsHeartFill /> : <BsHeart />}
            <span className="ms-1">Thích</span>
          </Button>
          
          <Button 
            variant="link" 
            className="d-flex align-items-center text-muted"
            as={Link}
            to={`/unishare/posts/${post.id}#comments`}
          >
            <BsChat />
            <span className="ms-1">Bình luận</span>
          </Button>
          
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Chia sẻ bài viết này</Tooltip>}
          >
            <Button 
              variant="link" 
              className="d-flex align-items-center text-muted"
            >
              <BsShare />
              <span className="ms-1">Chia sẻ</span>
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostItem;
