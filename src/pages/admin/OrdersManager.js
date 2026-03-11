import React, { useState } from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useAdmin } from './AdminContext';

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusBadge = (s) => {
    if (s === 'Delivered') return 'badge-green';
    if (s === 'Shipped') return 'badge-blue';
    if (s === 'Processing') return 'badge-yellow';
    if (s === 'Cancelled') return 'badge-red';
    return 'badge-gray';
};

const OrdersManager = () => {
    const { orders: rawOrders } = useAdmin();
    const [orders, setOrders] = useState(() =>
        rawOrders.map(o => ({ ...o, orderStatus: o.orderStatus || 'Processing' }))
    );
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [expanded, setExpanded] = useState(null);

    // Try to also fetch live orders from backend if available
    React.useEffect(() => {
        fetch('http://localhost:5000/api/orders')
            .then(r => r.json())
            .then(data => {
                // Backend returns { success, orders: [...] }
                const list = data.orders || (Array.isArray(data) ? data : []);
                if (list.length > 0) setOrders(list);
            })
            .catch(() => { }); // silently fail if backend is down
    }, []);

    const updateStatus = async (id, newStatus) => {
        // Try backend first
        try {
            await fetch(`http://localhost:5000/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderStatus: newStatus })
            });
        } catch (e) { } // ok if offline

        // Update locally
        setOrders(prev => prev.map(o =>
            (o._id === id || o.id === id) ? { ...o, orderStatus: newStatus } : o
        ));
    };

    const filtered = orders.filter(o => {
        const matchStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
        const name = `${o.customerInfo?.firstName || ''} ${o.customerInfo?.lastName || ''}`.toLowerCase();
        const matchSearch = name.includes(search.toLowerCase()) || (o.customerInfo?.email || '').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const toggle = (id) => setExpanded(e => e === id ? null : id);

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Orders</h2>
                    <p className="admin-page-subtitle">{orders.length} total orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-search">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <FiSearch style={{ color: '#94a3b8' }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        style={{ flex: 1, maxWidth: 320, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '0.88rem' }}
                    />
                </div>
                <select className="status-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Order Count Badges */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['All', ...STATUS_OPTIONS].map(s => {
                    const count = s === 'All' ? orders.length : orders.filter(o => o.orderStatus === s).length;
                    return (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            style={{
                                padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                                background: filterStatus === s ? '#0f172a' : '#f1f5f9',
                                color: filterStatus === s ? 'white' : '#64748b'
                            }}>
                            {s} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="admin-card admin-empty">
                    <FiRefreshCw />
                    <p>No orders found. Orders placed on your website will appear here.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => {
                                const oid = o._id || o.id || '';
                                const isOpen = expanded === oid;
                                return (
                                    <React.Fragment key={oid}>
                                        <tr onClick={() => toggle(oid)} style={{ cursor: 'pointer' }}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                #{oid.toString().slice(-8).toUpperCase()}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{o.customerInfo?.firstName} {o.customerInfo?.lastName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.customerInfo?.email}</div>
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                                                {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}
                                            </td>
                                            <td>{o.orderItems?.length || 0} item(s)</td>
                                            <td style={{ fontWeight: 700 }}>₹{o.totals?.total?.toLocaleString()}</td>
                                            <td><span className={`badge ${o.payment?.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{o.payment?.method?.toUpperCase()} · {o.payment?.status || 'Pending'}</span></td>
                                            <td><span className={`badge ${statusBadge(o.orderStatus)}`}>{o.orderStatus}</span></td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <select
                                                    className="status-select"
                                                    value={o.orderStatus || 'Processing'}
                                                    onChange={e => updateStatus(oid, e.target.value)}
                                                >
                                                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                        </tr>

                                        {/* Expanded Items */}
                                        {isOpen && (
                                            <tr>
                                                <td colSpan={8} style={{ background: '#f8fafc', padding: '0' }}>
                                                    <div style={{ padding: '16px 24px' }}>
                                                        <h4 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Order Items</h4>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                            <thead>
                                                                <tr style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                                    <th style={{ textAlign: 'left', padding: '6px 12px' }}>Product</th>
                                                                    <th style={{ textAlign: 'left', padding: '6px 12px' }}>Volume</th>
                                                                    <th style={{ textAlign: 'left', padding: '6px 12px' }}>Qty</th>
                                                                    <th style={{ textAlign: 'left', padding: '6px 12px' }}>Unit Price</th>
                                                                    <th style={{ textAlign: 'left', padding: '6px 12px' }}>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(o.orderItems || []).map((item, i) => (
                                                                    <tr key={i} style={{ fontSize: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
                                                                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{item.title}</td>
                                                                        <td style={{ padding: '8px 12px' }}>{item.volume}</td>
                                                                        <td style={{ padding: '8px 12px' }}>{item.quantity}</td>
                                                                        <td style={{ padding: '8px 12px' }}>₹{item.price}</td>
                                                                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <div style={{ marginTop: '12px', display: 'flex', gap: '24px', fontSize: '0.85rem', color: '#475569' }}>
                                                            <span>Subtotal: ₹{o.totals?.subtotal}</span>
                                                            <span>Shipping: ₹{o.totals?.shipping}</span>
                                                            <span>Tax (GST): ₹{o.totals?.tax}</span>
                                                            <span style={{ fontWeight: 700, color: '#0f172a' }}>Total: ₹{o.totals?.total}</span>
                                                        </div>
                                                        <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                                                            Delivery: {o.customerInfo?.address}, {o.customerInfo?.city} - {o.customerInfo?.zip}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersManager;
