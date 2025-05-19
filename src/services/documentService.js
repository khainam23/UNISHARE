import api from './api';

/**
 * Service for document-related operations
 */
const documentService = {
  /**
   * Get all documents with filtering and pagination
   * @param {Object} params - Filter and pagination parameters
   * @returns {Promise} Promise with documents data
   */
  getDocuments: async (params = {}) => {
    try {
      const response = await api.get('/documents', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get a single document by ID
   * @param {Number} documentId - The document ID
   * @returns {Promise} Promise with document data
   */
  getDocument: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Download a document
   * @param {Number} documentId - The document ID
   * @returns {Promise} - Promise that resolves when download starts
   */
  downloadDocument: async (documentId) => {
    try {
      // First, try to get download info
      try {
        const infoResponse = await api.get(`/documents/${documentId}/download-info`);
        
        // If we have a download URL, open it in a new tab
        if (infoResponse.data && infoResponse.data.download_url) {
          window.open(infoResponse.data.download_url, '_blank');
          return { success: true };
        }
      } catch (infoError) {
        console.log('Download info not available, falling back to direct download');
        // Continue with direct download attempt
      }
      
      // Continue with direct download
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      // Handle error responses that might come as blobs
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        // This is likely an error response, convert blob to text and parse it
        const errorText = await new Response(response.data).text();
        try {
          const errorJson = JSON.parse(errorText);
          throw errorJson;
        } catch (e) {
          // If parsing fails, throw a generic error
          throw { message: 'Error processing server response' };
        }
      }
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get the filename from the Content-Disposition header or use a default name
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('Download error:', error);
      if (error.response && error.response.status === 404) {
        throw { message: 'Không tìm thấy file tài liệu' };
      } else if (error.response && error.response.status === 403) {
        throw { message: 'Bạn không có quyền tải xuống tài liệu này' };
      } else if (error.response) {
        throw error.response.data || { message: 'Không thể tải xuống tài liệu' };
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Không thể kết nối đến máy chủ' };
      }
    }
  },
  
  /**
   * Get document download URL (for non-direct downloads)
   * @param {Number} documentId - The document ID
   * @returns {Promise} Promise with download URL
   */
  getDocumentDownloadUrl: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/download-url`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Upload a document
   * @param {FormData} formData - Form data with document file and metadata
   * @returns {Promise} Promise with created document data
   */
  uploadDocument: async (formData) => {
    try {
      // First, check if the file already exists by calculating hash
      const file = formData.get('file');
      if (file) {
        try {
          // Create a small form just for hash check
          const hashCheckForm = new FormData();
          hashCheckForm.append('file', file);
          
          // Check if file exists before full upload
          const hashCheck = await api.post('/documents/check-exists', hashCheckForm, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          // If the file already exists and we got a document ID back
          if (hashCheck.data && hashCheck.data.exists && hashCheck.data.document_id) {
            return {
              success: true,
              message: 'Tài liệu đã tồn tại và được liên kết với tài khoản của bạn',
              data: hashCheck.data.document,
              isDuplicate: true,
              documentId: hashCheck.data.document_id
            };
          }
        } catch (hashError) {
          // Silently ignore hash check errors and proceed with normal upload
          console.log('Hash check failed, proceeding with normal upload:', hashError);
        }
      }
      
      // Determine user role from local storage
      const userData = localStorage.getItem('user');
      let isTeacher = false;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.roles && Array.isArray(user.roles)) {
            isTeacher = user.roles.some(r => 
              (typeof r === 'object' && r.name === 'lecturer') || 
              (typeof r === 'string' && r === 'lecturer')
            );
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // Use appropriate endpoint based on user role
      const endpoint = isTeacher ? '/teacher/documents' : '/student/documents';
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      // Handle duplicate file error specifically
      if (error.response && 
          (error.response.status === 409 || // HTTP conflict status
           (error.response.data &&
            error.response.data.message &&
            (error.response.data.message.includes('Duplicate') ||
             error.response.data.message.includes('already exists') ||
             error.response.data.message.includes('Integrity constraint'))))) {
        
        // If the error contains the existing document info, return it
        if (error.response.data && error.response.data.document) {
          return {
            success: true,
            message: 'Tài liệu này đã tồn tại trong hệ thống',
            data: error.response.data.document,
            isDuplicate: true,
            documentId: error.response.data.document.id
          };
        }
        
        // Otherwise return a generic duplicate message
        return {
          success: false,
          message: 'Tài liệu này đã tồn tại trong hệ thống. Vui lòng tải lên tài liệu khác.',
          isDuplicate: true
        };
      }
      
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Update a document
   * @param {Number} documentId - The document ID
   * @param {Object} documentData - Updated document data
   * @returns {Promise} Promise with updated document data
   */
  updateDocument: async (documentId, documentData) => {
    try {
      // Determine user role from local storage
      const userData = localStorage.getItem('user');
      let isTeacher = false;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.roles && Array.isArray(user.roles)) {
            isTeacher = user.roles.some(r => 
              (typeof r === 'object' && r.name === 'lecturer') || 
              (typeof r === 'string' && r === 'lecturer')
            );
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // Use appropriate endpoint based on user role
      const endpoint = isTeacher 
        ? `/teacher/documents/${documentId}`
        : `/student/documents/${documentId}`;
      
      const response = await api.put(endpoint, documentData);
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Delete a document
   * @param {Number} documentId - The document ID
   * @returns {Promise} Promise with deletion confirmation
   */
  deleteDocument: async (documentId) => {
    try {
      // Determine user role from local storage
      const userData = localStorage.getItem('user');
      let isTeacher = false;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.roles && Array.isArray(user.roles)) {
            isTeacher = user.roles.some(r => 
              (typeof r === 'object' && r.name === 'lecturer') || 
              (typeof r === 'string' && r === 'lecturer')
            );
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // Use appropriate endpoint based on user role
      const endpoint = isTeacher 
        ? `/teacher/documents/${documentId}`
        : `/student/documents/${documentId}`;
      
      const response = await api.delete(endpoint);
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Report a document
   * @param {Number} documentId - The document ID
   * @param {Object} reportData - Report reason and details
   * @returns {Promise} Promise with report confirmation
   */
  reportDocument: async (documentId, reportData) => {
    try {
      const response = await api.post(`/documents/${documentId}/report`, reportData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Approve a document (moderator/admin only)
   * @param {Number} documentId - The document ID
   * @returns {Promise} Promise with updated document
   */
  approveDocument: async (documentId) => {
    try {
      const response = await api.post(`/documents/${documentId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Reject a document (moderator/admin only)
   * @param {Number} documentId - The document ID
   * @param {String} reason - Rejection reason
   * @returns {Promise} Promise with updated document
   */
  rejectDocument: async (documentId, reason) => {
    try {
      const response = await api.post(`/documents/${documentId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default documentService;
