import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiTarget, FiAward, FiUsers, FiGlobe } from 'react-icons/fi';
import { teamMembers } from '../data/mockData';
import { motion } from 'framer-motion';
import './About.css';

/* ─── Reusable animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -70 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const fadeRight = {
  hidden: { opacity: 0, x: 70 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } }
};

const vp = { once: true, amount: 0.25 };

const About = () => {
  return (
    <div className="about">
      {/* Hero Section — fade left text, scale-in image */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
            >
              <h1 className="hero-title">
                Pioneering <span className="text-accent">Sustainable Chemistry</span>
                Since 2012
              </h1>
              <p className="hero-description">
                We are a leading innovator in eco-friendly chemical solutions, committed to
                revolutionizing industrial processes while protecting our planet for future generations.
              </p>
            </motion.div>
            <motion.div
              className="hero-image"
              variants={fadeRight}
              initial="hidden"
              animate="visible"
            >
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop"
                alt="Our Research Laboratory"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Intro — fade-up */}
      <motion.section
        className="about-us-intro"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      >
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
      </motion.section>

      {/* Mission & Vision — staggered slide-in from sides */}
      <section className="mission-vision">
        <div className="container">
          <motion.div
            className="mission-vision-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <motion.div className="mission-card" variants={fadeLeft} whileHover={{ y: -8, scale: 1.02 }}>
              <FiTarget className="card-icon" />
              <h3 className="card-title">Our Mission</h3>
              <p className="card-description">
                To develop and deliver sustainable chemical solutions that enable industries
                to achieve their environmental goals without compromising performance or quality.
                We believe that chemistry can be a force for good in creating a more sustainable world.
              </p>
            </motion.div>
            <motion.div className="vision-card" variants={fadeRight} whileHover={{ y: -8, scale: 1.02 }}>
              <FiSun className="card-icon" />
              <h3 className="card-title">Our Vision</h3>
              <p className="card-description">
                To become the global leader in sustainable chemistry, where every chemical process
                contributes to a circular economy and every product we create helps build a greener,
                more sustainable future for all.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Story — image right, timeline left */}
      <section className="company-story">
        <div className="container">
          <div className="story-content">
            <motion.div
              className="story-text"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <h2 className="section-title">Our Journey</h2>
              <motion.div
                className="story-timeline"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={vp}
              >
                {[
                  { year: '2012', title: 'Foundation', text: 'Started as a chemical distribution company.' },
                  { year: '2016', title: 'Partnership & OBA Solutions', text: "Joined with dikaffil chemicals and started providing solutions for customers who needed high quality OBA'S." },
                  { year: '2019', title: 'Auxiliaries Expansion', text: 'Started providing auxiliaries which reduce consumption of peroxide.' },
                  { year: '2022', title: 'ERCA Partnership', text: 'Joined with ERCA providing advanced sustainable solutions.' },
                ].map((item) => (
                  <motion.div key={item.year} className="timeline-item" variants={fadeUp}>
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              className="story-image"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
            >
              <img
                src="https://images.unsplash.com/photo-1542744095-291d1f67b221?w=600&h=400&fit=crop"
                alt="Our Chemical Manufacturing Facility"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section — staggered grid */}
      <section className="values-section">
        <div className="container">
          <motion.h2
            className="section-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Our Core Values
          </motion.h2>
          <motion.div
            className="values-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {[
              { icon: '🌱', title: 'Sustainability First', desc: 'Every decision we make is guided by its environmental impact, ensuring a sustainable future for generations to come.' },
              { icon: '🔬', title: 'Innovation Excellence', desc: "We continuously push the boundaries of what's possible in green chemistry through cutting-edge research and development." },
              { icon: '🤝', title: 'Collaborative Partnership', desc: 'We work closely with our clients as partners, understanding their unique needs and co-creating tailored solutions.' },
              { icon: '🌍', title: 'Global Responsibility', desc: 'We take responsibility for our impact on the planet and actively work to create positive change in communities worldwide.' },
            ].map((v, i) => (
              <motion.div key={i} className="value-item" variants={fadeUp} whileHover={{ y: -8, scale: 1.03 }}>
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-description">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section — staggered fade-up cards */}
      <section className="team-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <h2 className="section-title">Leadership</h2>
            <p className="section-description">
              Guided by visionary leadership to drive innovation in sustainable chemistry
            </p>
          </motion.div>
          <motion.div
            className="team-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {teamMembers.slice(0, 3).map((member) => (
              <motion.div
                key={member.id}
                className="team-card"
                variants={fadeUp}
                whileHover={{ y: -10, boxShadow: '0 25px 55px rgba(11,47,59,0.18)' }}
              >
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Certifications — staggered scale-in */}
      <section className="certifications-section">
        <div className="container">
          <motion.h2
            className="section-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            Certifications & Awards
          </motion.h2>
          <motion.div
            className="certifications-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            {[
              { title: 'ISCC PLUS', sub: 'Sustainability Certification' },
              { title: 'ZDHC Chemical Gateway', sub: 'Zero Discharge of Hazardous Chemicals' },
              { title: 'Bluesign® Approved', sub: 'Sustainable Textile Production' },
              { title: 'GOTS Approved', sub: 'Global Organic Textile Standard' },
              { title: 'GRS Certified', sub: 'Global Recycled Standard' },
              { title: 'RCS', sub: 'Recycled Claim Standard' },
              { title: 'Oeko-Tex Standard 100', sub: 'Tested for Harmful Substances' },
            ].map((cert, i) => (
              <motion.div key={i} className="cert-item" variants={scaleIn} whileHover={{ scale: 1.08 }}>
                <FiAward className="cert-icon" />
                <h3>{cert.title}</h3>
                <p>{cert.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section — scale-in */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
          >
            <h2 className="cta-title">Join Our Mission</h2>
            <p className="cta-description">
              Partner with us to create sustainable solutions that make a real difference
              for your business and our planet.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
              <Link to="/products" className="btn btn-outline">
                Our Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;