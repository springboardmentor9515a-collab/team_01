import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
<<<<<<< HEAD
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
=======
import './index.css'  // <-- make sure this is here
import civixLogo from './assets/Civix Technology Consultancy Logo.png'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

// Set favicon to CIVIX logo
(() => {
  try {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'icon');
      document.head.appendChild(link);
    }
    link.setAttribute('type', 'image/png');
    link.setAttribute('href', civixLogo);
  } catch (e) {
    console.warn('Failed to set favicon:', e);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
>>>>>>> origin/main
