import api from './api';

/**
 * Service for document-related operations
 */
const documentService = {
  /**
   * Get documents with pagination and filtering
   * @param {Object} params - Query parameters like page, limit, search, etc.
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
   * Get documents from a specific group
   * @param {Number} groupId - The ID of the group
   * @param {Object} params - Query parameters like page, limit, search, etc.
   * @returns {Promise} Promise with documents data
   */
  getGroupDocuments: async (groupId, params = {}) => {
    try {
      const response = await api.get(`/groups/${groupId}/documents`, { params });
      return response.data;
    } catch (error) {
      // Return a structured error response for better handling in components
      if (error.response) {
        console.error(`Error fetching group ${groupId} documents:`, error.response.data);
        return {
          success: false,
          message: error.response.data?.message || 'Could not fetch group documents',
          data: []
        };
      }
      
      // Network or other errors
      console.error(`Network error fetching group ${groupId} documents:`, error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        data: []
      };
    }
  },

  /**
   * Get document details
   * @param {Number} documentId - The ID of the document
   * @returns {Promise} Promise with document details
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
   * @param {Number} documentId - The ID of the document to download
   * @returns {Promise} Promise with download status
   */
  downloadDocument: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to get filename from headers
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
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      console.error('Download error:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Upload a document to a group
   * @param {Number} groupId - The ID of the group
   * @param {FormData} formData - Form data with the document file and metadata
   * @returns {Promise} Promise with uploaded document data
   */
  uploadGroupDocument: async (groupId, formData) => {
    try {
      const response = await api.post(`/groups/${groupId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Return structured error response
      if (error.response) {
        console.error(`Error uploading document to group ${groupId}:`, error.response.data);
        return {
          success: false,
          message: error.response.data?.message || 'Could not upload document to group',
          errors: error.response.data?.errors
        };
      }
      
      // Network or other errors
      console.error(`Network error uploading document to group ${groupId}:`, error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }
};

export default documentService;
