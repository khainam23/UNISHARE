import api from './api';

const profileService = {
  /**
   * Get the current user's profile data
   * @returns {Promise} Promise with user data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update the user's profile information
   * @param {Object} profileData - User profile data to update
   * @returns {Promise} Promise with updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update the user's password
   * @param {Object} passwordData - Contains current_password, password, and password_confirmation
   * @returns {Promise} Promise with success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Upload a new profile avatar
   * @param {File} file - The image file to upload
   * @returns {Promise} Promise with updated user data including new avatar URL
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get user's uploaded documents
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with user's documents
   */
  getUserDocuments: async (params = {}) => {
    try {
      const response = await api.get('/user/documents', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get user's activity history
   * @param {Object} params - Query parameters like page, limit, etc.
   * @returns {Promise} Promise with user's activity history
   */
  getUserHistory: async (params = {}) => {
    try {
      const response = await api.get('/user/history', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get user's groups
   * @param {Object} params - Query parameters like page, limit, status, etc.
   * @returns {Promise} Promise with user's groups
   */
  getUserGroups: async (params = {}) => {
    try {
      const response = await api.get('/user/groups', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Leave a group
   * @param {Number} groupId - The ID of the group to leave
   * @returns {Promise} Promise with success message
   */
  leaveGroup: async (groupId) => {
    try {
      const response = await api.post(`/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a user's document
   * @param {Number} documentId - The ID of the document to delete
   * @returns {Promise} Promise with success message
   */
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
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
   * @returns {Promise} Promise with download URL
   */
  downloadDocument: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get the filename from the Content-Disposition header or use a default name
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default profileService;
