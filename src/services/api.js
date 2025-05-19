import axios from 'axios';

// Create the base API instance with common configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to recognize AJAX requests
  },
  withCredentials: true, // Enable passing cookies for CORS requests
  timeout: 10000, // 10 second timeout
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
    
    // Ensure content type is set for all requests except FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Add debugging header to track requests
    config.headers['X-Debug-User-Role'] = localStorage.getItem('user') ? 
      JSON.parse(localStorage.getItem('user'))?.roles?.[0]?.name || 'unknown' : 'not-logged-in';
      
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - Only redirect if it's not a login/register request
        if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
          console.warn('Unauthorized access, redirecting to login');
          
          // Clear user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect in production
          if (process.env.NODE_ENV === 'production') {
            window.location.href = '/login';
          }
        } else {
          console.warn('Login/register request failed with 401');
        }
      }
      
      if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('Access forbidden: Insufficient permissions or wrong role');
        
        // Handle role-based errors specifically
        if (error.response.data && 
            (error.response.data.message?.includes('quyền') || 
             error.response.data.message?.includes('Unauthorized'))) {
          console.error('Role/permission error:', error.response.data.message);
          
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
    // Extract base URL without trailing slash and /api prefix
    let serverUrl = baseURL;
    
    // Remove /api/ from the URL if present
    if (serverUrl.includes('/api/')) {
      serverUrl = serverUrl.substring(0, serverUrl.indexOf('/api/'));
    }
    
    // Remove trailing slash if present
    if (serverUrl.endsWith('/')) {
      serverUrl = serverUrl.slice(0, -1);
    }
    
    // Full URL for CSRF cookie endpoint
    const csrfUrl = `${serverUrl}/sanctum/csrf-cookie`;
    
    console.log('Getting CSRF token from:', csrfUrl);
    
    // Use axios directly instead of api instance to avoid adding /api/ prefix
    const response = await axios.get(csrfUrl, { 
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 15000 // 15 second timeout
    });
    
    console.log('CSRF token response:', response.status);
    return true;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Try alternative URL with /api/ prefix
    try {
      console.log('Trying alternative CSRF token URL');
      const altCsrfUrl = `${baseURL}sanctum/csrf-cookie`;
      
      const response = await axios.get(altCsrfUrl, { 
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000
      });
      
      console.log('Alternative CSRF token response:', response.status);
      return true;
    } catch (altError) {
      console.error('Failed to get CSRF token from alternative URL:', altError);
      
      // In development, we might want to continue without the CSRF token
      if (process.env.NODE_ENV === 'development') {
        console.warn('Continuing without CSRF token in development mode');
        return false;
      } else {
        throw error;
      }
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
      
      if (response.status === 200) {
        console.log('API is available:', response.data);
        return true;
      }
    } catch (error) {
      console.warn(`API check attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < retries - 1) {
        const backoffDelay = delay * Math.pow(2, attempt);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  console.error(`API unavailable after ${retries} attempts`);
  return false;
};

// Helper function to handle file downloads
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    // Create a blob URL for the file
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Make API requests with automatic retry functionality
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint URL
 * @param {object} data - Request data (optional)
 * @param {object} options - Additional axios options (optional)
 * @param {number} retries - Number of retry attempts (default: 3)
 * @param {number} delay - Initial delay between retries in ms (default: 1000)
 * @returns {Promise<any>} API response
 */
export const apiRequestWithRetry = async (method, url, data = null, options = {}, retries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      let response;
      const config = { ...options };
      
      // Make the appropriate API call based on method
      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(url, config);
          break;
        case 'post':
          response = await api.post(url, data, config);
          break;
        case 'put':
          response = await api.put(url, data, config);
          break;
        case 'delete':
          response = await api.delete(url, { ...config, data });
          break;
        case 'patch':
          response = await api.patch(url, data, config);
          break;
        default:
          throw new Error(`Invalid method: ${method}`);
      }
      
      return response;
    } catch (error) {
      console.warn(`Request attempt ${attempt + 1} failed for ${url}:`, error.message);
      lastError = error;
      
      // Don't retry if it's a client error (4xx) except for 429 (too many requests)
      if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt < retries - 1) {
        const backoffDelay = delay * Math.pow(2, attempt);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  // If we get here, all retry attempts have failed
  console.error(`Request failed after ${retries} attempts:`, url);
  throw lastError;
};

export default api;
