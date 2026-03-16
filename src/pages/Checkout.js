import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiCheckCircle, FiCreditCard, FiLock, FiSmartphone, FiDollarSign } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
    const { getCartTotal, clearCart, cartItems } = useCart();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Form state (mock)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: ''
    });

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Pre-fill form from localStorage on mount
    React.useEffect(() => {
        // 1. Get user data for name/email
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        // 2. Get saved address for shipping info
        const savedAddress = JSON.parse(localStorage.getItem('savedAddress') || 'null');

        if (userData || savedAddress) {
            setFormData(prev => ({
                ...prev,
                firstName: userData?.firstName || userData?.displayName?.split(' ')[0] || prev.firstName,
                lastName: userData?.lastName || userData?.displayName?.split(' ').slice(1).join(' ') || prev.lastName,
                email: userData?.email || prev.email,
                address: savedAddress?.address || prev.address,
                city: savedAddress?.city || prev.city,
                zip: savedAddress?.zip || prev.zip
            }));
        }
    }, []);

    // Calculate totals including mock shipping and tax
    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 15.00 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Handle Order Submission
    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Prevent submission if cart is empty
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setIsProcessing(true);

        // 1. Prepare the Order Data format expected by our new MongoDB Schema
        const orderData = {
            customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                zip: formData.zip
            },
            orderItems: cartItems.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                volume: item.volume
            })),
            payment: {
                method: paymentMethod
                // Status will be handled by backend ('Pending' or 'Paid')
            },
            totals: {
                subtotal: subtotal,
                shipping: shipping,
                tax: tax,
                total: total
            }
        };

        try {
            // 2. Send the Order Data to our new Express API Route
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                // 3. Save address for future autofill
                localStorage.setItem('savedAddress', JSON.stringify({
                    address: formData.address,
                    city: formData.city,
                    zip: formData.zip
                }));

                // 4. Show Success & Clear Cart
                setIsProcessing(false);
                setShowSuccessModal(true);
                clearCart();
            } else {
                throw new Error(result.message || 'Failed to place order');
            }

        } catch (error) {
            console.error('Checkout Error:', error);
            setIsProcessing(false);
            alert(error.message || 'There was an error processing your order. Please ensure the backend server is running.');
        }
    };

    // Handle Closing the Success Modal and redirecting
    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        navigate('/products');
    };

    if (cartItems.length === 0 && !showSuccessModal) {
        return (
            <div className="checkout-page empty-checkout">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Cart is Empty</h2>
                    <p>You need items in your cart to checkout.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/buy-products')} style={{ marginTop: '20px' }}>
                        Go to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header-hero">
                <div className="container">
                    <h1>Checkout securely</h1>
                    <p><FiLock style={{ position: 'relative', top: '2px', marginRight: '5px' }} /> SSL Encrypted Connection</p>
                </div>
            </div>

            <div className="container checkout-container">
                <div className="checkout-form-section">
                    <form onSubmit={handlePlaceOrder}>
                        {/* Billing / Shipping Details */}
                        <div className="checkout-panel">
                            <h2>Billing Details</h2>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>First Name*</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name*</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address*</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Street Address*</label>
                                <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="House number and street name" />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Town / City*</label>
                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>ZIP Code*</label>
                                    <input type="text" name="zip" required value={formData.zip} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="checkout-panel payment-panel">
                            <h2>Payment Method</h2>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <span><FiCreditCard size={20} style={{ marginRight: '10px' }} /> Credit / Debit Card</span>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`} style={{ marginTop: '10px' }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={() => setPaymentMethod('upi')}
                                    />
                                    <span><FiSmartphone size={20} style={{ marginRight: '10px' }} /> UPI (Google Pay, PhonePe, Paytm)</span>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} style={{ marginTop: '10px' }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <span><FiDollarSign size={20} style={{ marginRight: '10px' }} /> Cash on Delivery (COD)</span>
                                </label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="card-details-box fade-in-up">
                                    <div className="form-group">
                                        <label>Card Number*</label>
                                        <input type="text" name="cardNumber" required value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" maxLength="19" />
                                    </div>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label>Expiry Date*</label>
                                            <input type="text" name="expiry" required value={formData.expiry} onChange={handleChange} placeholder="MM/YY" maxLength="5" />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV*</label>
                                            <input type="text" name="cvv" required value={formData.cvv} onChange={handleChange} placeholder="123" maxLength="4" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'upi' && (
                                <div className="card-details-box fade-in-up">
                                    <div className="form-group">
                                        <label>Enter your UPI ID*</label>
                                        <input type="text" name="upiId" required value={formData.upiId} onChange={handleChange} placeholder="username@upi or mobile@paytm" />
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', marginTop: '10px' }}>
                                        A payment request will be sent to your UPI app. Please approve it to complete the order.
                                    </p>
                                </div>
                            )}

                            {paymentMethod === 'cod' && (
                                <div className="card-details-box fade-in-up" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                    <p style={{ fontSize: '1rem', color: 'var(--forest-green)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FiCheckCircle size={20} /> You will pay securely at your doorstep!
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', marginTop: '10px' }}>
                                        Ensure you have exact change ready. Processing may take slightly longer.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary submit-order-btn ${isProcessing ? 'processing' : ''}`}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing Payment...' : `Place Order - ₹${total.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="checkout-summary-section">
                    <div className="checkout-summary-panel">
                        <h2>Your Order</h2>
                        <div className="checkout-items">
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.volume}`} className="checkout-item">
                                    <div className="checkout-item-info">
                                        <span className="checkout-item-title">{item.title}</span>
                                        <span className="checkout-item-meta">{item.volume} x {item.quantity}</span>
                                    </div>
                                    <span className="checkout-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-totals">
                            <div className="checkout-total-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="checkout-total-row">
                                <span>Shipping (Flat Rate)</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <div className="checkout-total-row">
                                <span>Tax (8%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="checkout-total-divider"></div>
                            <div className="checkout-total-row final-total">
                                <span>Total</span>
                                <span className="highlight-price">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="success-modal-backdrop">
                    <div className="success-modal-content fade-in-up">
                        <div className="success-icon-wrapper pulse">
                            <FiCheckCircle size={60} color="var(--success)" />
                        </div>
                        <h2 className="success-title">Payment Successful!</h2>
                        <p className="success-message">
                            Thank you for your order, {formData.firstName}. We have received your payment of <strong style={{ color: 'var(--primary-green)' }}>₹{total.toFixed(2)}</strong>.
                        </p>
                        <p className="success-helper">
                            An email receipt has been sent to {formData.email || 'your email address'}. Your order will begin processing immediately.
                        </p>
                        <button className="btn btn-primary success-continue-btn" onClick={handleCloseSuccess}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
