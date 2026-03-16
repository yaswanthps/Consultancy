import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`layout ${isHome ? 'layout--home' : ''}`}>
      <Header onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;