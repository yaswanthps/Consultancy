import React, { useState } from 'react';
import { FiShoppingCart, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { projects } from '../data/mockData';
import './BuyProducts.css';

const BuyProducts = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [modalQuantity, setModalQuantity] = useState(1);
    const [modalVolume, setModalVolume] = useState('1 Liter Bottle');

    const { addToCart } = useCart();

    const categories = ['All', 'Circular Economy', 'Clean Technology', 'Sustainable Materials', 'Resource Recovery', 'Chemical Innovation'];

    const filteredProducts = projects.filter(project => {
        return selectedCategory === 'All' || project.category === selectedCategory;
    });

    const openDetails = (product) => {
        setSelectedProductDetails(product);
        setModalQuantity(1);
        setModalVolume('1 Liter Bottle');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeDetails = () => {
        setSelectedProductDetails(null);
        // Restore body scroll
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="buy-products-page">
            <div className="buy-hero">
                <div className="container">
                    <h1 className="buy-title">Shop Our Products</h1>
                    <p className="buy-subtitle">High-quality chemicals and dyes for your business needs</p>
                </div>
            </div>

            <div className="buy-container container">
                <div className="filters-sidebar">
                    <h3>Categories</h3>
                    <ul className="category-list">
                        {categories.map((category) => (
                            <li
                                key={category}
                                className={selectedCategory === category ? 'active' : ''}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="products-grid-container">
                    <div className="products-header">
                        <p>Showing 1–{filteredProducts.length} of {filteredProducts.length} results</p>
                        <select className="sort-dropdown">
                            <option>Sort by popularity</option>
                            <option>Sort by latest</option>
                        </select>
                    </div>

                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div
                                    className="product-image-placeholder"
                                    style={{
                                        backgroundImage: `url(${product.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '220px'
                                    }}
                                >
                                    <span className="stock-badge">In Stock</span>
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{product.category}</span>
                                    <h3 className="product-name">{product.title}</h3>
                                    <p className="product-description" style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>
                                        {product.description}
                                    </p>
                                    <p className="product-price">${(product.id * 50 + 100).toFixed(2)} / Liter</p>

                                    <div className="product-actions">
                                        <button className="btn btn-primary btn-add-to-cart" onClick={() => addToCart(product, 1, '1 Liter Bottle')}>
                                            <FiShoppingCart /> Add
                                        </button>
                                        <button onClick={() => openDetails(product)} className="btn btn-outline btn-view-details" style={{ cursor: 'pointer' }}>
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            {selectedProductDetails && (
                <div className="product-modal-backdrop" onClick={closeDetails}>
                    <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="product-modal-close" onClick={closeDetails}>
                            <FiX />
                        </button>

                        <div className="product-modal-grid">
                            <div
                                className="product-modal-image"
                                style={{
                                    backgroundImage: `url(${selectedProductDetails.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <span className="stock-badge modal-badge">In Stock</span>
                            </div>

                            <div className="product-modal-info">
                                <span className="product-category">{selectedProductDetails.category}</span>
                                <h2 className="product-name modal-title">{selectedProductDetails.title}</h2>
                                <p className="product-price modal-price">
                                    ${(selectedProductDetails.id * 50 + 100).toFixed(2)} <span className="price-unit">per Liter</span>
                                </p>

                                <div className="product-description modal-desc">
                                    <h4>Product Overview</h4>
                                    <p>{selectedProductDetails.description}</p>

                                    <h4 style={{ marginTop: '15px' }}>Specifications</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#718096', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        <li><strong>Grade:</strong> Industrial Premium</li>
                                        <li><strong>Purity:</strong> 99.8% Guarantee</li>
                                        <li><strong>Recommended Usage:</strong> Requires dilution before application</li>
                                        <li><strong>Safety:</strong> MSDS available upon request</li>
                                    </ul>
                                </div>

                                <div className="modal-purchase-options">
                                    <div className="quantity-selector" style={{ marginBottom: '15px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Volume (Liters)</label>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                value={modalQuantity}
                                                onChange={(e) => setModalQuantity(parseInt(e.target.value) || 1)}
                                                min="1"
                                                className="modal-qty-input"
                                            />
                                            <select
                                                className="modal-variant-select"
                                                value={modalVolume}
                                                onChange={(e) => setModalVolume(e.target.value)}
                                            >
                                                <option value="1 Liter Bottle">1 Liter Bottle</option>
                                                <option value="5 Liter Jug">5 Liter Jug (Save 5%)</option>
                                                <option value="20 Liter Drum">20 Liter Drum (Save 15%)</option>
                                                <option value="200 Liter Barrel">200 Liter Barrel (Save 25%)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-primary modal-add-btn"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                        onClick={() => {
                                            addToCart(selectedProductDetails, modalQuantity, modalVolume);
                                            closeDetails();
                                        }}
                                    >
                                        <FiShoppingCart /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyProducts;
