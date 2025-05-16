import api from './api';

const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        // Make sure we're storing the complete user object with roles
        const user = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove local storage items even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user info with additional activity data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      // Update stored user data with fresh data
      if (response.data.user) {
        // Ensure we have the avatar_url property in the stored user data
        const userData = {
          ...response.data.user,
          activity: response.data.activity || {}
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      return response.data.user;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get user from local storage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Refresh the user's role information
  refreshUserInfo: async () => {
    if (!authService.isLoggedIn()) {
      return null;
    }
    
    try {
      const userData = await authService.getCurrentUser();
      return userData;
    } catch (error) {
      console.error('Failed to refresh user info:', error);
      return null;
    }
  }
};

export default authService;
