import React from 'react'
import ReactDOM from 'react-dom/client'
import SignUp from './SignUp.jsx'
import './index.css'
import civixFavicon from './assets/Civix Technology Consultancy Logo.png'

// Set favicon using the specified Civix logo
const existingFavicon = document.querySelector("link[rel='icon']")
const favicon = existingFavicon || document.createElement('link')
favicon.setAttribute('rel', 'icon')
favicon.setAttribute('type', 'image/png')
favicon.setAttribute('href', civixFavicon)
if (!existingFavicon) {
  document.head.appendChild(favicon)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SignUp />
  </React.StrictMode>,
)