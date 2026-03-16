import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiGlobe, FiDroplet, FiCpu } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const features = [
    {
      id: 1,
      title: 'Advanced Chemical Solutions',
      description: 'High-performance formulations engineered for complex industrial requirements.',
      icon: <FiCpu />
    },
    {
      id: 2,
      title: 'Quality & Safety Compliance',
      description: 'Rigorous QA programs and certified processes for reliable, safe production.',
      icon: <FiShield />
    },
    {
      id: 3,
      title: 'Sustainable Manufacturing',
      description: 'Low-impact chemistry, energy efficiency, and responsible sourcing.',
      icon: <FiDroplet />
    },
    {
      id: 4,
      title: 'Global Supply Network',
      description: 'Consistent delivery backed by resilient logistics and partner ecosystems.',
      icon: <FiGlobe />
    }
  ];

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-left">
            {user && (
              <div className="welcome-message" style={{ marginBottom: '1rem', color: '#3498db', fontWeight: '600', fontSize: '1.2rem' }}>
                Welcome back, {user.name}!
              </div>
            )}
            <span className="home-hero-eyebrow">Precision manufacturing. Sustainable outcomes.</span>
            <h1 className="home-hero-title">
              Innovating Chemistry for a
              <span className="home-hero-highlight"> Sustainable Future</span>
            </h1>
            <p className="home-hero-subtitle">
              Trusted by industrial partners for safety, quality, and innovation across every batch.
            </p>
            <p className="home-hero-description">
              We deliver advanced chemical manufacturing with a focus on compliance, operational excellence, and eco-conscious performance.
            </p>
            <div className="home-hero-buttons">
              <Link to="/products" className="home-btn home-btn-primary">
                Explore Our Products <FiArrowRight />
              </Link>
              <Link to="/contact" className="home-btn home-btn-secondary">
                Contact Us
              </Link>
            </div>
            <div className="home-hero-highlights">
              <div className="hero-highlight">
                <span className="highlight-value">30+ Years</span>
                <span className="highlight-label">Manufacturing expertise</span>
              </div>
              <div className="hero-highlight">
                <span className="highlight-value">ISO 9001</span>
                <span className="highlight-label">Quality-led operations</span>
              </div>
              <div className="hero-highlight">
                <span className="highlight-value">Global Reach</span>
                <span className="highlight-label">Reliable supply network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container">
          <div className="home-section-header">

            <h2 className="section-title">Enterprise-ready chemistry for modern industry</h2>
            <p className="section-description">
              A premium, compliance-driven partner delivering performance, transparency, and sustainability.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container">
          <div className="home-cta-card">
            <div>
              <h2>Ready to scale sustainable chemistry?</h2>
              <p>
                Talk to our specialists about custom formulations, compliance requirements, and supply planning.
              </p>
            </div>
            <div className="home-cta-actions">
              <Link to="/contact" className="home-btn home-btn-primary">
                Get a Quote <FiArrowRight />
              </Link>
              <Link to="/about" className="home-btn home-btn-ghost">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
