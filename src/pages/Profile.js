import React from 'react';
import { FiPackage, FiUser, FiMapPin, FiCreditCard, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../api/config';
import './Profile.css';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const savedAddress = JSON.parse(localStorage.getItem('savedAddress') || 'null');
    const [activeTab, setActiveTab] = React.useState('overview');
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [isAddingAddress, setIsAddingAddress] = React.useState(false);
    const [addressForm, setAddressForm] = React.useState({
        address: '',
        city: '',
        zip: ''
    });

    React.useEffect(() => {
        if (user && (activeTab === 'orders' || activeTab === 'overview')) {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders?email=${user.email}`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTrackOrder = (order) => {
        setSelectedOrder(order);
        setActiveTab('tracking');
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('savedAddress', JSON.stringify(addressForm));
        setIsAddingAddress(false);
        window.location.reload();
    };

    const handleRemoveAddress = () => {
        if (window.confirm('Are you sure you want to remove this address?')) {
            localStorage.removeItem('savedAddress');
            window.location.reload();
        }
    };

    const renderTrackingTimeline = (order) => {
        const statuses = ['Placed', 'Processing', 'Shipped', 'Delivered'];
        const currentStatus = order.orderStatus || 'Placed';
        const currentIndex = statuses.indexOf(currentStatus);

        return (
            <div className="tracking-timeline">
                {statuses.map((status, index) => (
                    <div key={status} className={`timeline-step ${index <= currentIndex ? 'active' : ''} ${index === currentIndex ? 'current' : ''}`}>
                        <div className="step-dot">
                            <div className="dot-inner"></div>
                        </div>
                        <div className="step-label">{status}</div>
                        {index < statuses.length - 1 && <div className="step-line"></div>}
                    </div>
                ))}
            </div>
        );
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Please log in to view your profile</h2>
                </div>
            </div>
        );
    }

    const cards = [
        {
            id: 'orders',
            icon: <FiPackage />,
            title: 'Your Orders',
            description: 'Track, return, or buy things again'
        },
        {
            id: 'security',
            icon: <FiUser />,
            title: 'Login & Security',
            description: 'Edit login, name, and mobile number'
        },
        {
            id: 'addresses',
            icon: <FiMapPin />,
            title: 'Your Addresses',
            description: 'Edit addresses for orders and gifts'
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'tracking':
                if (!selectedOrder) {
                    setActiveTab('orders');
                    return null;
                }
                return (
                    <div className="tab-content fade-in">
                        <div className="tracking-header">
                            <button className="back-btn" onClick={() => setActiveTab('orders')}>← Back to Orders</button>
                            <h2>Tracking Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                        </div>

                        <div className="tracking-container">
                            {renderTrackingTimeline(selectedOrder)}

                            <div className="tracking-details">
                                <div className="tracking-card">
                                    <h3>Latest Update</h3>
                                    <p className="update-status">Your order status is: <strong>{selectedOrder.orderStatus || 'Placed'}</strong></p>
                                    <p className="update-time">Status updated on: {new Date(selectedOrder.updatedAt || selectedOrder.createdAt).toLocaleDateString()} {new Date(selectedOrder.updatedAt || selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>

                                <div className="tracking-info-grid">
                                    <div className="info-box">
                                        <label>Shipment Address</label>
                                        <p>{selectedOrder.customerInfo.address}</p>
                                        <p>{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.zip}</p>
                                    </div>
                                    <div className="info-box">
                                        <label>Order Sumary</label>
                                        <p>{selectedOrder.orderItems.length} items</p>
                                        <p>Total: ₹{selectedOrder.totals.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="tab-content fade-in">
                        <h2 className="section-title">Your Orders</h2>
                        {loading ? <p>Loading orders...</p> :
                            orders.length === 0 ? <p>You haven't placed any orders yet.</p> :
                                orders.map(order => (
                                    <div key={order._id} className="order-item">
                                        <div className="order-info">
                                            <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
                                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p>Items: {order.orderItems.map(i => i.title).join(', ')}</p>
                                            <p className="order-total">Total: ₹{order.totals.total.toFixed(2)}</p>
                                        </div>
                                        <div className="order-actions-stack">
                                            <div className={`order-status status-${(order.orderStatus || order.payment.status || 'pending').toLowerCase()}`}>
                                                {order.orderStatus || order.payment.status || 'Pending'}
                                            </div>
                                            <button className="track-btn-small" onClick={() => handleTrackOrder(order)}>Track Package</button>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                );
            case 'addresses':
                return (
                    <div className="tab-content fade-in">
                        <div className="section-header-flex">
                            <h2 className="section-title">Your Addresses</h2>
                            {!isAddingAddress && !savedAddress && (
                                <button className="btn btn-primary" onClick={() => setIsAddingAddress(true)}>Add New Address</button>
                            )}
                        </div>

                        {isAddingAddress ? (
                            <div className="address-form-container fade-in-up">
                                <h3>Add New Address</h3>
                                <form onSubmit={handleAddressSubmit}>
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.address}
                                            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                            placeholder="House number and street name"
                                        />
                                    </div>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>ZIP Code</label>
                                            <input
                                                type="text"
                                                required
                                                value={addressForm.zip}
                                                onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="text-btn" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save Address</button>
                                    </div>
                                </form>
                            </div>
                        ) : savedAddress ? (
                            <div className="address-card">
                                <div className="card-icon"><FiMapPin /></div>
                                <div className="address-info">
                                    <h3>Default Shipping Address</h3>
                                    <p><strong>{user.firstName || user.displayName}</strong></p>
                                    <p>{savedAddress.address}</p>
                                    <p>{savedAddress.city}, {savedAddress.zip}</p>
                                    <p>India</p>
                                    <div className="address-actions">
                                        <button className="text-btn" onClick={() => {
                                            setAddressForm(savedAddress);
                                            setIsAddingAddress(true);
                                        }}>Edit</button>
                                        <button className="text-btn" onClick={handleRemoveAddress}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>You haven't saved any addresses yet.</p>
                                <button className="btn btn-primary" onClick={() => setIsAddingAddress(true)}>ADD ADDRESS</button>
                            </div>
                        )}
                    </div>
                );
            case 'security':
                return (
                    <div className="tab-content fade-in">
                        <h2 className="section-title">Login & Security</h2>
                        <div className="account-details">
                            <div className="detail-row">
                                <label>Name</label>
                                <span>{user.name || user.displayName}</span>
                                <button className="text-btn">Edit</button>
                            </div>
                            <div className="detail-row">
                                <label>Email</label>
                                <span>{user.email}</span>
                                <button className="text-btn">Edit</button>
                            </div>
                            <div className="detail-row">
                                <label>Password</label>
                                <span>********</span>
                                <button className="text-btn">Edit</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <div className="profile-grid">
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    className={`profile-card ${activeTab === card.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(card.id)}
                                >
                                    <div className="card-icon">{card.icon}</div>
                                    <div className="card-info">
                                        <h3>{card.title}</h3>
                                        <p>{card.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="profile-sections">
                            <div className="recent-orders">
                                <h2 className="section-title">Recent Orders</h2>
                                {loading ? <p>Loading...</p> :
                                    orders.slice(0, 2).map(order => (
                                        <div key={order._id} className="order-item">
                                            <div className="order-info">
                                                <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
                                                <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                                <button className="text-link-btn" onClick={() => handleTrackOrder(order)}>Track Package</button>
                                            </div>
                                            <div className={`order-status status-${(order.orderStatus || order.payment.status || 'pending').toLowerCase()}`}>
                                                {order.orderStatus || order.payment.status || 'Pending'}
                                            </div>
                                        </div>
                                    ))
                                }
                                <button className="view-all-btn" onClick={() => setActiveTab('orders')}>View all orders</button>
                            </div>

                            <div className="account-details">
                                <h2 className="section-title">Account Details</h2>
                                <div className="detail-row">
                                    <label>Full Name</label>
                                    <span>{user.name || user.displayName}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Email Address</label>
                                    <span>{user.email}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Saved Address</label>
                                    <span>{savedAddress ? `${savedAddress.city}, ${savedAddress.zip}` : 'No address saved'}</span>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="header-breadcrumbs">
                        <span onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>Your Account</span>
                        {activeTab !== 'overview' && activeTab !== 'tracking' && (
                            <>
                                <span className="separator"> › </span>
                                <span className="current-tab">{cards.find(c => c.id === activeTab)?.title}</span>
                            </>
                        )}
                        {activeTab === 'tracking' && (
                            <>
                                <span className="separator"> › </span>
                                <span onClick={() => setActiveTab('orders')} style={{ cursor: 'pointer' }}>Your Orders</span>
                                <span className="separator"> › </span>
                                <span className="current-tab">Track Package</span>
                            </>
                        )}
                    </div>
                    <h1>{activeTab === 'overview' ? 'Your Account' : activeTab === 'tracking' ? 'Track Package' : cards.find(c => c.id === activeTab)?.title}</h1>
                    {activeTab === 'overview' && <p>Manage your orders, security, and personal information</p>}
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default Profile;
