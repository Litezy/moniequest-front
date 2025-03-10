import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdminPagesLinks, GeneralPagesLinks, AuthPagesLinks } from './utils/pageLinks';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AuthRoutes from './services/AuthRoutes';
import AdminRoutes from './services/AdminRoutes';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: false,
    });
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {GeneralPagesLinks.map((item, index) => (
            <Route key={index} path={item.path} element={<item.component />} />
          ))}
          {AuthPagesLinks.map((item, index) => (
            <Route key={index} path={item.path} element={<AuthRoutes><item.component /></AuthRoutes>} />
          ))}
          {AdminPagesLinks.map((item, index) => (
            <Route key={index} path={item.path} element={<AdminRoutes><item.component /></AdminRoutes>} />
          ))}
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;