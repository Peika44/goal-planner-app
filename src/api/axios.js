// src/axios.js
import axios from 'axios';

// Get API URL from environment or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock data store
const mockDataStore = {
  recommendations: {
    recommendedTasks: [
      {
        id: 'rec1',
        title: 'Morning Meditation',
        category: 'Wellness',
        duration: 15,
        difficulty: 'Easy',
        description: 'Start your day with a peaceful meditation session to improve focus and reduce stress.',
        benefits: ['Reduces stress', 'Improves focus', 'Enhances mindfulness'],
        imageUrl: 'https://via.placeholder.com/150?text=Meditation',
        mood: 'Calm',
        energyLevel: 'Low'
      },
      {
        id: 'rec2',
        title: 'Reading Session',
        category: 'Learning',
        duration: 30,
        difficulty: 'Medium',
        description: 'Take time to read a book or article related to your field of interest.',
        benefits: ['Expands knowledge', 'Improves vocabulary', 'Reduces screen time'],
        imageUrl: 'https://via.placeholder.com/150?text=Reading',
        mood: 'Neutral',
        energyLevel: 'Medium'
      },
      {
        id: 'rec3',
        title: 'Brisk Walk',
        category: 'Fitness',
        duration: 20,
        difficulty: 'Easy',
        description: 'Get some fresh air and exercise with a brisk walk around your neighborhood.',
        benefits: ['Improves cardiovascular health', 'Boosts energy', 'Clears mind'],
        imageUrl: 'https://via.placeholder.com/150?text=Walking',
        mood: 'Energetic',
        energyLevel: 'Medium'
      },
      {
        id: 'rec4',
        title: 'Learn a New Skill',
        category: 'Learning',
        duration: 45,
        difficulty: 'Hard',
        description: 'Dedicate time to learning a new skill or improving an existing one.',
        benefits: ['Intellectual growth', 'Career advancement', 'Personal satisfaction'],
        imageUrl: 'https://via.placeholder.com/150?text=Learning',
        mood: 'Focused',
        energyLevel: 'High'
      },
      {
        id: 'rec5',
        title: 'Journaling',
        category: 'Wellness',
        duration: 15,
        difficulty: 'Easy',
        description: 'Write down your thoughts, feelings, and goals for the day.',
        benefits: ['Emotional clarity', 'Stress reduction', 'Goal tracking'],
        imageUrl: 'https://via.placeholder.com/150?text=Journaling',
        mood: 'Reflective',
        energyLevel: 'Low'
      }
    ]
  },
  preferences: {
    categories: ['Wellness', 'Fitness', 'Learning', 'Creativity', 'Productivity'],
    selectedCategories: ['Wellness', 'Learning'],
    difficulty: 'Medium',
    minDuration: 15,
    maxDuration: 45,
    frequency: 'Daily',
    preferredMoods: ['Calm', 'Focused', 'Neutral'],
    preferredEnergyLevels: ['Low', 'Medium']
  },
  history: {
    completedActivities: [
      {
        id: 'act1',
        title: 'Morning Meditation',
        category: 'Wellness',
        date: '2025-05-09T08:30:00Z',
        duration: 15
      },
      {
        id: 'act2',
        title: 'Reading Session',
        category: 'Learning',
        date: '2025-05-08T19:00:00Z',
        duration: 30
      },
      {
        id: 'act3',
        title: 'Jogging',
        category: 'Fitness',
        date: '2025-05-07T17:30:00Z',
        duration: 25
      }
    ]
  },
  tasks: {
    tasks: [
      {
        id: 'task1',
        title: 'Complete Project Proposal',
        due: '2025-05-15T23:59:59Z',
        priority: 'High',
        completed: false
      },
      {
        id: 'task2',
        title: 'Weekly Team Meeting',
        due: '2025-05-12T14:00:00Z',
        priority: 'Medium',
        completed: false
      }
    ]
  }
};

// Add request interceptor to include auth token in headers
instance.interceptors.request.use(
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

// Add response interceptor to handle responses and errors
instance.interceptors.response.use(
  (response) => {
    // Return just the data from the response
    return response.data;
  },
  async (error) => {
    // Handle response errors
    let errorMessage = 'An unknown error occurred';
    
    if (error.response) {
      // Server responded with non-2xx status
      console.error('Response error:', error.response.data);
      errorMessage = error.response.data.message || error.response.data.error || `Error ${error.response.status}: ${error.response.statusText}`;
      
      // In development, use mock data if API endpoint doesn't exist
      if (process.env.NODE_ENV === 'development' && error.response.status === 404) {
        console.log('🔶 API endpoint not found - returning mock data');
        
        try {
          const mockResponse = await getMockData(error.config.url, error.config.method);
          return mockResponse;
        } catch (mockError) {
          console.error('Error generating mock data:', mockError);
          return Promise.reject({
            success: false,
            error: 'Failed to generate mock data'
          });
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request error - no response received:', error.request);
      errorMessage = 'No response from server. Please check your connection.';
      
      // For network errors in development, also use mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('🔶 Network error - returning mock data');
        
        try {
          const mockResponse = await getMockData(error.config.url, error.config.method);
          return mockResponse;
        } catch (mockError) {
          console.error('Error generating mock data:', mockError);
          return Promise.reject({
            success: false,
            error: 'Failed to generate mock data'
          });
        }
      }
    } else {
      // Error in setting up the request
      console.error('Error setting up request:', error.message);
      errorMessage = error.message;
    }
    
    return Promise.reject({
      success: false,
      error: errorMessage
    });
  }
);

/**
 * Get mock data for development when API endpoints don't exist
 * @param {string} url - API endpoint URL
 * @param {string} method - HTTP method
 * @returns {Promise<Object>} Mock data
 */
async function getMockData(url, method) {
  // Simulate network delay (shorter to improve UX in development)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Normalize method
  method = (method || 'get').toLowerCase();
  
  // Parse the URL to determine the endpoint
  const urlPath = url.replace(/^\/?api\//, ''); // Remove /api/ prefix if it exists
  const urlParts = urlPath.split('?')[0].split('/').filter(Boolean);
  const endpoint = urlParts.join('/');
  
  // Parse query parameters for filtering mock data
  const queryParams = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }
  
  // Process specific endpoints with IDs
  if (urlParts.length > 1) {
    const [baseEndpoint, id, action] = urlParts;
    
    // Handle recommendations with IDs
    if (baseEndpoint === 'recommendations' && id) {
      // Feedback for a specific recommendation
      if (action === 'feedback') {
        return { 
          success: true, 
          message: `Feedback for recommendation ${id} submitted successfully` 
        };
      }
    }
    
    // Handle tasks with IDs
    if (baseEndpoint === 'tasks' && id) {
      // Mark task as complete
      if (action === 'complete') {
        return { 
          success: true, 
          message: `Task ${id} marked as complete` 
        };
      }
    }
  }
  
  // Generate mock data based on the endpoint and method
  switch (endpoint) {
    case 'recommendations':
      // Filter recommendations based on query parameters
      let filteredTasks = [...mockDataStore.recommendations.recommendedTasks];
      
      // Apply filters if provided
      if (Object.keys(queryParams).length > 0) {
        filteredTasks = filteredTasks.filter(task => {
          // Check each filter parameter
          for (const [param, value] of Object.entries(queryParams)) {
            // Skip 'all' values
            if (value === 'all') continue;
            
            // Handle different types of filters
            switch (param) {
              case 'category':
                if (task.category !== value) return false;
                break;
              case 'difficulty':
                if (task.difficulty !== value) return false;
                break;
              case 'duration':
                if (value === 'short' && (task.duration < 5 || task.duration > 15)) return false;
                if (value === 'medium' && (task.duration < 15 || task.duration > 30)) return false;
                if (value === 'long' && task.duration < 30) return false;
                break;
              case 'mood':
                if (task.mood !== value) return false;
                break;
              case 'energyLevel':
                if (task.energyLevel !== value) return false;
                break;
              case 'timeAvailable':
                const minutes = parseInt(value, 10);
                if (!isNaN(minutes) && task.duration > minutes) return false;
                break;
            }
          }
          return true;
        });
      }
      
      return { 
        success: true,
        recommendedTasks: filteredTasks
      };
    
    case 'recommendations/selections':
      if (method === 'post') {
        return { 
          success: true, 
          message: 'Your selections have been saved'
        };
      } else {
        return { 
          success: true,
          selections: [
            { id: 'rec1', dateSelected: '2025-05-08T14:30:00Z' },
            { id: 'rec4', dateSelected: '2025-05-09T09:15:00Z' }
          ]
        };
      }
    
    case 'recommendations/preferences':
      if (method === 'put') {
        return { success: true, message: 'Preferences updated successfully' };
      } else {
        return { 
          success: true,
          ...mockDataStore.preferences
        };
      }
    
    case 'recommendations/history':
      return { 
        success: true,
        ...mockDataStore.history
      };
    
    case 'tasks':
      if (method === 'post') {
        return { success: true, message: 'Tasks added successfully' };
      } else {
        return { 
          success: true,
          ...mockDataStore.tasks
        };
      }
    
    default:
      console.warn(`No mock data available for endpoint: ${endpoint}`);
      return { 
        success: false, 
        error: `No mock data available for endpoint: ${endpoint}`
      };
  }
}

// For direct use in development
if (process.env.NODE_ENV === 'development') {
  instance.getMockData = getMockData;
}

export default instance;