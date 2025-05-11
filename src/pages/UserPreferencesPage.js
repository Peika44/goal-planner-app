// UserPreferencesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPreferences, updateUserPreferences } from '../api/userApi';
import { useToast } from '../components/ui/Toast';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import './UserPreferences.css'; // You'll need to create this CSS file

const CATEGORY_LABELS = {
  study: 'Study',
  entertainment: 'Entertainment',
  physical: 'Physical Activity',
  personal: 'Personal Development',
  errands: 'Errands'
};

const UserPreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    study: [],
    entertainment: [],
    physical: [],
    personal: [],
    errands: []
  });
  const [schedule, setSchedule] = useState({
    weekday: {},
    weekend: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  
  // Available tags for each category
  const availableTags = {
    study: [
      'mathematics', 'science', 'history', 'literature', 'language', 
      'programming', 'art', 'research', 'writing', 'reading'
    ],
    entertainment: [
      'movies', 'tv-shows', 'music', 'games', 'books', 
      'podcasts', 'social', 'cooking', 'crafts', 'outdoors'
    ],
    physical: [
      'cardio', 'strength', 'yoga', 'sports', 'walking', 
      'running', 'cycling', 'swimming', 'dance', 'stretching'
    ],
    personal: [
      'meditation', 'journaling', 'goal-setting', 'learning', 'skill-development',
      'career', 'finances', 'organization', 'self-care', 'creativity'
    ],
    errands: [
      'shopping', 'cleaning', 'organizing', 'maintenance', 'planning',
      'cooking', 'paperwork', 'appointments', 'communication', 'travel'
    ]
  };
  
  // Time slots for schedule
  const timeSlots = [
    'Early Morning (5am-8am)',
    'Morning (8am-12pm)',
    'Afternoon (12pm-5pm)',
    'Evening (5pm-9pm)',
    'Night (9pm-12am)'
  ];
  
  // Energy level options
  const energyLevels = ['Low', 'Medium', 'High'];
  
  // Load user preferences
  useEffect(() => {
    fetchPreferences();
  }, []);
  
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserPreferences();
      
      if (response.success) {
        const { data } = response;
        
        // Format preferences data for component state
        setPreferences({
          study: data.interests?.study || [],
          entertainment: data.interests?.entertainment || [],
          physical: data.interests?.physical || [],
          personal: data.interests?.personal || [],
          errands: data.interests?.errands || []
        });
        
        setSchedule({
          weekday: data.schedule?.weekday || {},
          weekend: data.schedule?.weekend || {}
        });
      } else {
        setError(response.error || 'Failed to load preferences');
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('An unexpected error occurred while loading your preferences');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle tag selection/deselection
  const handleTagToggle = (category, tag) => {
    setPreferences(prev => {
      const categoryTags = [...prev[category]];
      
      if (categoryTags.includes(tag)) {
        // Remove tag if already selected
        return {
          ...prev,
          [category]: categoryTags.filter(t => t !== tag)
        };
      } else {
        // Add tag if not selected
        return {
          ...prev,
          [category]: [...categoryTags, tag]
        };
      }
    });
  };
  
  // Handle energy level selection for time slot
  const handleEnergyLevelChange = (dayType, timeSlot, level) => {
    setSchedule(prev => ({
      ...prev,
      [dayType]: {
        ...prev[dayType],
        [timeSlot]: level
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Format data for API
      const preferencesData = {
        interests: preferences,
        schedule
      };
      
      const response = await updateUserPreferences(preferencesData);
      
      if (response.success) {
        toast.success('Preferences saved successfully!');
      } else {
        toast.error('Failed to save preferences: ' + response.error);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      toast.error('An error occurred while saving your preferences');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-title-group">
          <Link to="/recommendations" className="dashboard-back-link">
            <svg className="dashboard-back-icon" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Recommendations
          </Link>
          <h1 className="dashboard-title">Preferences Settings</h1>
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <Link 
          to="/recommendations" 
          className="dashboard-tab"
        >
          Get Recommendations
        </Link>
        <Link 
          to="/recommendations/preferences" 
          className="dashboard-tab dashboard-tab-active"
        >
          My Preferences
        </Link>
        <Link 
          to="/recommendations/history" 
          className="dashboard-tab"
        >
          Activity History
        </Link>
      </div>
      
      <div className="dashboard-panel">
        {loading ? (
          <div className="dashboard-loading-center">
            <div className="dashboard-loading-spinner"></div>
            <p className="dashboard-loading-text">Loading your preferences...</p>
          </div>
        ) : error ? (
          <ErrorDisplay 
            message={error} 
            onRetry={fetchPreferences}
            inline={false}
          />
        ) : (
          <div className="preferences-container">
            <form onSubmit={handleSubmit} className="preferences-form">
              {/* Interests Section */}
              <div className="preferences-section">
                <h2 className="preferences-section-title">Interests & Topics</h2>
                <p className="preferences-section-description">
                  Select topics you're interested in for each category
                </p>
                
                {Object.keys(CATEGORY_LABELS).map(category => (
                  <div key={category} className="preferences-category">
                    <h3 className="preferences-category-title">{CATEGORY_LABELS[category]}</h3>
                    
                    <div className="preferences-tags">
                      {availableTags[category].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          className={`preferences-tag ${preferences[category].includes(tag) ? 'preferences-tag-selected' : ''}`}
                          onClick={() => handleTagToggle(category, tag)}
                        >
                          {tag.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Schedule & Energy Section */}
              <div className="preferences-section">
                <h2 className="preferences-section-title">Schedule & Energy Levels</h2>
                <p className="preferences-section-description">
                  Tell us when you're typically available and your energy levels throughout the day
                </p>
                
                <div className="preferences-schedule">
                  <div className="preferences-schedule-column">
                    <h3 className="preferences-schedule-title">Weekdays</h3>
                    
                    <table className="preferences-schedule-table">
                      <thead>
                        <tr>
                          <th>Time Slot</th>
                          <th>Energy Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(slot => (
                          <tr key={slot}>
                            <td>{slot}</td>
                            <td>
                              <div className="preferences-energy-levels">
                                {energyLevels.map(level => (
                                  <button
                                    key={level}
                                    type="button"
                                    className={`preferences-energy-button ${schedule.weekday[slot] === level ? 'preferences-energy-selected' : ''} preferences-energy-${level.toLowerCase()}`}
                                    onClick={() => handleEnergyLevelChange('weekday', slot, level)}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="preferences-schedule-column">
                    <h3 className="preferences-schedule-title">Weekends</h3>
                    
                    <table className="preferences-schedule-table">
                      <thead>
                        <tr>
                          <th>Time Slot</th>
                          <th>Energy Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(slot => (
                          <tr key={slot}>
                            <td>{slot}</td>
                            <td>
                              <div className="preferences-energy-levels">
                                {energyLevels.map(level => (
                                  <button
                                    key={level}
                                    type="button"
                                    className={`preferences-energy-button ${schedule.weekend[slot] === level ? 'preferences-energy-selected' : ''} preferences-energy-${level.toLowerCase()}`}
                                    onClick={() => handleEnergyLevelChange('weekend', slot, level)}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="preferences-submit">
                <button
                  type="submit"
                  className="preferences-submit-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="preferences-submit-spinner"></div>
                      Saving...
                    </>
                  ) : 'Save Preferences'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferencesPage;