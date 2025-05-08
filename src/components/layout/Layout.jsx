import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Function to check if a nav item is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 bg-blue-800 text-white w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Goal Tracker</span>
          </div>
          <button 
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar content */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive('/dashboard') 
                ? 'bg-blue-700 text-white' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          
          <Link 
            to="/goals" 
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive('/goals') 
                ? 'bg-blue-700 text-white' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Goals
          </Link>
          
          <Link 
            to="/profile" 
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive('/profile') 
                ? 'bg-blue-700 text-white' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
        </nav>
        
        {/* User menu */}
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                {currentUser?.firstName?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : currentUser?.username}
              </p>
              <button 
                onClick={handleLogout}
                className="text-xs text-blue-300 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Top navbar */}
        <div className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  type="button"
                  className="md:hidden px-4 text-gray-500 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;