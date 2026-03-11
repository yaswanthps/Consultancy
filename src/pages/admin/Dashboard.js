import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from './AdminContext';

const Dashboard = () => {
    const { products, orders } = useAdmin();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
    const pending = orders.filter(o => o.orderStatus === 'Processing').length;
    const lowStock = products.filter(p => p.stock < 20).length;
    const outOfStock = products.filter(p => p.availability === 'Out of Stock').length;

    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);

    const statusColor = (s) => {
        if (s === 'Delivered') return 'badge-green';
        if (s === 'Shipped') return 'badge-blue';
        if (s === 'Processing') return 'badge-yellow';
        if (s === 'Cancelled') return 'badge-red';
        return 'badge-gray';
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Dashboard</h2>
                    <p className="admin-page-subtitle">Welcome back, Administrator</p>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#e0f2fe' }}>📦</div>
                    <div>
                        <p className="admin-stat-value">{products.length}</p>
                        <p className="admin-stat-label">Total Products</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#dcfce7' }}>🛒</div>
                    <div>
                        <p className="admin-stat-value">{orders.length}</p>
                        <p className="admin-stat-label">Total Orders</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#ede9fe' }}>💰</div>
                    <div>
                        <p className="admin-stat-value">₹{totalRevenue.toLocaleString()}</p>
                        <p className="admin-stat-label">Total Revenue</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
                    <div>
                        <p className="admin-stat-value">{pending}</p>
                        <p className="admin-stat-label">Pending Orders</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#fee2e2' }}>⚠️</div>
                    <div>
                        <p className="admin-stat-value">{lowStock}</p>
                        <p className="admin-stat-label">Low Stock Alerts</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: '#f1f5f9' }}>🚫</div>
                    <div>
                        <p className="admin-stat-value">{outOfStock}</p>
                        <p className="admin-stat-label">Out of Stock</p>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="admin-card">
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/admin/products" className="btn-admin-primary" style={{ textDecoration: 'none' }}>+ Add New Product</Link>
                    <Link to="/admin/orders" className="btn-admin-ghost" style={{ textDecoration: 'none' }}>View All Orders</Link>
                </div>
            </div>

            {/* RECENT ORDERS */}
            <div>
                <h3 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 700 }}>Recent Orders</h3>
                {recentOrders.length === 0 ? (
                    <div className="admin-card admin-empty">
                        <p>No orders placed yet. Orders placed on the website will appear here.</p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(o => (
                                    <tr key={o._id || o.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            #{(o._id || o.id || '').toString().slice(-8).toUpperCase()}
                                        </td>
                                        <td>{o.customerInfo?.firstName} {o.customerInfo?.lastName}</td>
                                        <td style={{ fontWeight: 600 }}>₹{o.totals?.total}</td>
                                        <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                                        <td><span className={`badge ${statusColor(o.orderStatus)}`}>{o.orderStatus || 'Processing'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
