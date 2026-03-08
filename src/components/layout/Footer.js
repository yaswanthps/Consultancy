import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <FiSun className="footer-logo-icon" />
            <span className="footer-logo-text">SurfauxDyeChem</span>
          </div>
          <p className="footer-description">
            Premium chemical manufacturing partner delivering safe, compliant, and sustainable
            solutions for industrial clients worldwide.
          </p>
          <div className="footer-social">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiFacebook />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <div className="footer-links">
            <Link to="/about" className="footer-link">About Us</Link>
            {/* <Link to="/services" className="footer-link">Our Services</Link> */}
            <Link to="/products" className="footer-link">Products</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Services</h3>
          <div className="footer-links">
            <span className="footer-link">Custom Formulations</span>
            <span className="footer-link">Quality & Compliance</span>
            <span className="footer-link">Sustainable Processes</span>
            <span className="footer-link">Supply Optimization</span>
            <span className="footer-link">Technical Consulting</span>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Info</h3>
          <div className="footer-contact">
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <span> Plot No.18,19, Moraji Desai Nagar,
          Chettipalayam, Gandhi Nagar Post,
          Tiruppur – 641603</span>
            </div>
            <div className="contact-item">
              <FiPhone className="contact-icon" />
              <span>+91 93444 53519</span>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>erca@surfauxdye.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} SurfauxDyeChem. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span className="footer-bottom-link">Privacy Policy</span>
            <span className="footer-bottom-link">Terms of Service</span>
            <span className="footer-bottom-link">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;