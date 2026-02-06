import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { services } from '../data/mockData';
import './Services.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find((s) => String(s.id) === String(id));

  if (!service) {
    return (
      <div className="services service-detail">
        <section className="services-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Service Not Found</h1>
              <p className="hero-description">
                The service you are looking for does not exist or may have been moved.
              </p>
              <Link to="/services" className="btn btn-primary">
                <FiArrowLeft /> Back to Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="services service-detail">
      <section className="services-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{service.title}</h1>
            <p className="hero-description">{service.description}</p>
            <Link to="/services" className="btn btn-outline">
              <FiArrowLeft /> Back to all services
            </Link>
          </div>
          <div className="hero-image">
            <img src={service.image} alt={service.title} />
          </div>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="container">
          <div className="service-card">
            <div className="service-content">
              <h3 className="service-title">Key Features</h3>
              <div className="service-features">
                {service.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <FiCheck className="feature-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
