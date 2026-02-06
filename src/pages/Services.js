import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiDroplet, FiCpu, FiZap, FiPackage } from 'react-icons/fi';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Custom Formulations',
      description: 'Tailored chemical solutions designed to meet your specific industrial requirements with precision and reliability.',
      icon: <FiDroplet />,
      features: ['Lab-tested formulas', 'Fast turnaround', 'Full documentation']
    },
    {
      id: 2,
      title: 'Technical Consulting',
      description: 'Deep expertise to optimize your chemical processes, improve efficiency, and reduce environmental impact.',
      icon: <FiCpu />,
      features: ['Process optimization', 'Cost reduction', 'Compliance support']
    },
    {
      id: 3,
      title: 'Sustainable Manufacturing',
      description: 'End-to-end sustainable chemistry solutions that maintain quality while reducing carbon footprint.',
      icon: <FiZap />,
      features: ['Green processes', 'Quality assurance', 'Safety certified']
    },
    {
      id: 4,
      title: 'Supply Chain Management',
      description: 'Reliable, resilient logistics and inventory solutions ensuring consistent product availability.',
      icon: <FiPackage />,
      features: ['On-time delivery', 'Inventory tracking', 'Global reach']
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Assessment',
      description: 'In-depth analysis of your current processes, needs, and compliance requirements.'
    },
    {
      number: '02',
      title: 'Solution Design',
      description: 'Custom formulation and implementation strategy tailored to your operations.'
    },
    {
      number: '03',
      title: 'Testing & Validation',
      description: 'Rigorous QA testing ensures reliability, safety, and performance standards.'
    },
    {
      number: '04',
      title: 'Deployment & Support',
      description: 'Seamless integration with ongoing technical support and optimization.'
    }
  ];

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="services-hero-content">
          <div className="hero-glass-panel">
            <span className="hero-eyebrow">Our Expertise</span>
            <h1 className="hero-title">Premium Chemical Solutions</h1>
            <p className="hero-subtitle">Advanced formulations for industrial excellence and sustainable growth</p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn-hero btn-hero-primary">
                Request Consultation <FiArrowRight />
              </Link>
              <Link to="/about" className="btn-hero btn-hero-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Comprehensive Chemical Services</h2>
            <p className="section-description">
              Industry-leading solutions from consultation to supply, backed by decades of expertise and innovation.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-features">
                  {service.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <FiCheck />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="process-overlay"></div>
        <div className="container">
          <div className="process-header glass-panel">
            <h2 className="section-title">How We Work</h2>
            <p className="section-description">
              A structured approach ensuring quality, compliance, and success at every step.
            </p>
          </div>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div key={index} className="process-card glass-panel">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="services-cta-overlay"></div>
        <div className="container">
          <div className="cta-glass-panel">
            <h2>Ready to elevate your chemical manufacturing?</h2>
            <p>
              Connect with our experts to explore custom solutions aligned with your business
              goals and compliance requirements.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-hero btn-hero-primary">
                Schedule Consultation <FiArrowRight />
              </Link>
              <Link to="/products" className="btn-hero btn-hero-secondary">
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;