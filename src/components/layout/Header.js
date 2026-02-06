import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun } from 'react-icons/fi';
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
    { path: '/services', label: 'Services' },
    { path: '/products', label: 'Products' },
    { path: '/contact', label: 'Contact' }
  ];

  const isHome = location.pathname === '/';
  const headerClassName = `header ${isHome ? 'header--transparent' : 'header--solid'} ${isScrolled ? 'scrolled' : ''}`;

  return (
    <header className={headerClassName}>
      <nav className="nav">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <FiSun className="logo-icon" />
            <span className="logo-text"> SurfauxDyeChem</span>
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
            <Link to="/contact" className="nav-cta">
              Get a Quote
            </Link>
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
          <Link to="/contact" className="nav-link-mobile nav-link-cta" onClick={() => setIsMenuOpen(false)}>
            Get a Quote
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;