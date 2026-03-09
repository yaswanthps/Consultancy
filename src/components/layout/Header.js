import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

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
    // { path: '/services', label: 'Services' }, // Hidden as requested by user
    { path: '/products', label: 'About Products' },
    { path: '/buy-products', label: 'Buy Products' },
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
            <Link to="/cart" className={`nav-link cart-icon-link ${location.pathname === '/cart' ? 'active' : ''}`}>
              <FiShoppingCart className="cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button className="nav-link logout-btn" onClick={onLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'inherit', fontSize: '1rem', fontWeight: '500' }}>
              <FiLogOut /> Log Out
            </button>
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
          <Link
            to="/cart"
            className={`nav-link-mobile ${location.pathname === '/cart' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cart ({cartCount})
          </Link>
          <button
            className="nav-link-mobile"
            onClick={() => {
              setIsMenuOpen(false);
              onLogout && onLogout();
            }}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'red' }}
          >
            <FiLogOut /> Log Out
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;