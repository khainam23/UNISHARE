import api, { apiRequestWithRetry } from './api';
import cacheService from './cacheService';

/**
 * Service for document-related operations
 */
const documentService = {
  /**
   * Get all documents with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} Promise with documents
   */
  getAllDocuments: async (params = {}) => {
    try {
      const response = await apiRequestWithRetry('get', '/documents', null, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      console.error('Error fetching documents:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  /**
   * Get documents for a specific group
   * @param {number} groupId - The group ID
   * @param {object} params - Query parameters like page, search, etc.
   * @returns {Promise} - Promise with documents data
   */
  getGroupDocuments: async (groupId, params = {}) => {
    try {
      const response = await apiRequestWithRetry('get', `/groups/${groupId}/documents`, null, { params });
      
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      console.error(`Error fetching documents for group ${groupId}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch group documents',
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
   * @param {number} documentId - Document ID to download
   * @returns {Promise} Promise with download status
   */
  downloadDocument: async (documentId) => {
    try {
      const response = await apiRequestWithRetry('get', `/documents/${documentId}/download`, null, {
        responseType: 'blob'
      });
      
      // Get filename from Content-Disposition header or use a default
      let filename = 'document.pdf';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create a Blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download document'
      };
    }
  },

  /**
   * Upload a document to a group
   * @param {number} groupId - The group ID
   * @param {FormData} formData - Form data with document and metadata
   * @returns {Promise} Promise with upload result
   */
  uploadGroupDocument: async (groupId, formData) => {
    try {
      const response = await apiRequestWithRetry('post', `/groups/${groupId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload document',
        errors: error.response?.data?.errors || {}
      };
    }
  }
};

export default documentService;
