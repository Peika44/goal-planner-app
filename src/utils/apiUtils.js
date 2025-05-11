// api/apiUtils.js

/**
 * Handles API requests with automatic token management, error handling,
 * and standardized response format
 * 
 * @param {string} url - The URL to make the request to
 * @param {Object} options - Request options (method, headers, body, etc.)
 * @returns {Promise<Object>} - Standardized response object { success, data, error }
 */
export const apiRequest = async (url, options = {}) => {
    try {
      // Default options with authentication
      const token = localStorage.getItem('token');
      const defaultOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      };
      
      // Merge default options with provided options
      const requestOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers
        }
      };
      
      // Make the request
      const response = await fetch(url, requestOptions);
      
      // Handle no-content responses (204)
      if (response.status === 204) {
        return {
          success: true,
          data: null
        };
      }
      
      // Parse the response
      let data;
      const contentType = response.headers.get('Content-Type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Handle error responses
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'An error occurred during the request'
        };
      }
      
      // Return success response
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('API Request Error:', error);
      
      // Handle network errors or other exceptions
      return {
        success: false,
        error: error.message || 'Network error or server unavailable'
      };
    }
  };
  
  /**
   * Utility for handling file uploads
   *
   * @param {string} url - The URL to upload to
   * @param {FormData} formData - The FormData object with the file and other data
   * @param {Function} onProgress - Optional callback for upload progress
   * @returns {Promise<Object>} - Standardized response object { success, data, error }
   */
  export const uploadFile = async (url, formData, onProgress = null) => {
    try {
      const token = localStorage.getItem('token');
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Handle progress if a callback is provided
        if (onProgress && typeof onProgress === 'function') {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              onProgress(percentComplete);
            }
          };
        }
        
        xhr.open('POST', url, true);
        
        // Set headers
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                data
              });
            } catch (error) {
              resolve({
                success: true,
                data: xhr.responseText
              });
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              resolve({
                success: false,
                error: errorData.error || errorData.message || `Upload failed with status ${xhr.status}`
              });
            } catch (error) {
              resolve({
                success: false,
                error: `Upload failed with status ${xhr.status}`
              });
            }
          }
        };
        
        xhr.onerror = function() {
          resolve({
            success: false,
            error: 'Network error during file upload'
          });
        };
        
        // Send the form data
        xhr.send(formData);
      });
    } catch (error) {
      console.error('File Upload Error:', error);
      
      return {
        success: false,
        error: error.message || 'Error preparing file upload'
      };
    }
  };
  
  /**
   * Handle API request cancellation
   * @returns {Object} - Controller and signal for cancellation
   */
  export const createCancelToken = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    return {
      controller,
      signal
    };
  };
  
  /**
   * Handle API request with timeout
   * @param {Promise} promise - The fetch promise
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} - Promise that resolves or rejects based on the timeout
   */
  export const withTimeout = (promise, timeout = 30000) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);
    });
    
    return Promise.race([promise, timeoutPromise]);
  };
  
  /**
   * Get API base URL from environment
   * @returns {string} - API base URL
   */
  export const getApiUrl = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  };
  
  /**
   * Create a full API URL
   * @param {string} endpoint - API endpoint
   * @returns {string} - Full API URL
   */
  export const createApiUrl = (endpoint) => {
    const baseUrl = getApiUrl();
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  };
  
  /**
   * Shorthand for GET requests
   * @param {string} url - API endpoint
   * @param {Object} options - Optional request options
   * @returns {Promise<Object>} - API response
   */
  export const get = async (url, options = {}) => {
    return apiRequest(url, { ...options, method: 'GET' });
  };
  
  /**
   * Shorthand for POST requests
   * @param {string} url - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Optional request options
   * @returns {Promise<Object>} - API response
   */
  export const post = async (url, data, options = {}) => {
    return apiRequest(url, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  
  /**
   * Shorthand for PUT requests
   * @param {string} url - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Optional request options
   * @returns {Promise<Object>} - API response
   */
  export const put = async (url, data, options = {}) => {
    return apiRequest(url, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data)
    });
  };
  
  /**
   * Shorthand for PATCH requests
   * @param {string} url - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Optional request options
   * @returns {Promise<Object>} - API response
   */
  export const patch = async (url, data, options = {}) => {
    return apiRequest(url, { 
      ...options, 
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  };
  
  /**
   * Shorthand for DELETE requests
   * @param {string} url - API endpoint
   * @param {Object} options - Optional request options
   * @returns {Promise<Object>} - API response
   */
  export const del = async (url, options = {}) => {
    return apiRequest(url, { ...options, method: 'DELETE' });
  };