import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiDroplet, FiThermometer, FiClock } from 'react-icons/fi';
import { projects } from '../data/mockData';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = projects.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="product-detail">
                <div className="container">
                    <h2>Product not found</h2>
                    <button onClick={() => navigate('/products')} className="btn btn-primary">
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    // Chemical information for each product
    const chemicalInfo = {
        1: { // 100% POLYESTER FABRIC / YARN / FIBER
            overview: "Our specialized chemical solutions for 100% polyester fabrics, yarns, and fibers deliver exceptional dyeing performance while minimizing environmental impact. These formulations are designed for high-temperature dyeing processes typical of polyester materials.",
            chemicals: [
                {
                    name: "Disperse Dyes",
                    description: "High-performance disperse dyes specifically formulated for polyester fibers, offering excellent color brilliance and wash fastness",
                    benefits: ["Superior color depth", "Excellent light fastness", "Wide color gamut", "Low environmental impact"]
                },
                {
                    name: "Dispersing Agents",
                    description: "Advanced dispersing agents that ensure uniform dye distribution and prevent agglomeration during the dyeing process",
                    benefits: ["Improved dye dispersion", "Reduced spotting", "Enhanced levelness", "Better reproducibility"]
                },
                {
                    name: "Leveling Agents",
                    description: "Specialized leveling agents for achieving uniform color across the entire fabric surface",
                    benefits: ["Uniform dyeing", "Reduced unlevelness", "Better migration properties", "Consistent results"]
                },
                {
                    name: "pH Regulators",
                    description: "Eco-friendly pH control agents optimized for polyester dyeing conditions",
                    benefits: ["Stable pH control", "Reduced chemical consumption", "Improved process efficiency", "Lower environmental impact"]
                }
            ],
            applications: [
                "Sportswear and activewear fabrics",
                "Home textiles and upholstery",
                "Industrial textiles",
                "Fashion and apparel",
                "Technical textiles"
            ],
            technicalSpecs: {
                temperature: "120-135°C",
                pH: "4.5-5.5",
                dyeingTime: "45-60 minutes",
                waterSavings: "Up to 40% compared to traditional methods"
            },
            sustainability: [
                "Zero discharge of hazardous chemicals (ZDHC compliant)",
                "Reduced water consumption by 40%",
                "Energy-efficient low-temperature alternatives available",
                "Biodegradable auxiliaries",
                "Recycled polyester compatible"
            ]
        },
        2: { // PES/CO/Elastane Blends
            overview: "Our cutting-edge chemical formulations for PES/CO/Elastane blends address the unique challenges of dyeing multi-fiber fabrics. These solutions ensure uniform color across different fiber types while maintaining fabric elasticity and performance.",
            chemicals: [
                {
                    name: "Dual-Action Dye Systems",
                    description: "Specially formulated dye combinations that work effectively on both polyester and cotton fibers simultaneously",
                    benefits: ["Single-bath dyeing", "Uniform color matching", "Time and energy savings", "Reduced water consumption"]
                },
                {
                    name: "Elastane Protection Agents",
                    description: "Protective chemicals that prevent elastane degradation during high-temperature dyeing processes",
                    benefits: ["Maintains fabric stretch", "Prevents yellowing", "Extends fabric life", "Preserves elasticity"]
                },
                {
                    name: "Blend-Specific Leveling Agents",
                    description: "Advanced leveling agents designed for multi-fiber substrates to ensure even dye uptake",
                    benefits: ["Uniform color across fibers", "Reduced shade variations", "Better color consistency", "Improved reproducibility"]
                },
                {
                    name: "Eco-Friendly Reducing Agents",
                    description: "Sustainable reducing agents for clearing unfixed dyes without harming elastane fibers",
                    benefits: ["Gentle on elastane", "Effective dye removal", "Environmentally safe", "Improved wash fastness"]
                }
            ],
            applications: [
                "Athletic and performance wear",
                "Stretch denim and casual wear",
                "Yoga and fitness apparel",
                "Compression garments",
                "Shapewear and intimate apparel"
            ],
            technicalSpecs: {
                temperature: "100-130°C (optimized for elastane protection)",
                pH: "5.0-6.0",
                dyeingTime: "60-90 minutes",
                waterSavings: "Up to 35% with optimized processes"
            },
            sustainability: [
                "Elastane-safe formulations",
                "Reduced processing steps",
                "Lower energy consumption",
                "OEKO-TEX certified chemicals",
                "Minimal effluent generation"
            ]
        },
        3: { // Polyester / Cotton Blends
            overview: "Our poly-cotton blend dyeing solutions provide exceptional color uniformity across both fiber types. These eco-friendly formulations are designed to achieve perfect color matching while reducing environmental impact and processing costs.",
            chemicals: [
                {
                    name: "Reactive Dyes for Cotton",
                    description: "High-performance reactive dyes that bond chemically with cotton fibers for superior wash fastness",
                    benefits: ["Excellent wash fastness", "Bright, vibrant colors", "Good light fastness", "Wide color range"]
                },
                {
                    name: "Disperse Dyes for Polyester",
                    description: "Compatible disperse dyes that work in harmony with reactive dyes for uniform blend dyeing",
                    benefits: ["Color matching capability", "Good sublimation fastness", "Excellent coverage", "Consistent results"]
                },
                {
                    name: "Migration Inhibitors",
                    description: "Specialized agents that prevent dye migration between fiber types during processing",
                    benefits: ["Prevents cross-staining", "Maintains color separation", "Improved color fastness", "Better quality control"]
                },
                {
                    name: "Alkali-Stable Dispersing Agents",
                    description: "Advanced dispersing agents stable under alkaline conditions required for reactive dyeing",
                    benefits: ["Stable in alkaline pH", "Prevents dye aggregation", "Improved levelness", "Enhanced color yield"]
                }
            ],
            applications: [
                "Workwear and uniforms",
                "Bed linens and home textiles",
                "Casual apparel and shirts",
                "Medical and healthcare textiles",
                "Hospitality and institutional textiles"
            ],
            technicalSpecs: {
                temperature: "130°C (HT method) or 100°C (two-bath method)",
                pH: "10.5-11.5 (reactive phase), 4.5-5.5 (disperse phase)",
                dyeingTime: "90-120 minutes (single bath) or 60+60 minutes (two-bath)",
                waterSavings: "Up to 50% with single-bath process"
            },
            sustainability: [
                "Single-bath dyeing option reduces water usage",
                "Low-salt reactive dye systems available",
                "Biodegradable auxiliaries",
                "Energy-efficient processing",
                "Reduced chemical consumption"
            ]
        },
        4: { // 100% Cellulosic (Medium to Dark Shades)
            overview: "Our advanced chemical solutions for cellulosic fibers (cotton, viscose, modal, lyocell) in medium to dark shades deliver exceptional color depth and brilliance. These formulations are optimized for achieving rich, deep colors with excellent wash and light fastness.",
            chemicals: [
                {
                    name: "High-Substantivity Reactive Dyes",
                    description: "Premium reactive dyes with high affinity for cellulosic fibers, ideal for deep shade dyeing",
                    benefits: ["Exceptional color depth", "Superior wash fastness", "Excellent build-up properties", "Minimal dye wastage"]
                },
                {
                    name: "Electrolyte Optimization Agents",
                    description: "Advanced salt substitutes and optimizers that reduce salt consumption while maintaining dye exhaustion",
                    benefits: ["Reduced salt usage up to 70%", "Lower effluent load", "Maintained color yield", "Environmental benefits"]
                },
                {
                    name: "Fixing Agents",
                    description: "Eco-friendly fixing agents that improve wet fastness properties of dyed cellulosic fabrics",
                    benefits: ["Enhanced wash fastness", "Improved crock fastness", "Formaldehable-free", "Durable results"]
                },
                {
                    name: "Sequestering Agents",
                    description: "Water conditioning agents that prevent metal ion interference in dark shade dyeing",
                    benefits: ["Prevents shade dulling", "Consistent color reproduction", "Improved dye performance", "Better water quality"]
                }
            ],
            applications: [
                "Denim and dark casual wear",
                "Dark-colored home textiles",
                "Fashion apparel in deep shades",
                "Towels and bathrobes",
                "Dark-colored bed linens"
            ],
            technicalSpecs: {
                temperature: "60-80°C",
                pH: "10.5-11.5",
                dyeingTime: "60-90 minutes",
                waterSavings: "Up to 60% with low-salt systems"
            },
            sustainability: [
                "Low-salt dyeing technology",
                "Reduced water consumption",
                "Energy-efficient cold pad-batch option",
                "Biodegradable chemicals",
                "Zero harmful discharge"
            ]
        },
        5: { // 100% Cellulosic (Light Shades)
            overview: "Our specialized chemical formulations for light shade dyeing of cellulosic fibers ensure exceptional brightness, clarity, and uniformity. These solutions are designed to achieve delicate pastel shades with minimal chemical usage and maximum sustainability.",
            chemicals: [
                {
                    name: "Ultra-Pure Reactive Dyes",
                    description: "High-purity reactive dyes specifically selected for light and pastel shade applications",
                    benefits: ["Exceptional brightness", "Clean, clear shades", "Minimal impurities", "Excellent reproducibility"]
                },
                {
                    name: "Optical Brightening Agents",
                    description: "Advanced fluorescent whitening agents that enhance brightness and whiteness of light shades",
                    benefits: ["Enhanced brightness", "Improved whiteness", "UV protection", "Long-lasting effect"]
                },
                {
                    name: "Anti-Staining Agents",
                    description: "Protective agents that prevent backstaining and ensure pristine light shades",
                    benefits: ["Prevents backstaining", "Maintains shade purity", "Improved wash fastness", "Cleaner whites"]
                },
                {
                    name: "Low-Alkali Dyeing Auxiliaries",
                    description: "Gentle auxiliaries that enable dyeing at lower pH levels, reducing fiber damage",
                    benefits: ["Gentler on fibers", "Reduced chemical consumption", "Better fabric hand feel", "Energy savings"]
                }
            ],
            applications: [
                "Baby clothing and infant wear",
                "Light-colored bed linens",
                "Pastel fashion apparel",
                "White and light towels",
                "Delicate intimate apparel"
            ],
            technicalSpecs: {
                temperature: "40-60°C (low-temperature options available)",
                pH: "9.5-10.5 (reduced alkali systems)",
                dyeingTime: "45-60 minutes",
                waterSavings: "Up to 70% with optimized processes"
            },
            sustainability: [
                "Ultra-low salt consumption",
                "Reduced alkali usage",
                "Cold dyeing options available",
                "Minimal environmental impact",
                "GOTS and OEKO-TEX compliant"
            ]
        }
    };

    const detailedInfo = chemicalInfo[product.id] || null;

    if (!detailedInfo) {
        return (
            <div className="product-detail">
                <div className="container">
                    <h2>Chemical information not available</h2>
                    <button onClick={() => navigate('/products')} className="btn btn-primary">
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail">
            {/* Hero Section */}
            <section className="product-hero">
                <div className="hero-overlay"></div>
                <img src={product.image} alt={product.title} className="hero-background" />
                <div className="container">
                    <button onClick={() => navigate('/products')} className="back-button">
                        <FiArrowLeft /> Back to Products
                    </button>
                    <div className="hero-content">
                        <h1 className="product-title">{product.title}</h1>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="overview-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Overview</h2>
                        <div className="title-underline"></div>
                    </div>
                    <p className="overview-text">{detailedInfo.overview}</p>
                </div>
            </section>

            {/* Chemicals Section */}
            <section className="chemicals-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Key Chemicals & Formulations</h2>
                        <div className="title-underline"></div>
                    </div>
                    <div className="chemicals-grid">
                        {detailedInfo.chemicals.map((chemical, index) => (
                            <div key={index} className="chemical-card">
                                <div className="chemical-header">
                                    <div className="chemical-icon">
                                        <FiDroplet />
                                    </div>
                                    <h3 className="chemical-name">{chemical.name}</h3>
                                </div>
                                <p className="chemical-description">{chemical.description}</p>
                                <div className="benefits-section">
                                    <h4 className="benefits-title">Key Benefits</h4>
                                    <ul className="benefits-list">
                                        {chemical.benefits.map((benefit, idx) => (
                                            <li key={idx}>
                                                <FiCheckCircle className="check-icon" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Specifications */}
            <section className="technical-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Technical Specifications</h2>
                        <div className="title-underline"></div>
                    </div>
                    <div className="specs-grid">
                        <div className="spec-card">
                            <div className="spec-icon">
                                <FiThermometer />
                            </div>
                            <h3 className="spec-label">Temperature</h3>
                            <p className="spec-value">{detailedInfo.technicalSpecs.temperature}</p>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">
                                <span className="ph-icon">pH</span>
                            </div>
                            <h3 className="spec-label">pH Range</h3>
                            <p className="spec-value">{detailedInfo.technicalSpecs.pH}</p>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">
                                <FiClock />
                            </div>
                            <h3 className="spec-label">Dyeing Time</h3>
                            <p className="spec-value">{detailedInfo.technicalSpecs.dyeingTime}</p>
                        </div>
                        <div className="spec-card">
                            <div className="spec-icon">
                                <FiDroplet />
                            </div>
                            <h3 className="spec-label">Water Savings</h3>
                            <p className="spec-value">{detailedInfo.technicalSpecs.waterSavings}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Applications Section */}
            <section className="applications-section">
                <div className="container">
                    <div className="content-grid">
                        <div className="applications-content">
                            <div className="section-header">
                                <h2 className="section-title">Applications</h2>
                                <div className="title-underline"></div>
                            </div>
                            <ul className="applications-list">
                                {detailedInfo.applications.map((application, index) => (
                                    <li key={index} className="application-item">
                                        <FiCheckCircle className="app-icon" />
                                        <span>{application}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="applications-image">
                            <img
                                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop"
                                alt="Textile Applications"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sustainability Section */}
            <section className="sustainability-section">
                <div className="container">
                    <div className="content-grid reverse">
                        <div className="sustainability-image">
                            <img
                                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop"
                                alt="Sustainability Features"
                            />
                        </div>
                        <div className="sustainability-content">
                            <div className="section-header">
                                <h2 className="section-title">Sustainability Features</h2>
                                <div className="title-underline"></div>
                            </div>
                            <ul className="sustainability-list">
                                {detailedInfo.sustainability.map((feature, index) => (
                                    <li key={index} className="sustainability-item">
                                        <div className="sustainability-icon">🌱</div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Interested in This Solution?</h2>
                        <p className="cta-description">
                            Contact our technical team to learn more about how these chemical solutions
                            can benefit your textile manufacturing process.
                        </p>
                        <div className="cta-buttons">
                            <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                                Contact Us
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                                View All Products
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
