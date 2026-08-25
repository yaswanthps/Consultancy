import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiGlobe, FiDroplet, FiCpu } from 'react-icons/fi';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import './Home.css';

/* ─── Reusable animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

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
      {/* Hero Section — fade-up entrance */}
      <section className="home-hero">
        <div className="home-hero-content">
          <motion.div
            className="home-hero-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="home-hero-eyebrow" variants={fadeUp}>
              BRIDGING MANUFACTURERS. DELIVERING SUSTAINABLE CHEMISTRY.
            </motion.span>
            <motion.h1 className="home-hero-title" variants={fadeUp}>
              Connecting businesses with advanced Chemistry for a
              <span className="home-hero-highlight"> Sustainable Future</span>
            </motion.h1>
            <motion.p className="home-hero-subtitle" variants={fadeUp}>
              Trusted by customers for reliable and sustainable chemical solutions for a better productivity and profitability.
            </motion.p>
            <motion.p className="home-hero-description" variants={fadeUp}>
              We deliver advanced chemical manufacturing with a focus on compliance, operational excellence, and eco-conscious performance.
            </motion.p>
            <motion.div className="home-hero-buttons" variants={fadeUp}>
              <Link to="/products" className="home-btn home-btn-primary">
                Explore Our Products <FiArrowRight />
              </Link>
              <Link to="/contact" className="home-btn home-btn-secondary">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Applications Section — fade-up title + slider */}
      <section className="home-applications">
        <div className="container">
          <motion.h2
            className="applications-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            APPLICATIONS
          </motion.h2>
          <motion.div
            className="carousel-wrapper"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* Features Section — staggered card reveals */}
      <section className="home-features">
        <div className="container">
          <motion.div
            className="home-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="section-title">Enterprise-ready chemistry for modern industry</h2>
            <p className="section-description">
              A premium, compliance-driven partner delivering performance, transparency, and sustainability.
            </p>
          </motion.div>

          <motion.div
            className="features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="feature-card"
                variants={index % 2 === 0 ? fadeLeft : fadeRight}
                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(11, 47, 59, 0.15)' }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section — scale-in with bounce */}
      <section className="home-cta">
        <div className="container">
          <motion.div
            className="home-cta-card"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
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
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
