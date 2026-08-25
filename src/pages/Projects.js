import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'framer-motion';
import './Projects.css';

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } }
};

const vp = { once: true, amount: 0.15 };

const Projects = () => {
  const navigate = useNavigate();
  const projects = useProducts();
  const [selectedFilter] = useState('All');
  const [selectedStatus] = useState('All');

  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedFilter === 'All' || project.category === selectedFilter;
    const statusMatch = selectedStatus === 'All' || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="projects">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="hero-title">
              Sustainable <span className="text-accent">Project Portfolio</span>
            </h1>
            <p className="hero-description">
              Tries to access devices in network range
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid — staggered cards */}
      <section className="projects-grid-section">
        <div className="container">
          <motion.div
            className="projects-count"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <p>Showing {filteredProjects.length} of {projects.length} projects</p>
          </motion.div>

          <motion.div
            className="projects-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={scaleIn}
                whileHover={{ y: -10, boxShadow: '0 25px 55px rgba(11,47,59,0.2)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <motion.button
                    className="learn-more-btn"
                    onClick={() => navigate(`/products/${project.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Learn More About Chemicals
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories — alternating fade */}
      <section className="success-stories">
        <div className="container">
          <motion.h2
            className="section-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Success Highlights
          </motion.h2>
          <motion.div
            className="stories-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {[
              { num: '01', title: 'ReatEvo', text: 'Our innovative process converts ocean plastic waste into high-value chemical feedstocks, removing 50,000 kg of plastic from marine environments while creating sustainable materials.' },
              { num: '02', title: 'Zero-Emission Manufacturing', text: 'Achieved the first carbon-neutral chemical production facility, demonstrating that large-scale manufacturing can operate with minimal environmental impact.' },
              { num: '03', title: 'Agricultural Waste Valorization', text: 'Transformed 1,000 tons of agricultural waste into valuable chemicals, creating new revenue streams for farmers while reducing waste disposal costs.' },
            ].map((story, i) => (
              <motion.div
                key={i}
                className="story-card"
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <div className="story-number">{story.num}</div>
                <h3>{story.title}</h3>
                <p>{story.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <h2 className="cta-title">Want to Start Your Own Project?</h2>
            <p className="cta-description">
              Let's collaborate on creating sustainable solutions for your industry.
              Our expert team is ready to help you achieve your environmental goals.
            </p>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              Discuss Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;