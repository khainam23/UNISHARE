import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // This is crucial for CORS with credentials
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 419) {
      console.error('CSRF token mismatch. Please refresh the page and try again.');
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

// Function to get CSRF cookie before making requests
export const getCsrfToken = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return false;
  }
};

export default api;
