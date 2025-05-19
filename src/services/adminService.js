import api, { getCsrfToken, apiRequestWithRetry } from './api';
import { getCachedData } from '../utils/apiCache';

const adminService = {
  /**
   * Get dashboard statistics overview
   */
  getDashboardStats: async () => {
    return getCachedData('dashboard-stats', async () => {
      try {
        const response = await apiRequestWithRetry('get', '/admin/statistics/overview');
        return response.data.data || response.data;
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Return default stats instead of throwing
        return {
          users: { total: 0, active: 0 },
          content: { documents: { approved: 0 }, posts: { total: 0 } },
          reports: { pending: 0 },
          orders: { total: 0 }
        };
      }
    }, { ttl: 2 * 60 * 1000 }); // 2 minute cache
  },
  
  /**
   * Get user list with filters
   */
  getUsers: async (filters = {}) => {
    // Generate cache key based on filters
    const cacheKey = `users-${JSON.stringify(filters)}`;
    
    return getCachedData(cacheKey, async () => {
      try {
        // Remove problematic filters
        if (filters.is_active !== undefined) delete filters.is_active;
        if (filters.active !== undefined) delete filters.active;
        
        // Fix the URL by removing any duplicate 'api' prefix
        const response = await apiRequestWithRetry('get', '/admin/users', null, { params: filters });
        
        // Handle different response formats
        if (response.data && response.data.data) {
          return {
            data: response.data.data,
            meta: response.data.meta || null
          };
        } else if (response.data && Array.isArray(response.data)) {
          return { data: response.data };
        } else if (response.data && response.data.success) {
          return {
            data: response.data.data || [],
            meta: response.data.meta || null
          };
        } else {
          return { data: [] };
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        return { data: [] };
      }
    }, { ttl: 30 * 1000 }); // 30 seconds cache
  },
  
  /**
   * Get user details
   */
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Update a user's role
   * @param {number} userId - User ID
   * @param {string} role - New role value
   * @returns {Promise<Object>} - Response data
   */
  async updateUserRole(userId, role) {
    try {
      console.log(`Updating role for user ${userId} to ${role}`);
      // Adjust the URL to be relative to the base API URL.
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      console.log('Role update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Ban a user
   */
  banUser: async (userId, reason) => {
    try {
      await getCsrfToken();
      const response = await api.post(`/admin/users/${userId}/ban`, { reason });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Unban a user
   */
  unbanUser: async (userId) => {
    try {
      await getCsrfToken();
      const response = await api.post(`/admin/users/${userId}/unban`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Delete a user
   */
  deleteUser: async (userId) => {
    try {
      await getCsrfToken();
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get message list
   */
  getMessages: async (filters = {}) => {
    try {
      const response = await api.get('/admin/messages', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get reports with optional filters
   */
  getReports: async (filters = {}) => {
    try {
      const response = await api.get('/admin/reports', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get report details
   */
  getReportDetails: async (reportId) => {
    try {
      const response = await api.get(`/admin/reports/${reportId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Resolve a report
   */
  resolveReport: async (reportId, action, resolution_note) => {
    try {
      await getCsrfToken();
      const response = await api.post(`/admin/reports/${reportId}/resolve`, {
        action, // 'resolve' or 'reject'
        resolution_note
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Delete document (for report resolution)
   */
  deleteDocument: async (documentId, reason) => {
    try {
      await getCsrfToken();
      const response = await api.delete(`/admin/documents/${documentId}`, {
        data: { reason }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get user roles
   */
  getRoles: async () => {
    try {
      // Fix the URL by removing any duplicate 'api' prefix
      const response = await apiRequestWithRetry('get', '/admin/roles');
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data && response.data.success) {
        return response.data.data || [];
      } else {
        return response.data || [];
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      
      // Return default roles instead of throwing
      return [
        { value: 'student', label: 'Sinh viên' },
        { value: 'lecturer', label: 'Giảng viên' },
        { value: 'moderator', label: 'Người kiểm duyệt' },
        { value: 'admin', label: 'Quản trị viên' }
      ];
    }
  },
  
  /**
   * Get teachers list
   */
  getTeachers: async (filters = {}) => {
    try {
      filters.role = 'lecturer'; // Filter by lecturer role
      const response = await api.get('/admin/users', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get all permissions
   */
  getPermissions: async () => {
    try {
      const response = await api.get('/admin/permissions');
      return response.data.data || response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get permissions for a role
   */
  getRolePermissions: async (roleName) => {
    try {
      const response = await api.get(`/admin/roles/${roleName}/permissions`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Update role permissions
   */
  updateRolePermissions: async (roleName, permissions) => {
    try {
      await getCsrfToken();
      const response = await api.put(`/admin/roles/${roleName}/permissions`, { permissions });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get all documents for admin management
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} Promise with documents data
   */
  getDocuments: async (params = {}) => {
    try {
      const response = await api.get('/admin/documents', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get document details
   * @param {Number} documentId - Document ID
   * @returns {Promise} Promise with document details
   */
  getDocument: async (documentId) => {
    try {
      const response = await api.get(`/admin/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document details:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update document details
   * @param {Number} documentId - Document ID
   * @param {Object} documentData - Document data to update
   * @returns {Promise} Promise with updated document data
   */
  updateDocument: async (documentId, documentData) => {
    try {
      const response = await api.put(`/admin/documents/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a document
   * @param {Number} documentId - Document ID
   * @param {String} reason - Reason for deletion
   * @returns {Promise} Promise with success message
   */
  deleteDocument: async (documentId, reason = '') => {
    try {
      const response = await api.delete(`/admin/documents/${documentId}`, {
        data: { reason }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Approve a document
   * @param {Number} documentId - Document ID
   * @returns {Promise} Promise with updated document data
   */
  approveDocument: async (documentId) => {
    try {
      const response = await api.post(`/admin/documents/${documentId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving document:', error);
      
      // If it's already approved, return a structured error that can be handled
      if (error.response && error.response.status === 400 && 
          error.response.data.message && 
          error.response.data.message.includes('already approved')) {
        throw {
          message: error.response.data.message,
          status: 400,
          alreadyApproved: true
        };
      }
      
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Reject a document
   * @param {Number} documentId - Document ID
   * @param {String} reason - Reason for rejection
   * @returns {Promise} Promise with updated document data
   */
  rejectDocument: async (documentId, reason) => {
    try {
      const response = await api.post(`/admin/documents/${documentId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting document:', error);
      
      // Create structured error that includes response data if available
      const enhancedError = new Error(
        error.response?.data?.message || 'Failed to reject document'
      );
      enhancedError.response = error.response;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  },

  /**
   * Get document statistics
   * @returns {Promise} Promise with document statistics
   */
  getDocumentStatistics: async () => {
    try {
      const response = await api.get('/admin/documents/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching document statistics:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get all groups for admin management
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise} Promise with groups data
   */
  getGroups: async (params = {}) => {
    try {
      const response = await api.get('/admin/groups', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get group details
   * @param {Number} groupId - Group ID
   * @returns {Promise} Promise with group details
   */
  getGroup: async (groupId) => {
    try {
      const response = await api.get(`/admin/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get members of a group
   * @param {Number} groupId - Group ID
   * @returns {Promise} Promise with group members data
   */
  getGroupMembers: async (groupId) => {
    try {
      const response = await api.get(`/admin/groups/${groupId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Remove a member from a group
   * @param {Number} groupId - Group ID
   * @param {Number} userId - User ID to remove
   * @returns {Promise} Promise with success message
   */
  removeGroupMember: async (groupId, userId) => {
    try {
      const response = await api.delete(`/admin/groups/${groupId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing group member:', error);
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a group
   * @param {Number} groupId - Group ID
   * @returns {Promise} Promise with success message
   */
  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(`/admin/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default adminService;
