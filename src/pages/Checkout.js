import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiCheckCircle, FiCreditCard, FiLock, FiSmartphone, FiDollarSign } from 'react-icons/fi';
import { API_BASE_URL } from '../api/config';
import './Checkout.css';

const Checkout = () => {
    const { getCartTotal, clearCart, cartItems } = useCart();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: ''
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

        if (paymentMethod === 'online') {
            try {
                // 1. Create Razorpay order on backend
                const rzpResponse = await fetch(`${API_BASE_URL}/api/razorpay/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total })
                });

                const rzpData = await rzpResponse.json();
                if (!rzpData.success) throw new Error('Failed to create Razorpay order');

                // 2. Open Razorpay Checkout modal
                const options = {
                    key: 'YOUR_RAZORPAY_KEY_ID', // Replaced in backend, but frontend needs the public key to open the modal
                    amount: rzpData.order.amount,
                    currency: rzpData.order.currency,
                    name: "Consultancy Store",
                    description: "Order Payment",
                    order_id: rzpData.order.id,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment
                            const verifyResponse = await fetch(`${API_BASE_URL}/api/razorpay/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            const verifyData = await verifyResponse.json();
                            if (verifyData.success) {
                                // 4. Save order to MongoDB
                                await submitOrderToBackend('Paid', 'Razorpay', response.razorpay_payment_id);
                            } else {
                                throw new Error('Payment verification failed');
                            }
                        } catch (err) {
                            alert(err.message);
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                    },
                    theme: { color: "#3399cc" },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        }
                    }
                };

                const rzpWindow = new window.Razorpay(options);
                rzpWindow.on('payment.failed', function (response) {
                    alert("Payment failed: " + response.error.description);
                    setIsProcessing(false);
                });
                rzpWindow.open();
            } catch (error) {
                console.error('Razorpay Error:', error);
                alert(error.message);
                setIsProcessing(false);
            }
        } else {
            // COD Option
            await submitOrderToBackend('Pending', 'cod', null);
        }
    };

    // Helper to submit the final order to MongoDB
    const submitOrderToBackend = async (status, method, paymentId = null) => {
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
                method: method,
                status: status,
                ...(paymentId && { paymentId })
            },
            totals: {
                subtotal: subtotal,
                shipping: shipping,
                tax: tax,
                total: total
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('savedAddress', JSON.stringify({
                    address: formData.address, city: formData.city, zip: formData.zip
                }));
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
                                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                    />
                                    <span><FiCreditCard size={20} style={{ marginRight: '10px' }} /> Pay Online (Razorpay)</span>
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

                            {paymentMethod === 'online' && (
                                <div className="card-details-box fade-in-up">
                                    <p style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', marginTop: '5px' }}>
                                        You will be redirected to the secure Razorpay gateway to complete your payment using Cards, UPI, Netbanking, or Wallets.
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
