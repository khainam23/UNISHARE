import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { profileService } from '../../services';
import PostItem from '../posts/PostItem';
import CreatePostForm from '../posts/CreatePostForm';

const GroupPosts = ({ groupId, isMember, onPostCreated }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchPosts(currentPage);
    }
  }, [groupId, currentPage]);

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      setError('');
      
      // Check if profileService has the getGroupPosts function
      if (typeof profileService.getGroupPosts !== 'function') {
        console.error('profileService.getGroupPosts is not a function');
        throw new Error('Service not available. This feature is currently unavailable.');
      }
      
      const response = await profileService.getGroupPosts(groupId, { 
        page,
        per_page: 10
      });
      
      if (response.success) {
        setPosts(response.data || []);
        setTotalPages(response.meta?.last_page || 1);
      } else {
        throw new Error(response.message || 'Could not fetch group posts');
      }
    } catch (err) {
      console.error('Error fetching group posts:', err);
      setError(err.message || 'Could not fetch group posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    // Implementation for creating a post
    // ...

    // Refresh posts after creation
    fetchPosts(1);
    setShowCreateForm(false);
    if (onPostCreated) onPostCreated();
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        />
        {items}
        <Pagination.Next 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        />
      </Pagination>
    );
  };

  if (loading && posts.length === 0) {
    return <div className="text-center p-4"><Spinner animation="border" /></div>;
  }

  if (error && posts.length === 0) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  return (
    <div className="group-posts-container">
      {/* Create post button and form */}
      {isMember && (
        <Card className="mb-4">
          <Card.Body>
            {showCreateForm ? (
              <CreatePostForm 
                groupId={groupId} 
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreateForm(false)}
              />
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div className="post-prompt">Chia sẻ điều gì đó với nhóm...</div>
                <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                  Tạo bài viết
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Error message */}
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      {/* Loading indicator */}
      {loading && posts.length > 0 && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" />
        </div>
      )}
      
      {/* Posts list */}
      {posts.length === 0 && !loading ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>Chưa có bài đăng nào</h5>
            <p className="text-muted">Hãy là người đầu tiên chia sẻ với nhóm!</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {posts.map(post => (
            <Col xs={12} key={post.id} className="mb-3">
              <PostItem post={post} groupContext={true} />
            </Col>
          ))}
        </Row>
      )}
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default GroupPosts;
