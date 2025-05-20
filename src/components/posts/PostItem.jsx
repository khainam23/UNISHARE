import React, { useState } from 'react';
import { Card, Image, Button, Dropdown, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsThreeDots, BsHeart, BsHeartFill, BsChat, BsShare, BsPinAngle, BsMegaphone } from 'react-icons/bs';
import defaultAvatar from '../../assets/avatar-1.png';

const PostItem = ({ post, groupContext = false, onLike, onDelete, onEdit }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission
    setComment('');
  };
  
  // Helper function to format date without date-fns
  const formatDateRelative = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffMinutes < 1) {
        return 'vừa xong';
      } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
      } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
      } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
      } else {
        // Format as regular date for older posts
        return date.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      console.error('Invalid date:', e);
      return 'Không rõ';
    }
  };
  
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        {/* Post header with user info */}
        <div className="d-flex mb-3">
          <Image 
            src={post.author?.avatar || defaultAvatar} 
            roundedCircle 
            width={40} 
            height={40} 
            className="me-2"
            style={{ objectFit: 'cover' }}
          />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Link to={`/profile/${post.author?.id}`} className="fw-bold text-decoration-none">
                  {post.author?.name || 'Unknown User'}
                </Link>
                {!groupContext && post.group && (
                  <span className="text-muted">
                    {' '}posted in{' '}
                    <Link to={`/groups/${post.group.id}`} className="text-decoration-none">
                      {post.group.name}
                    </Link>
                  </span>
                )}
                <div className="text-muted small">
                  {formatDateRelative(post.created_at)}
                  {post.is_pinned && (
                    <span className="ms-2 text-primary">
                      <BsPinAngle /> Pinned
                    </span>
                  )}
                  {post.is_announcement && (
                    <span className="ms-2 text-danger">
                      <BsMegaphone /> Announcement
                    </span>
                  )}
                </div>
              </div>
              
              {/* Post actions dropdown */}
              <Dropdown>
                <Dropdown.Toggle as="div" className="btn btn-sm bg-transparent border-0">
                  <BsThreeDots />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {onEdit && <Dropdown.Item onClick={() => onEdit(post)}>Edit</Dropdown.Item>}
                  {onDelete && <Dropdown.Item onClick={() => onDelete(post)}>Delete</Dropdown.Item>}
                  <Dropdown.Item>Report</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        
        {/* Post title */}
        {post.title && (
          <h5 className="mb-2">{post.title}</h5>
        )}
        
        {/* Post content */}
        <Card.Text className="mb-3 post-content">
          {post.content}
        </Card.Text>
        
        {/* Post attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="post-attachments mb-3">
            <Row xs={2} md={3} lg={4} className="g-2">
              {post.attachments.map((attachment, index) => (
                <Col key={index}>
                  {attachment.file_type?.startsWith('image/') ? (
                    <a 
                      href={attachment.preview_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-block"
                    >
                      <img 
                        src={attachment.preview_url || attachment.thumbnail_path} 
                        alt={attachment.file_name}
                        className="img-thumbnail w-100"
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                    </a>
                  ) : (
                    <a 
                      href={attachment.download_url} 
                      className="attachment-item p-2 border rounded d-flex align-items-center text-decoration-none"
                    >
                      <i className="bi bi-file-earmark me-2"></i>
                      <div className="text-truncate">{attachment.file_name}</div>
                    </a>
                  )}
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        {/* Post stats */}
        <div className="d-flex justify-content-between text-muted mb-2">
          <div>
            {post.like_count > 0 && (
              <span>
                <BsHeartFill className="text-danger" /> {post.like_count}
              </span>
            )}
          </div>
          <div>
            {post.comment_count > 0 && (
              <span className="cursor-pointer" onClick={() => setShowComments(!showComments)}>
                {post.comment_count} comments
              </span>
            )}
          </div>
        </div>
        
        {/* Post actions */}
        <div className="d-flex border-top border-bottom py-2 mb-3">
          <Button 
            variant="light" 
            className="flex-grow-1 d-flex align-items-center justify-content-center"
            onClick={() => onLike && onLike(post)}
          >
            {post.is_liked ? <BsHeartFill className="text-danger me-2" /> : <BsHeart className="me-2" />}
            Like
          </Button>
          <Button 
            variant="light" 
            className="flex-grow-1 d-flex align-items-center justify-content-center"
            onClick={() => setShowComments(!showComments)}
          >
            <BsChat className="me-2" />
            Comment
          </Button>
          <Button 
            variant="light" 
            className="flex-grow-1 d-flex align-items-center justify-content-center"
          >
            <BsShare className="me-2" />
            Share
          </Button>
        </div>
        
        {/* Comment form */}
        {showComments && (
          <div className="comment-section">
            <Form onSubmit={handleCommentSubmit} className="d-flex mb-3">
              <Image 
                src={defaultAvatar} 
                roundedCircle 
                width={32} 
                height={32} 
                className="me-2"
              />
              <Form.Control
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="rounded-pill"
              />
            </Form>
            
            {/* Comments would be rendered here */}
            <div className="comments-container">
              {/* Show a placeholder if there are no comments yet */}
              {!post.comment_count && (
                <div className="text-center text-muted my-3">
                  <p>Be the first to comment</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PostItem;
