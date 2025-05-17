import api, { getCsrfToken } from './api';

const adminService = {
  /**
   * Get dashboard statistics overview
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/statistics/overview');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get user list with filters
   */
  getUsers: async (filters = {}) => {
    try {
      const response = await api.get('/admin/users', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Get user details
   */
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  /**
   * Update user role
   */
  updateUserRole: async (userId, role) => {
    try {
      await getCsrfToken();
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
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
      return response.data;
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
      const response = await api.get('/admin/roles');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
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
  }
};

export default adminService;
