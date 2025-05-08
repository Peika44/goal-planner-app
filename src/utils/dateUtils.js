// utils/dateUtils.js
/**
 * Format date to display in a human-readable format
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };
  
  /**
   * Calculate the number of days between two dates
   * @param {Date|string} startDate - The start date
   * @param {Date|string} endDate - The end date (defaults to current date)
   * @returns {number} Number of days
   */
  export const daysBetween = (startDate, endDate = new Date()) => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(end - start);
    
    // Convert to days
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  /**
   * Get a relative time string (e.g., "2 days ago", "in 3 months")
   * @param {Date|string} date - The date to format
   * @returns {string} Relative time string
   */
  export const getRelativeTimeString = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((dateObj - now) / 1000);
    
    // Convert to appropriate unit
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
    }
  };
  
  /**
   * Check if a date is in the past
   * @param {Date|string} date - The date to check
   * @returns {boolean} True if the date is in the past
   */
  export const isDatePast = (date) => {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    return dateObj < now;
  };
  
  /**
   * Format a date as an ISO string (YYYY-MM-DD)
   * @param {Date|string} date - The date to format
   * @returns {string} Formatted date string
   */
  export const formatISODate = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toISOString().split('T')[0];
  };
  
  /**
   * Get start and end dates for a timeframe relative to today
   * @param {string} timeframe - The timeframe (week, month, quarter, halfYear, year)
   * @returns {Object} Object containing start and end dates
   */
  export const getTimeframeDates = (timeframe) => {
    const now = new Date();
    const start = new Date();
    let end = new Date();
    
    switch (timeframe) {
      case 'week':
        end.setDate(now.getDate() + 7);
        break;
      case 'month':
        end.setMonth(now.getMonth() + 1);
        break;
      case 'quarter':
        end.setMonth(now.getMonth() + 3);
        break;
      case 'halfYear':
        end.setMonth(now.getMonth() + 6);
        break;
      case 'year':
        end.setFullYear(now.getFullYear() + 1);
        break;
      default:
        end.setMonth(now.getMonth() + 1); // Default to 1 month
    }
    
    return {
      start: start,
      end: end
    };
  };