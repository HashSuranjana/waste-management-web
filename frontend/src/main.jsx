/**
 * Main Entry Point
 * 
 * This is the main entry point for the waste management system application.
 * It renders the root App component into the DOM and sets up any global providers
 * or configurations needed for the application to run.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create root and render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
