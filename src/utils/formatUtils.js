// utils/formatUtils.js
/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  /**
   * Format a number with commas as thousands separators
   * @param {number} num - The number to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (num) => {
    if (num === undefined || num === null) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  /**
   * Truncate a string to a specified length and add ellipsis
   * @param {string} str - The string to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated string
   */
  export const truncateString = (str, length = 100) => {
    if (!str) return '';
    if (str.length <= length) return str;
    
    return str.slice(0, length) + '...';
  };
  
  /**
   * Convert a duration in minutes to a readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration
   */
  export const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return '';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
    }
  };
  
  /**
   * Convert a timeframe to a readable format
   * @param {string} timeframe - The timeframe (week, month, quarter, halfYear, year)
   * @returns {string} Readable timeframe
   */
  export const formatTimeframe = (timeframe) => {
    switch (timeframe) {
      case 'week':
        return '1 Week';
      case 'month':
        return '1 Month';
      case 'quarter':
        return '3 Months';
      case 'halfYear':
        return '6 Months';
      case 'year':
        return '1 Year';
      default:
        return capitalizeFirstLetter(timeframe || '');
    }
  };
  
  /**
   * Convert a goal category to a readable format
   * @param {string} category - The category (personal, professional, health, etc.)
   * @returns {string} Readable category name
   */
  export const formatCategory = (category) => {
    const categories = {
      personal: 'Personal Development',
      professional: 'Professional',
      health: 'Health & Fitness',
      education: 'Education',
      finance: 'Financial',
      social: 'Social & Relationships',
      other: 'Other'
    };
    
    return categories[category] || capitalizeFirstLetter(category || '');
  };
  
  /**
   * Get appropriate CSS class for a category
   * @param {string} category - The category
   * @returns {string} CSS class name
   */
  export const getCategoryColorClass = (category) => {
    const colorMap = {
      personal: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800',
      health: 'bg-green-100 text-green-800',
      education: 'bg-yellow-100 text-yellow-800',
      finance: 'bg-indigo-100 text-indigo-800',
      social: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };
  
  /**
   * Get appropriate CSS class for difficulty level
   * @param {string} difficulty - The difficulty level (easy, medium, hard)
   * @returns {string} CSS class name
   */
  export const getDifficultyColorClass = (difficulty) => {
    const colorMap = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    
    return colorMap[difficulty] || 'bg-gray-100 text-gray-800';
  };