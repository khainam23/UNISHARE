import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Change this to your actual API URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with cross-domain requests
});

// Function to get CSRF token
const getCsrfToken = async () => {
  try {
    // First, get the CSRF cookie
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
    
    // Then get the token
    const { data } = await axios.get('http://localhost:8000/api/csrf-token', { withCredentials: true });
    return data.token;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

// Request interceptor for adding auth token and CSRF token
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for non-GET requests
    if (config.method !== 'get') {
      try {
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
      } catch (error) {
        console.error('Error setting CSRF token:', error);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // CSRF token mismatch
      if (error.response.status === 419) {
        console.error('CSRF token mismatch. Refreshing...');
        // Optionally refresh the page or just the token
        // window.location.reload();
      }
      
      // Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
