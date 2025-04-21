// pages/HomePage.jsx
import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Goal Buddy</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Plan, track, and achieve your goals with AI-powered guidance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default HomePage;