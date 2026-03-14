import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Init dark theme
const savedTheme = localStorage.getItem('macro-theme') || 'dark';
document.documentElement.className = savedTheme;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
