import axios from 'axios';

// Create the base API instance with common configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Store the baseURL for reference in other functions
const baseURL = api.defaults.baseURL;

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add debugging header to track requests
    config.headers['X-Debug-User-Role'] = localStorage.getItem('user') ? 
      JSON.parse(localStorage.getItem('user'))?.roles?.[0]?.name || 'unknown' : 'not-logged-in';
      
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Add specific error handling based on status codes
    if (error.response) {
      // Server returned an error response
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        console.warn('Unauthorized access, redirecting to login');
        // Don't redirect automatically in development
        if (process.env.NODE_ENV === 'production') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      
      if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('Access forbidden: Insufficient permissions or wrong role');
        
        // Handle role-based errors specifically
        if (error.response.data && 
            (error.response.data.message?.includes('quyền') || 
             error.response.data.exception?.includes('UnauthorizedException'))) {
          console.error('Role/permission error:', error.response.data.message);
          console.error('Debug info:', error.response.data.debug_info || 'No debug info available');
          
          // Add more detailed debugging for role errors
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const user = JSON.parse(userData);
              console.log('Current user roles:', user.roles);
              console.log('Current endpoint:', error.config.url);
            } catch (e) {}
          }
        }
      }
      
      if (error.response.status === 422) {
        // Validation error
        console.warn('Validation error:', error.response.data.errors);
      }
      
      if (error.response.status >= 500) {
        // Server error
        console.error('Server error:', error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get CSRF token for Laravel Sanctum
 */
export const getCsrfToken = async () => {
  try {
    // Check if we're in development mode and API is on localhost
    if (process.env.NODE_ENV === 'development' && baseURL.includes('localhost')) {
      await axios.get(`${baseURL}sanctum/csrf-cookie`, { withCredentials: true });
    } else {
      // In production, ensure the CSRF token is properly set
      await axios.get(`${baseURL}sanctum/csrf-cookie`, { withCredentials: true });
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    
    // In development, we might want to continue without the CSRF token
    if (process.env.NODE_ENV === 'development') {
      console.warn('Continuing without CSRF token in development mode');
    } else {
      throw error;
    }
  }
};

// Detect if the API is available and retry with backoff
export const checkApiAvailability = async (retries = 3, delay = 1000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(`${baseURL}health-check`, { 
        timeout: 2000,
        withCredentials: true 
      });
      return response.status === 200;
    } catch (error) {
      console.warn(`API connectivity check failed (attempt ${attempt + 1}/${retries}):`, error.message);
      
      // Last attempt failed
      if (attempt === retries - 1) {
        return false;
      }
      
      // Wait with exponential backoff before retry
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  return false;
};

/**
 * Make an API request with retry logic
 */
export const apiRequestWithRetry = async (method, endpoint, data = null, config = {}, retries = 2) => {
  try {
    // Ensure endpoint has leading slash if it doesn't start with http
    if (!endpoint.startsWith('http') && !endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    
    // Remove duplicate api prefix if present in the endpoint
    if (endpoint.includes('/api/api/')) {
      endpoint = endpoint.replace('/api/api/', '/api/');
    }
    
    // Full URL for debugging
    const fullUrl = endpoint.startsWith('http')
      ? endpoint
      : `${baseURL}${endpoint.replace(/^\/api\//, '')}`;
    
    console.debug(`API ${method.toUpperCase()} request to: ${fullUrl}`);
    
    const { headers, params } = config;
    
    // Ensure we don't send problematic parameters
    if (params) {
      if (params.active !== undefined) delete params.active;
      if (params.is_active !== undefined) delete params.is_active;
    }
    
    for (let attempt = 0; attempt < retries + 1; attempt++) {
      try {
        let response;
        
        switch (method.toLowerCase()) {
          case 'get':
            response = await api.get(fullUrl, { headers, params });
            break;
          case 'post':
            response = await api.post(fullUrl, data, { headers });
            break;
          case 'put':
            response = await api.put(fullUrl, data, { headers });
            break;
          case 'delete':
            response = await api.delete(fullUrl, { headers, data });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        return response;
      } catch (error) {
        console.warn(`API request failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);
        
        // Don't retry 4xx client errors except 429 (rate limiting)
        if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
          throw error;
        }
        
        // Last attempt failed
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  } catch (error) {
    console.error('API request with retry failed:', error);
    throw error;
  }
};

export default api;
