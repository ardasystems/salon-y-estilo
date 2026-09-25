import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MainApp } from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  </StrictMode>,
)
