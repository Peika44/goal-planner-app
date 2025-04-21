import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token is found
        return;
      }
      try {
        const response = await axios.get('/goals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGoals(response.data);
      } catch (error) {
        // Check for 401 Unauthorized
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized. Please log in again.');
          localStorage.removeItem('token'); // Clear token if expired or invalid
          navigate('/'); // Redirect to login page
        } else {
          console.error('Error fetching goals', error);
        }
      }
    };

    fetchGoals();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard!</h2>
      <h3>Your Goals:</h3>
      <ul>
        {goals.length > 0 ? (
          goals.map((goal) => <li key={goal._id}>{goal.name}</li>)
        ) : (
          <p>No goals found. Create some goals!</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
