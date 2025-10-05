import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/home.jsx'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
