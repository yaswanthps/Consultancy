import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiDroplet, FiThermometer, FiClock } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import './ProductDetail.css';

// Chemical information for each product - moved outside component to be static
const chemicalInfo = {
    1: { // ReactEVO®
        title: "ReactEVO®",
        category: "Post-Treatment Process for Reactive Dyeing",
        whatItDoes: "A radically new post-treatment concept for reactive dyestuffs that drastically reduces energy consumption, water volumes, total treatment time, and CO₂ emissions.",
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
        keyBenefits: [
            "Massive cuts in energy & water use",
            "Shorter processing times",
            "Lower carbon footprint"
        ],
        technicalSpecs: {
            temperature: "120-135°C",
            pH: "4.5-5.5",
            dyeingTime: "45-60 minutes",
            waterSavings: "Up to 40% compared to traditional methods"
        },
        certifications: [
            "Oeko-Tex Standard 100",
            "GOTS",
            "Bluesign® approved"
        ],
        footerMessage: "Textile dyers looking to optimize reactive dyeing sustainably"
    },
    2: { // REVECOL®
        title: "REVECOL®",
        category: "Circular Chemical Auxiliaries",
        whatItDoes: "A breakthrough innovation that upcycles critical waste material (used vegetable/exhausted cooking oils) into a full range of next-gen chemical auxiliaries for the entire textile industry.",
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
        keyBenefits: [
            "100% Made in Italy",
            "Upcycled raw materials (bio-circular)",
            "CO₂ reduction of 30–72% vs conventional chemistry",
            "High performance & market competitive"
        ],
        certifications: [
            "ISCC PLUS",
            "GRS",
            "RCS",
            "ZDHC",
            "Bluesign®",
            "GOTS"
        ],
        footerMessage: "Brands pursuing 360° sustainability and circularity."
    },
    3: { // ReactEVO® TWE Conc
        title: "ReactEVO® TWE Conc",
        category: "Modified Polymer for ReactEVO® Post-Treatment Process",
        whatItDoes: "A modified polymer specifically designed for the ReactEVO® process, applied at 45°C to deliver high wet fastness even after repeated washings — with no impairment on light fastness.",
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
        keyBenefits: [
            "High wet fastness that holds up through repeated washings",
            "No negative impact on light fastness",
            "High stability with residual hydrolyzed dyes — no staining of machinery even after repeated treatments",
            "10% color yield improvement",
            "Nearly 100% exhaustion rate — no residual product left in the bath at the end of the process"
        ],
        certifications: [
            "ZDHC Gateway listed",
            "Bluesign® approved",
            "GOTS approved"
        ],
        footerMessage: "Textile dyers optimizing reactive dyeing with maximum efficiency and minimal waste."
    },
    4: { // Laucol ASP
        title: "Laucol ASP",
        category: "REVECOL® Circular Chemical Auxiliary",
        whatItDoes: "Part of the REVECOL® range — a new generation of chemical auxiliaries synthesized from upcycled exhausted vegetable cooking oil (UCO) under a mass balance approach.",
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
        keyBenefits: [
            "Made from bio-circular upcycled raw materials",
            "Part of the world's first ISCC PLUS certified textile auxiliaries line",
            "Significantly reduced carbon footprint vs. conventional chemistry",
            "High performance and market competitive",
            "Applicable across the full textile production cycle"
        ],
        certifications: [
            "ISCC PLUS",
            "ZDHC Chemical Gateway",
            "Bluesign® approved",
            "GOTS approved",
            "GRS certified"
        ],
        footerMessage: "Sustainable textile pre-treatment, dyeing, and finishing processes seeking verified circular chemistry."
    },
    5: { // REVECOL® XT
        title: "REVECOL® XT",
        category: "Circular Chemical Auxiliary (REVECOL® Range)",
        whatItDoes: "A certified, high-performance chemical auxiliary from the REVECOL® line, produced from upcycled vegetable exhausted cooking oil via a 100% Made in Italy process.",
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
        keyBenefits: [
            "100% Made in Italy with certified sustainable DNA",
            "Upcycled from critical waste material (used vegetable oil)",
            "End-to-end certification and full traceability",
            "High performance on every kind of fiber — both virgin and recycled",
            "Part of a range with 30–72% CO₂ reduction vs. conventional alternatives"
        ],
        certifications: [
            "ISCC PLUS",
            "ZDHC Chemical Gateway",
            "Bluesign® approved",
            "GOTS approved",
            "GRS certified"
        ],
        footerMessage: "Brands and finishers aiming for 360° sustainability with verified circular inputs across all fiber types."
    }
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const allProducts = useProducts();
    const product = useMemo(() => {
        console.log('ProductDetail: Current ID from URL:', id);
        console.log('ProductDetail: Total products available:', allProducts.length);
        const found = allProducts.find(p => String(p.id) === String(id));
        if (found) {
            console.log('ProductDetail: Found matching product:', found.title);
        } else {
            console.error('ProductDetail: FAILED to find product with ID:', id);
            console.log('ProductDetail: Available IDs:', allProducts.map(p => p.id));
        }
        return found;
    }, [allProducts, id]);

    // Find detailed info by matching either the MongoDB ID or the title (robust matching)
    // Moved up to top level to comply with Rules of Hooks
    const detailedInfo = useMemo(() => {
        if (!product) return null;

        console.log('ProductDetail: Searching chemical info for:', product.title, 'with ID:', product.id);

        // 1. Try direct ID match
        let found = chemicalInfo[product.id];
        if (found) {
            console.log('ProductDetail: Matched by ID');
            return found;
        }

        // 2. Try title match (case-insensitive, trimmed)
        const productTitle = product.title?.trim().toLowerCase();
        found = Object.values(chemicalInfo).find(info =>
            info.title?.trim().toLowerCase() === productTitle
        );

        if (found) {
            console.log('ProductDetail: Matched by Title');
            return found;
        }

        console.error('ProductDetail: FAILED to match chemical info for:', product.title);
        console.log('ProductDetail: Available chemical info titles:', Object.values(chemicalInfo).map(i => i.title));
        return null;
    }, [product]);

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

            {/* Product Profile Section (Replacing Technical Specs) */}
            {(detailedInfo.category || detailedInfo.whatItDoes) && (
            <section className="technical-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Product Profile</h2>
                        <div className="title-underline"></div>
                    </div>
                    <div className="product-profile-card">
                        {detailedInfo.category && (
                            <div className="profile-item">
                                <div className="profile-icon">🏷️</div>
                                <div className="profile-content">
                                    <span className="profile-label">Category</span>
                                    <span className="profile-value">{detailedInfo.category}</span>
                                </div>
                            </div>
                        )}
                        {detailedInfo.whatItDoes && (
                            <div className="profile-item">
                                <div className="profile-icon">⚡</div>
                                <div className="profile-content">
                                    <span className="profile-label">What It Does</span>
                                    <span className="profile-value">{detailedInfo.whatItDoes}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            )}

            {/* Applications / Key Benefits Section */}
            {(detailedInfo.applications || detailedInfo.keyBenefits) && (
            <section className="applications-section">
                <div className="container">
                    <div className="content-grid">
                        <div className="applications-content">
                            <div className="section-header">
                                <h2 className="section-title">
                                    {detailedInfo.keyBenefits ? "Key Benefits" : "Applications"}
                                </h2>
                                <div className="title-underline"></div>
                            </div>
                            <ul className="applications-list">
                                {(detailedInfo.keyBenefits || detailedInfo.applications).map((item, index) => (
                                    <li key={index} className="application-item">
                                        <FiCheckCircle className="app-icon" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="applications-image">
                            <img
                                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop"
                                alt={detailedInfo.keyBenefits ? "Key Benefits" : "Textile Applications"}
                            />
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Sustainability / Certifications Section */}
            {(detailedInfo.sustainability || detailedInfo.certifications) && (
            <section className="sustainability-section">
                <div className="container">
                    <div className="content-grid reverse">
                        <div className="sustainability-image">
                            <img
                                src={detailedInfo.certifications ? "/images/eco-certifications.png" : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop"}
                                alt={detailedInfo.certifications ? "Certifications" : "Sustainability Features"}
                            />
                        </div>
                        <div className="sustainability-content">
                            <div className="section-header">
                                <h2 className="section-title">
                                    {detailedInfo.certifications ? "Certifications" : "Sustainability Features"}
                                </h2>
                                <div className="title-underline"></div>
                            </div>
                            <ul className="sustainability-list">
                                {(detailedInfo.certifications || detailedInfo.sustainability).map((feature, index) => (
                                    <li key={index} className="sustainability-item">
                                        <div className="sustainability-icon">
                                            {detailedInfo.certifications ? "🏆" : "🌱"}
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Footer Message Section */}
            {detailedInfo.footerMessage && (
            <section className="footer-message-section" style={{ padding: "4rem 0", backgroundColor: "var(--bg-light)" }}>
                <div className="container">
                    <p style={{ 
                        fontSize: "1.5rem", 
                        textAlign: "center", 
                        color: "var(--primary-color)",
                        fontWeight: "500",
                        maxWidth: "800px",
                        margin: "0 auto"
                    }}>
                        {detailedInfo.footerMessage}
                    </p>
                </div>
            </section>
            )}

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
