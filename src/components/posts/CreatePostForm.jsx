import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { BsImage, BsX } from 'react-icons/bs';

const CreatePostForm = ({ groupId, onSubmit, onCancel }) => {
  const [postData, setPostData] = useState({ content: '', title: '' });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    
    // Generate previews for image files
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(prev => [...prev, {
            file: file.name,
            dataUrl: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(prev => [...prev, {
          file: file.name,
          dataUrl: null,
          type: file.type
        }]);
      }
    });
  };
  
  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    setPreview(preview.filter(p => p.file !== fileName));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!postData.content.trim()) {
      setError('Post content cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const formData = new FormData();
      formData.append('content', postData.content);
      
      if (postData.title) {
        formData.append('title', postData.title);
      }
      
      files.forEach(file => {
        formData.append('attachments[]', file);
      });
      
      // Pass the form data to the parent component
      await onSubmit(formData);
      
      // Reset form
      setPostData({ content: '', title: '' });
      setFiles([]);
      setPreview([]);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          name="title"
          placeholder="Post title (optional)"
          value={postData.title}
          onChange={handleChange}
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          name="content"
          placeholder="Share something with the group..."
          value={postData.content}
          onChange={handleChange}
          rows={4}
          required
        />
      </Form.Group>
      
      {preview.length > 0 && (
        <div className="mb-3 attachment-previews">
          <div className="d-flex flex-wrap gap-2">
            {preview.map((p, index) => (
              <div key={index} className="position-relative attachment-preview">
                {p.dataUrl ? (
                  <img 
                    src={p.dataUrl} 
                    alt={p.file} 
                    className="img-thumbnail" 
                    style={{ height: '100px', width: '100px', objectFit: 'cover' }} 
                  />
                ) : (
                  <div className="file-icon rounded p-2 border" style={{ height: '100px', width: '100px' }}>
                    <div className="text-center">
                      <i className="bi bi-file-earmark fs-3"></i>
                      <p className="small text-truncate">{p.file}</p>
                    </div>
                  </div>
                )}
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="position-absolute top-0 end-0 rounded-circle p-1"
                  onClick={() => removeFile(p.file)}
                >
                  <BsX />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="d-flex justify-content-between">
        <div>
          <Form.Group controlId="fileUpload">
            <Button 
              variant="outline-secondary" 
              as="label" 
              htmlFor="attachments" 
              className="d-inline-flex align-items-center"
            >
              <BsImage className="me-1" /> Add Photos
            </Button>
            <Form.Control 
              type="file" 
              id="attachments" 
              multiple 
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Form.Group>
        </div>
        
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Posting...
              </>
            ) : 'Post'}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreatePostForm;
