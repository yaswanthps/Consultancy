import React, { useState, useMemo } from 'react';
import { FiShoppingCart, FiX, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import './BuyProducts.css';

// Volume options: each has a label, how many liters it contains, and a bulk discount multiplier
const VOLUME_OPTIONS = [
    { label: '1 Liter Bottle', liters: 1, discount: 1.00 },
    { label: '5 Liter Jug (Save 5%)', liters: 5, discount: 0.95 },
    { label: '20 Liter Drum (Save 15%)', liters: 20, discount: 0.85 },
    { label: '200 Liter Barrel (Save 25%)', liters: 200, discount: 0.75 },
];

// Price = basePrice (per liter) × number of liters × discount
const getVolumePrice = (basePrice, volumeLabel) => {
    const vol = VOLUME_OPTIONS.find(v => v.label === volumeLabel) || VOLUME_OPTIONS[0];
    return Math.round(Number(basePrice) * vol.liters * vol.discount);
};

const BuyProducts = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [modalQuantity, setModalQuantity] = useState(1);
    const [modalVolume, setModalVolume] = useState(VOLUME_OPTIONS[0].label);

    const { addToCart } = useCart();
    const products = useProducts(); // live from admin/backend

    // Live price calculations
    const modalUnitPrice = useMemo(() => {
        if (!selectedProductDetails) return 0;
        return getVolumePrice(selectedProductDetails.price, modalVolume);
    }, [selectedProductDetails, modalVolume]);

    const modalTotal = useMemo(() => modalUnitPrice * modalQuantity, [modalUnitPrice, modalQuantity]);

    const selectedVolObj = useMemo(() => VOLUME_OPTIONS.find(v => v.label === modalVolume) || VOLUME_OPTIONS[0], [modalVolume]);

    const categories = ['All', 'Circular Economy', 'Clean Technology', 'Sustainable Materials', 'Resource Recovery', 'Chemical Innovation'];

    const filteredProducts = products.filter(product =>
        selectedCategory === 'All' || product.category === selectedCategory
    );

    const openDetails = (product) => {
        setSelectedProductDetails(product);
        setModalQuantity(1);
        setModalVolume(VOLUME_OPTIONS[0].label);
        document.body.style.overflow = 'hidden';
    };

    const closeDetails = () => {
        setSelectedProductDetails(null);
        document.body.style.overflow = 'auto';
    };

    const availBadgeStyle = (avail) => {
        if (!avail || avail === 'In Stock') return { background: '#22c55e' };
        if (avail === 'Low Stock') return { background: '#f59e0b' };
        return { background: '#ef4444' };
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
                        {filteredProducts.map((product) => {
                            const isOutOfStock = product.availability === 'Out of Stock';
                            return (
                                <div key={product.id} className="product-card" style={{ opacity: isOutOfStock ? 0.7 : 1 }}>
                                    <div
                                        className="product-image-placeholder"
                                        style={{
                                            backgroundImage: `url(${product.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            height: '220px'
                                        }}
                                    >
                                        <span className="stock-badge" style={availBadgeStyle(product.availability)}>
                                            {product.availability || 'In Stock'}
                                        </span>
                                    </div>
                                    <div className="product-info">
                                        <span className="product-category">{product.category}</span>
                                        <h3 className="product-name">{product.title}</h3>
                                        <p className="product-description" style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>
                                            {product.description}
                                        </p>
                                        <p className="product-price">₹{Number(product.price).toLocaleString()} / Liter</p>
                                        <div className="product-actions">
                                            <button
                                                className="btn btn-primary btn-add-to-cart"
                                                onClick={() => !isOutOfStock && addToCart(product, 1, VOLUME_OPTIONS[0].label)}
                                                disabled={isOutOfStock}
                                                style={isOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                            >
                                                <FiShoppingCart /> {isOutOfStock ? 'Out of Stock' : 'Add'}
                                            </button>
                                            <button onClick={() => openDetails(product)} className="btn btn-outline btn-view-details" style={{ cursor: 'pointer' }}>
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ===== Product Details Modal ===== */}
            {selectedProductDetails && (
                <div className="product-modal-backdrop" onClick={closeDetails}>
                    <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="product-modal-close" onClick={closeDetails}>
                            <FiX />
                        </button>

                        <div className="product-modal-grid">
                            {/* Image */}
                            <div
                                className="product-modal-image"
                                style={{
                                    backgroundImage: `url(${selectedProductDetails.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <span className="stock-badge modal-badge" style={availBadgeStyle(selectedProductDetails.availability)}>
                                    {selectedProductDetails.availability || 'In Stock'}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="product-modal-info">
                                <span className="product-category">{selectedProductDetails.category}</span>
                                <h2 className="product-name modal-title">{selectedProductDetails.title}</h2>

                                {/* Dynamic price display */}
                                <p className="product-price modal-price">
                                    ₹{modalUnitPrice.toLocaleString()}
                                    <span className="price-unit"> per {selectedVolObj.liters} liter{selectedVolObj.liters > 1 ? 's' : ''}</span>
                                </p>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px', marginBottom: '12px' }}>
                                    Base: ₹{Number(selectedProductDetails.price).toLocaleString()} / Liter
                                    {selectedVolObj.discount < 1 && (
                                        <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 700 }}>
                                            {Math.round((1 - selectedVolObj.discount) * 100)}% savings applied
                                        </span>
                                    )}
                                </p>

                                {/* Out of stock warning */}
                                {selectedProductDetails.availability === 'Out of Stock' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: '0.88rem', fontWeight: 600 }}>
                                        <FiAlertCircle /> This product is currently out of stock.
                                    </div>
                                )}

                                <div className="product-description modal-desc">
                                    <h4>Product Overview</h4>
                                    <p>{selectedProductDetails.description}</p>
                                    <h4 style={{ marginTop: '15px' }}>Specifications</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#718096', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        <li><strong>Grade:</strong> Industrial Premium</li>
                                        <li><strong>Purity:</strong> 99.8% Guarantee</li>
                                        <li><strong>Stock:</strong> {selectedProductDetails.stock} units available</li>
                                        <li><strong>Safety:</strong> MSDS available upon request</li>
                                    </ul>
                                </div>

                                {/* Purchase options */}
                                <div className="modal-purchase-options">
                                    <div className="quantity-selector" style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Volume & Quantity</label>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                value={modalQuantity}
                                                onChange={(e) => setModalQuantity(parseInt(e.target.value) || 1)}
                                                min="1"
                                                max={selectedProductDetails.stock || 999}
                                                className="modal-qty-input"
                                            />
                                            <select
                                                className="modal-variant-select"
                                                value={modalVolume}
                                                onChange={(e) => setModalVolume(e.target.value)}
                                            >
                                                {VOLUME_OPTIONS.map(v => (
                                                    <option key={v.label} value={v.label}>{v.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Live price preview box */}
                                    <div style={{ padding: '12px 14px', background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#0369a1' }}>
                                                {modalQuantity} × {selectedVolObj.liters}L =
                                            </span>
                                            <span style={{ fontWeight: 700, color: '#0369a1', fontSize: '1rem' }}>
                                                ₹{modalUnitPrice.toLocaleString()} each
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 6, borderTop: '1px solid #bae6fd' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>Total:</span>
                                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>
                                                ₹{modalTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-primary modal-add-btn"
                                        style={{ width: '100%', justifyContent: 'center', opacity: selectedProductDetails.availability === 'Out of Stock' ? 0.5 : 1 }}
                                        disabled={selectedProductDetails.availability === 'Out of Stock'}
                                        onClick={() => {
                                            if (selectedProductDetails.availability !== 'Out of Stock') {
                                                addToCart({ ...selectedProductDetails, price: modalUnitPrice }, modalQuantity, modalVolume);
                                                closeDetails();
                                            }
                                        }}
                                    >
                                        <FiShoppingCart /> {selectedProductDetails.availability === 'Out of Stock'
                                            ? 'Out of Stock'
                                            : `Add to Cart — ₹${modalTotal.toLocaleString()}`}
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
