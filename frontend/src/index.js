import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind is imported here, so no need for CDN
import App from './App';

// Remove any old service worker registration attempts

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
