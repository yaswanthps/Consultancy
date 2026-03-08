import React from 'react';
import './Cart.css';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (id, volume, newQuantity) => {
        const val = parseInt(newQuantity);
        if (!isNaN(val) && val >= 1) {
            updateQuantity(id, volume, val);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-hero">
                <div className="container">
                    <h1 className="cart-title">Your Cart</h1>
                    <p className="cart-subtitle">Review your selected items before checkout</p>
                </div>
            </div>

            <div className="cart-container container">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <FiShoppingCart className="empty-cart-icon" />
                        <h2>Your cart is currently empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/buy-products" className="btn btn-primary btn-continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-section">
                            <div className="cart-items-header">
                                <span>Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Subtotal</span>
                                <span></span>
                            </div>

                            <div className="cart-items-list">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.volume}`} className="cart-item">
                                        <div className="item-details">
                                            <div className="item-image-placeholder" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                            <div>
                                                <span className="item-name" style={{ display: 'block' }}>{item.title}</span>
                                                <span className="item-volume" style={{ fontSize: '0.85rem', color: 'var(--medium-gray)' }}>{item.volume}</span>
                                            </div>
                                        </div>
                                        <div className="item-price">${item.price.toFixed(2)}</div>
                                        <div className="item-quantity">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, item.volume, e.target.value)}
                                            />
                                        </div>
                                        <div className="item-subtotal">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <div className="item-remove">
                                            <button className="btn-remove" onClick={() => removeFromCart(item.id, item.volume)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cart-summary-section">
                            <div className="cart-summary-card">
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <button className="btn btn-primary btn-checkout" onClick={() => navigate('/checkout')}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
