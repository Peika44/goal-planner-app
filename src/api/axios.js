import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor - Adds the authentication token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      success: false,
      error: 'An unexpected error occurred',
    };

    // Handle server errors or no response
    if (!error.response) {
      customError.error = 'Network error or server is not responding';
      return Promise.reject(customError);
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      customError.error = 'Authentication error. Please log in again.';
      
      // Optional: Clear token and redirect to login page
      localStorage.removeItem('token');
      // If you're using React Router:
      // window.location.href = '/login';
    }
    
    // Include server error message if available
    if (error.response.data && error.response.data.error) {
      customError.error = error.response.data.error;
    } else if (error.response.status === 404) {
      customError.error = 'The requested resource was not found';
    } else if (error.response.status === 500) {
      customError.error = 'Server error. Please try again later.';
    }
    
    console.error('API Error:', customError.error);
    return Promise.reject(customError);
  }
);

export default instance;