import React from 'react';
import { useAdmin } from './AdminContext';

const Analytics = () => {
    const { products, orders } = useAdmin();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
    const avgOrderValue = orders.length ? (totalRevenue / orders.length).toFixed(0) : 0;

    // Revenue by status
    const byStatus = {};
    orders.forEach(o => {
        const s = o.orderStatus || 'Processing';
        byStatus[s] = (byStatus[s] || 0) + 1;
    });

    // Top selling products from orders
    const productSales = {};
    orders.forEach(o => {
        (o.orderItems || []).forEach(item => {
            productSales[item.title] = (productSales[item.title] || 0) + item.quantity;
        });
    });
    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Stock breakdown
    const inStock = products.filter(p => p.availability === 'In Stock').length;
    const lowStock = products.filter(p => p.availability === 'Low Stock').length;
    const outOfStock = products.filter(p => p.availability === 'Out of Stock').length;

    const Bar = ({ value, max, color }) => (
        <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden', flex: 1, marginLeft: 12 }}>
            <div style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color, height: '100%', borderRadius: 99, transition: 'width 0.5s' }} />
        </div>
    );

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Analytics</h2>
                    <p className="admin-page-subtitle">Store performance overview</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Revenue Card */}
                <div className="admin-card">
                    <h3>Revenue Summary</h3>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>₹{totalRevenue.toLocaleString()}</p>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>Total Revenue</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>₹{Number(avgOrderValue).toLocaleString()}</p>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>Avg Order Value</p>
                        </div>
                    </div>
                </div>

                {/* Orders by Status */}
                <div className="admin-card">
                    <h3>Orders by Status</h3>
                    {Object.keys(byStatus).length === 0 && <p style={{ color: '#94a3b8' }}>No orders yet.</p>}
                    {Object.entries(byStatus).map(([status, count]) => (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ minWidth: 90, fontSize: '0.82rem', color: '#475569' }}>{status}</span>
                            <Bar value={count} max={orders.length} color={status === 'Delivered' ? '#22c55e' : status === 'Shipped' ? '#3b82f6' : status === 'Cancelled' ? '#ef4444' : '#f59e0b'} />
                            <span style={{ minWidth: 32, textAlign: 'right', fontWeight: 700, fontSize: '0.85rem', marginLeft: 12 }}>{count}</span>
                        </div>
                    ))}
                </div>

                {/* Top Products */}
                <div className="admin-card">
                    <h3>Top Selling Products</h3>
                    {topProducts.length === 0 && <p style={{ color: '#94a3b8' }}>No sales data yet.</p>}
                    {topProducts.map(([name, qty], i) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ marginRight: 12, width: 20, height: 20, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', flexShrink: 0 }}>{i + 1}</span>
                            <span style={{ flex: 1, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                            <Bar value={qty} max={topProducts[0]?.[1] || 1} color="#38bdf8" />
                            <span style={{ minWidth: 40, textAlign: 'right', fontWeight: 700, fontSize: '0.85rem', marginLeft: 12 }}>{qty} sold</span>
                        </div>
                    ))}
                </div>

                {/* Inventory Overview */}
                <div className="admin-card">
                    <h3>Inventory Overview</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                            <span style={{ flex: 1, fontSize: '0.88rem' }}>In Stock</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{inStock}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                            <span style={{ flex: 1, fontSize: '0.88rem' }}>Low Stock (&lt;20 units)</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{lowStock}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                            <span style={{ flex: 1, fontSize: '0.88rem' }}>Out of Stock</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{outOfStock}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
