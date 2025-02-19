import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DarkModeProvider } from './utils/DarkModeContext';
//import { SessionStorageProvider } from "./utils/SessionStorageContext";
import { AuthProvider } from './utils/AuthContext';
import { PermissionsProvider } from './utils/PermissionsContext';
import { AgentUIAuthProvider } from './utils/AgentUIAuthContext';
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <DarkModeProvider>
      <AuthProvider>
        <AgentUIAuthProvider>
        <PermissionsProvider>
      <App />
        </PermissionsProvider>
        </AgentUIAuthProvider>
      </AuthProvider>
  </DarkModeProvider>
  </StrictMode>,
)
