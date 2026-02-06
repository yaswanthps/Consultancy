import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <img 
              src="https://images.unsplash.com/photo-1558618666-e29c2c84c87c?w=600&h=400&fit=crop" 
              alt="Page not found"
              className="not-found-image"
            />
          </div>
          
          <div className="not-found-text">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
            <p className="not-found-description">
              The page you're looking for seems to have gone on a sustainable journey! 
              Don't worry, we can help you find what you need.
            </p>
            
            <div className="not-found-actions">
              <Link to="/" className="btn btn-primary">
                <FiHome /> Go Home
              </Link>
              <Link to="/" className="btn btn-outline">
                <FiArrowLeft /> Go Back
              </Link>
            </div>
            
            <div className="helpful-links">
              <h3>Popular Pages:</h3>
              <div className="links-grid">
                <Link to="/services" className="help-link">
                  <FiSearch /> Our Services
                </Link>
                <Link to="/about" className="help-link">
                  About Us
                </Link>
                <Link to="/projects" className="help-link">
                  Our Projects
                </Link>
                <Link to="/blog" className="help-link">
                  Latest Blog
                </Link>
                <Link to="/contact" className="help-link">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;