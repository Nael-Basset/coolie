import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Suppression du code problématique qui essaie de charger Leaflet
// avant que les modules soient installés

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/coolie">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
