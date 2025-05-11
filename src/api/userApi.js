// api/userApi.js
import { apiRequest, get, post, put, patch, del, createApiUrl } from '../utils/apiUtils';

/**
 * Get current user's profile information
 * 
 * @returns {Promise<Object>} - Standardized response with user data
 */
export const getUserProfile = async () => {
  try {
    return await get(createApiUrl('/user/profile'));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user profile'
    };
  }
};

/**
 * Update current user's profile information
 * 
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Standardized response with updated user data
 */
export const updateUserProfile = async (profileData) => {
  try {
    return await put(createApiUrl('/user/profile'), profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user profile'
    };
  }
};

/**
 * Get user preferences for the recommendation engine
 * 
 * @returns {Promise<Object>} - Standardized response with user preferences
 */
export const getUserPreferences = async () => {
  try {
    return await get(createApiUrl('/user/preferences'));
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user preferences'
    };
  }
};

/**
 * Update user preferences for the recommendation engine
 * 
 * @param {Object} preferencesData - Updated preferences data
 * @param {Object} preferencesData.interests - User interests by category
 * @param {Array} preferencesData.interests.study - Study interests/tags
 * @param {Array} preferencesData.interests.entertainment - Entertainment interests/tags
 * @param {Array} preferencesData.interests.physical - Physical activity interests/tags
 * @param {Array} preferencesData.interests.personal - Personal development interests/tags
 * @param {Array} preferencesData.interests.errands - Errands interests/tags
 * @param {Object} preferencesData.schedule - Typical schedule with energy levels
 * @param {Object} preferencesData.schedule.weekday - Weekday schedule
 * @param {Object} preferencesData.schedule.weekend - Weekend schedule
 * @returns {Promise<Object>} - Standardized response with success/error
 */
export const updateUserPreferences = async (preferencesData) => {
  try {
    return await put(createApiUrl('/user/preferences'), preferencesData);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user preferences'
    };
  }
};

/**
 * Change user's password
 * 
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} - Standardized response with success/error
 */
export const changePassword = async (passwordData) => {
  try {
    return await post(createApiUrl('/user/change-password'), passwordData);
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error: error.message || 'Failed to change password'
    };
  }
};

/**
 * Get user's notification settings
 * 
 * @returns {Promise<Object>} - Standardized response with notification settings
 */
export const getNotificationSettings = async () => {
  try {
    return await get(createApiUrl('/user/notifications/settings'));
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch notification settings'
    };
  }
};

/**
 * Update user's notification settings
 * 
 * @param {Object} settingsData - Updated notification settings
 * @returns {Promise<Object>} - Standardized response with success/error
 */
export const updateNotificationSettings = async (settingsData) => {
  try {
    return await put(createApiUrl('/user/notifications/settings'), settingsData);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return {
      success: false,
      error: error.message || 'Failed to update notification settings'
    };
  }
};

/**
 * Get user's recent activity (tasks, goals, recommendations)
 * 
 * @param {Object} [params] - Optional parameters
 * @param {number} [params.limit=20] - Maximum number of records to return
 * @param {number} [params.offset=0] - Number of records to skip (for pagination)
 * @returns {Promise<Object>} - Standardized response with activity data
 */
export const getUserActivity = async (params = {}) => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = createApiUrl(`/user/activity${queryString ? `?${queryString}` : ''}`);
    
    return await get(url);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user activity'
    };
  }
};