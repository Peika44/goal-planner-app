# Goal Planner App

A sleek, Apple-inspired goal tracking and task management application to help you achieve your personal and professional goals with elegance.

![Goal Planner App Screenshot](./screenshots/dashboard.png)

## Features

- **Elegant Apple-style Design**: Clean, minimalist interface with frosted glass effects and subtle animations
- **Goal Management**: Create, track, and complete goals across different categories
- **Task Management**: Break down goals into manageable tasks with progress tracking
- **AI-Powered Planning**: Generate personalized tasks automatically based on your goals
- **Dashboard**: Get an at-a-glance view of your progress and priorities
- **User Authentication**: Secure login, registration, and profile management
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

## Tech Stack

### Frontend

- **React**: UI library for building the user interface
- **React Router**: For navigation and routing
- **CSS**: Custom Apple-inspired design system
- **Context API**: For state management

### Backend

- **Node.js/Express**: Server and API implementation
- **MongoDB**: Database for storing user data, goals, and tasks
- **JWT**: For secure authentication
- **AI Integration**: Task generation capabilities

Backend repository: [Goal Planner App Backend](https://github.com/Peika44/goal-planner-app-backend)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the frontend repository
   ```bash
   git clone [https://github.com/](https://github.com/)[your-username]/goal-planner-app.git
   cd goal-planner-app
Install dependencies

Bash

npm install
Clone the backend repository

Bash

git clone [https://github.com/Peika44/goal-planner-app-backend.git](https://github.com/Peika44/goal-planner-app-backend.git)
cd goal-planner-app-backend
Install backend dependencies

Bash

npm install
Configure environment variables

Create a .env file in the backend directory
Set the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_service_key (if applicable)
Start the backend server

Bash

cd goal-planner-app-backend
npm run dev
Start the frontend development server

Bash

cd goal-planner-app
npm start
Open your browser and navigate to http://localhost:3000

Usage
Creating an Account
Navigate to the Sign Up page
Enter your name, email, and password
Click "Sign Up" to create your account
Creating Goals
Navigate to the Goals page
Click the "New Goal" button
Fill in the goal details (title, description, category, priority, target date)
Optionally enable AI assistance to generate tasks
Click "Create Goal"
Managing Tasks
Open a goal from the Goals page
View existing tasks or add new ones
Check off tasks as you complete them
Track your overall progress toward the goal
Using the Dashboard
The Dashboard provides a quick overview of:

Your active and completed goals
Today's tasks
Overall completion rate
Overdue tasks that need attention
Proposed Greeting on the Dashboard:

To add a greeting, you could modify the Dashboard component in your React frontend. A common place to include it would be at the top of the main content area.

JavaScript

// Inside your Dashboard component (e.g., src/pages/Dashboard.js)

import React, { useState, useEffect } from 'react';
// ... other imports

function Dashboard() {
  const [userName, setUserName] = useState(''); // Or fetch from context/API

  useEffect(() => {
    // Example: Fetch user data on component mount
    const fetchUserData = async () => {
      // Replace with your actual API call to get user data
      const userData = { name: 'John Doe' }; // Mock data
      setUserName(userData.name);
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      {userName && <h2 className="greeting">Hello, {userName} 👋</h2>}
      {/* ... rest of your dashboard content ... */}
    </div>
  );
}

export default Dashboard;
You would then need to style the .greeting class in your CSS to fit the overall aesthetic.

Application Structure
goal-planner-app/
├── public/                # Static files
├── src/
│   ├── api/               # API service functions
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI elements
│   ├── context/           # React context providers
│   ├── pages/             # Application pages
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
└── README.md              # This file
Customization
Theming
The application uses a custom CSS design system inspired by Apple's design language. You can modify the CSS files to adjust colors, typography, and other visual elements to further customize the theme.