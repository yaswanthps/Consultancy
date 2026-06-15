import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },

    { path: '/products', label: 'About Products' },
    { path: '/contact', label: 'Contact' }
  ];

  const headerClassName = `header header--solid ${isScrolled ? 'scrolled' : ''}`;

  return (
    <header className={headerClassName}>
      <nav className="nav">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" style={{ padding: '0.5rem 0', maxWidth: '75vw' }}>
            <img src={logo} alt="SurfauxDyeChem Logo" className="logo-img" style={{ maxHeight: '45px', width: '100%', objectFit: 'contain', objectPosition: 'left' }} />
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="nav-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`nav-menu-mobile ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-mobile ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;