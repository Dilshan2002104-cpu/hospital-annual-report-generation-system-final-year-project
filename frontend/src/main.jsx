import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Cache bust for clinic prescriptions API fix - 2025-10-20 v3
createRoot(document.getElementById('root')).render(
  <App />
)
