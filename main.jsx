import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import posterImage from './assets/poster.jpg'
import './index.css'

const faviconLink =
  document.querySelector("link[rel='icon']") || document.createElement('link')

faviconLink.setAttribute('rel', 'icon')
faviconLink.setAttribute('type', 'image/jpg')
faviconLink.setAttribute('href', posterImage)

if (!faviconLink.parentNode) {
  document.head.appendChild(faviconLink)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
