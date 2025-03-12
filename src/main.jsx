import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import 'aos/dist/aos.css'
import AOS from 'aos'


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
    <Main />
    <Toaster />
  </React.StrictMode>,
)
