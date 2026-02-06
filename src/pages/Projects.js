import React, { useState } from 'react';
import { projects } from '../data/mockData';
import './Projects.css';

const Projects = () => {
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
          <div className="hero-content">
            <h1 className="hero-title">
              Sustainable <span className="text-accent">Project Portfolio</span>
            </h1>
            <p className="hero-description">
              Discover our innovative projects that are transforming industries
              and creating a more sustainable future. Each project demonstrates
              our commitment to environmental excellence and technological innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      {/*<section className="filter-section">
        <div className="container">
          <div className="filters">
            <div className="filter-group">
              <label>Category:</label>
              <div className="filter-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedFilter === category ? 'active' : ''}`}
                    onClick={() => setSelectedFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <div className="filter-buttons">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
*/}
      {/* Projects Grid */}
      <section className="projects-grid-section">
        <div className="container">
          <div className="projects-count">
            <p>Showing {filteredProjects.length} of {projects.length} projects</p>
          </div>
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <button
                    className="learn-more-btn"
                    onClick={() => window.location.href = `/products/${project.id}`}
                  >
                    Learn More About Chemicals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="project-stats">
        <div className="container">
          <h2 className="section-title">Project Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🌱</div>
              <div className="stat-number">2.5M</div>
              <div className="stat-label">Tons CO₂ Reduced</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">♻️</div>
              <div className="stat-number">1.8M</div>
              <div className="stat-label">Tons Waste Diverted</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💧</div>
              <div className="stat-number">500M</div>
              <div className="stat-label">Gallons Water Saved</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">85%</div>
              <div className="stat-label">Energy Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories">
        <div className="container">
          <h2 className="section-title">Success Highlights</h2>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-number">01</div>
              <h3>ReatEvo</h3>
              <p>
                Our innovative process converts ocean plastic waste into high-value
                chemical feedstocks, removing 50,000 kg of plastic from marine environments
                while creating sustainable materials.
              </p>
            </div>
            <div className="story-card">
              <div className="story-number">02</div>
              <h3>Zero-Emission Manufacturing</h3>
              <p>
                Achieved the first carbon-neutral chemical production facility,
                demonstrating that large-scale manufacturing can operate with
                minimal environmental impact.
              </p>
            </div>
            <div className="story-card">
              <div className="story-number">03</div>
              <h3>Agricultural Waste Valorization</h3>
              <p>
                Transformed 1,000 tons of agricultural waste into valuable chemicals,
                creating new revenue streams for farmers while reducing waste disposal costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Want to Start Your Own Project?</h2>
            <p className="cta-description">
              Let's collaborate on creating sustainable solutions for your industry.
              Our expert team is ready to help you achieve your environmental goals.
            </p>
            <button className="btn btn-primary">
              Discuss Your Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;