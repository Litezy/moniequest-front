import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!clientId) {
  console.error('Google Client ID is missing. Please check your .env file.');
}

function Main() {
  useEffect(() => {
    AOS.init({
      once: false
    })
  }, [])
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <Main />
    <Toaster />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
