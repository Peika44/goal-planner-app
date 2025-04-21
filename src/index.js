import React from 'react';
import ReactDOM from 'react-dom/client'; // Use `react-dom/client` in React 18+
import App from './App';
import { BrowserRouter } from 'react-router-dom'; 

// Create root element for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your app
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
