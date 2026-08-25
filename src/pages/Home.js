import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiGlobe, FiDroplet, FiCpu } from 'react-icons/fi';
import Slider from 'react-slick';
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

  const applicationsData = [
    {
      id: 1,
      title: 'Interior Textile',
      description: 'Color-stable chemistries for furniture and interior fabrics.',
      icon: '🛋️'
    },
    {
      id: 2,
      title: 'Workwear',
      description: 'Highly durable, high fastness systems for industrial and protective wear.',
      icon: '🧥'
    },
    {
      id: 3,
      title: 'Home Textile',
      description: 'High-performance, soft-feel finishes for bed linen, towels and home fabrics.',
      icon: '🛏️'
    },
    {
      id: 4,
      title: 'Sportswear',
      description: 'Moisture-management and advanced performance solutions!',
      icon: '💧'
    }
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 850,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };



  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-left">

            <span className="home-hero-eyebrow">BRIDGING MANUFACTURERS. DELIVERING SUSTAINABLE CHEMISTRY.</span>
            <h1 className="home-hero-title">
              Connecting businesses with advanced Chemistry for a
              <span className="home-hero-highlight"> Sustainable Future</span>
            </h1>
            <p className="home-hero-subtitle">
              Trusted by customers for reliable and sustainable chemical solutions for a better productivity and profitability.
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
          </div>
        </div>
      </section>

      <section className="home-applications">
        <div className="container">
          <h2 className="applications-title">APPLICATIONS</h2>
          <div className="carousel-wrapper">
            <Slider {...sliderSettings}>
              {applicationsData.map(app => (
                <div key={app.id} className="app-slide-wrapper">
                  <div className="app-slide">
                    <div className="app-icon">{app.icon}</div>
                    <h3 className="app-title">{app.title}</h3>
                    <p className="app-description">{app.description}</p>
                  </div>
                </div>
              ))}
            </Slider>
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
