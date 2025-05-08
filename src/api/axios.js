import axios from 'axios';

// Create an axios instance with a base URL
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds auth token to requests if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      success: false,
      error: 'Request preparation failed'
    });
  }
);

// Response interceptor - standardizes responses and error handling
instance.interceptors.response.use(
  (response) => {
    // Just return the data portion of the response
    return response.data;
  },
  (error) => {
    // Handle errors consistently
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with an error status code (4xx or 5xx)
      const status = error.response.status;
      
      // Get error message from response if available
      if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        // Default messages for common status codes
        if (status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (status === 404) {
          errorMessage = 'Resource not found.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error or server is not responding';
    }
    
    // Return standardized error format
    return Promise.reject({
      success: false,
      error: errorMessage
    });
  }
);

export default instance;