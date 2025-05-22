
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// Critical CSS inlining - manually include most important styles
const criticalStyles = document.createElement('style');
criticalStyles.textContent = `
  body { background-color: hsl(210, 40%, 98%); }
  .book-card { position: relative; overflow: hidden; background-color: white; border-radius: 1rem; }
  .book-card-image { aspect-ratio: 3/4; width: 100%; object-fit: cover; border-radius: 0.5rem; }
`;
document.head.appendChild(criticalStyles);

// Improved error handling for root element
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

// Error boundary for the entire app
try {
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render the application:', error);
  // Display a user-friendly error message
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Sorry, something went wrong</h2>
        <p>The application failed to load. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}
