import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import HeroSection from '../components/HeroSection';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="contact">
      {/* Hero Section */}
      <HeroSection
        className="contact-hero"
        subtitle="Let's Talk"
        title="Get in "
        titleHighlight="Touch With Us"
        description="Ready to transform your business with sustainable chemistry solutions? We'd love to hear from you and discuss how we can help achieve your environmental and production goals."
        primaryButtonText="Send Message"
        primaryButtonLink="#contact-form"
      /* secondaryButtonText="View Services" */
      /* secondaryButtonLink="/services" */
      />

      {/* Contact Content */}
      <section className="contact-content" id="contact-form">
        <div className="container">
          {/* Top Info Section - Three Columns */}
          <div className="contact-info-top">
            <div className="info-card">
              <div className="info-icon">
                <FiMapPin />
              </div>
              <h3>Come to See Us</h3>
              <p>
                Plot No.18,19, Moraji Desai Nagar,<br />
                Chettipalayam, Gandhi Nagar Post,<br />
                Tirupur - 641603
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FiPhone />
              </div>
              <h3>Quick Contact</h3>
              <p>
                Ph: +91 93444 53519<br />
                Email: erca@sufaux.com
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <h3>Office Schedule</h3>
              <p>
                Monday to Saturday: 09:00am to 18:00pm<br />
                Sunday: <span style={{ color: 'var(--accent-green)' }}>Closed</span>
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="contact-form-container">
            {/* Contact Form */}
            <div className="contact-form-section">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name *"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your Mail *"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      placeholder="Phone"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Subject"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Your Message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <FiSend />
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className="submit-message">
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Us</h2>
          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15658.0080643794!2d77.3421712!3d11.1468161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba90680d7c71fcd%3A0xc31c0688cc3ad2fc!2sMoraji%20Desai%20Nagar%2C%20Chettipalayam%2C%20Tiruppur%2C%20Tamil%20Nadu%20641603!5e0!3m2!1sen!2sin!4v1710156930000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SurfauxDyeChem Location"
              className="map-image"
            ></iframe>
            <div className="map-overlay">
              <div className="map-info">
                <h3> SurfauxDyeChemHeadquarters</h3>
                <p>
                  Plot No.18,19, Moraji Desai Nagar,
                  Chettipalayam, Gandhi Nagar Post,
                  Tirupur - 641603
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;