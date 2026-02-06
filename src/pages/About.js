import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiTarget, FiAward } from 'react-icons/fi';
import { teamMembers, companyStats } from '../data/mockData';
import './About.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Pioneering <span className="text-accent">Sustainable Chemistry</span> 
                Since 2009
              </h1>
              <p className="hero-description">
                We are a leading innovator in eco-friendly chemical solutions, committed to 
                revolutionizing industrial processes while protecting our planet for future generations.
              </p>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop" 
                alt="Our Research Laboratory"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Intro */}
      <section className="about-us-intro">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-description">
            SurfauxDyeChem is a technology-driven specialty chemical company focused on
            delivering sustainable, high-performance solutions for textile, leather,
            paper, and other process industries. Our multidisciplinary team combines
            deep application knowledge with cutting-edge research to help customers
            improve productivity, reduce resource consumption, and meet ever-evolving
            regulatory and environmental standards.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <FiTarget className="card-icon" />
              <h3 className="card-title">Our Mission</h3>
              <p className="card-description">
                To develop and deliver sustainable chemical solutions that enable industries 
                to achieve their environmental goals without compromising performance or quality. 
                We believe that chemistry can be a force for good in creating a more sustainable world.
              </p>
            </div>
            <div className="vision-card">
              <FiSun className="card-icon" />
              <h3 className="card-title">Our Vision</h3>
              <p className="card-description">
                To become the global leader in sustainable chemistry, where every chemical process 
                contributes to a circular economy and every product we create helps build a greener, 
                more sustainable future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="company-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">Our Journey</h2>
              <div className="story-timeline">
                <div className="timeline-item">
                  <div className="timeline-year">2009</div>
                  <div className="timeline-content">
                    <h4>Foundation</h4>
                    <p> SurfauxDyeChem was founded with a vision to revolutionize the chemical industry through sustainable innovation.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2012</div>
                  <div className="timeline-content">
                    <h4>First Breakthrough</h4>
                    <p>Developed our first bio-based chemical process, reducing environmental impact by 70%.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2015</div>
                  <div className="timeline-content">
                    <h4>Global Expansion</h4>
                    <p>Opened international operations and established partnerships with leading companies worldwide.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2020</div>
                  <div className="timeline-content">
                    <h4>Circular Economy Focus</h4>
                    <p>Launched our circular economy initiative, helping companies achieve zero waste to landfill.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-year">2024</div>
                  <div className="timeline-content">
                    <h4>Carbon Neutral Operations</h4>
                    <p>Achieved carbon neutrality across all operations and launched our first carbon-negative products.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop" 
                alt="Our Company History"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🌱</div>
              <h3 className="value-title">Sustainability First</h3>
              <p className="value-description">
                Every decision we make is guided by its environmental impact, 
                ensuring a sustainable future for generations to come.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">🔬</div>
              <h3 className="value-title">Innovation Excellence</h3>
              <p className="value-description">
                We continuously push the boundaries of what's possible in 
                green chemistry through cutting-edge research and development.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Collaborative Partnership</h3>
              <p className="value-description">
                We work closely with our clients as partners, understanding 
                their unique needs and co-creating tailored solutions.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">🌍</div>
              <h3 className="value-title">Global Responsibility</h3>
              <p className="value-description">
                We take responsibility for our impact on the planet and 
                actively work to create positive change in communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            {companyStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-icon">{stat.icon}</span>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-description">
              Our world-class team of experts drives innovation in sustainable chemistry
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-position">{member.position}</p>
                  <p className="member-bio">{member.bio}</p>
                  <div className="member-expertise">
                    {member.expertise.map((skill, index) => (
                      <span key={index} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="certifications-section">
        <div className="container">
          <h2 className="section-title">Certifications & Awards</h2>
          <div className="certifications-grid">
            <div className="cert-item">
              <FiAward className="cert-icon" />
              <h3>ISO 14001</h3>
              <p>Environmental Management Systems</p>
            </div>
            <div className="cert-item">
              <FiAward className="cert-icon" />
              <h3>Green Chemistry Award</h3>
              <p>Presidential Green Chemistry Challenge</p>
            </div>
            <div className="cert-item">
              <FiAward className="cert-icon" />
              <h3>B Corp Certified</h3>
              <p>Verified Social and Environmental Performance</p>
            </div>
            <div className="cert-item">
              <FiAward className="cert-icon" />
              <h3>Carbon Neutral</h3>
              <p>Carbon Trust Certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Join Our Mission</h2>
            <p className="cta-description">
              Partner with us to create sustainable solutions that make a real difference 
              for your business and our planet.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
              <Link to="/services" className="btn btn-outline">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;