import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = ({
  title,
  titleHighlight,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
  stats,
  className
}) => {
  return (
    <section
      className={`hero-section ${className || ''}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-badge">{subtitle}</div>
          <h1 className="hero-main-title">
            {title}
            {titleHighlight && <span className="hero-highlight">{titleHighlight}</span>}
          </h1>
          <p className="hero-description">{description}</p>

          <div className="hero-buttons">
            {primaryButtonLink && (
              primaryButtonLink.startsWith('#') ? (
                <a href={primaryButtonLink}
                  className="btn-hero btn-hero-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(primaryButtonLink);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {primaryButtonText} <FiArrowRight />
                </a>
              ) : (
                <Link to={primaryButtonLink} className="btn-hero btn-hero-primary">
                  {primaryButtonText} <FiArrowRight />
                </Link>
              )
            )}
            {secondaryButtonLink && (
              <Link to={secondaryButtonLink} className="btn-hero btn-hero-secondary">
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <div className="hero-right">
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-avatars">
                    {stat.avatars && stat.avatars.map((avatar, i) => (
                      <span key={i} className="avatar">{avatar}</span>
                    ))}
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
