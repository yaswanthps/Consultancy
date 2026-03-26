import React, { useState } from 'react';
import { FiSearch, FiTrash2, FiMail, FiUser, FiCalendar, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { useAdmin } from './AdminContext';
import { API_BASE_URL } from '../../api/config';

const AdminMessages = () => {
    const { messages, dbConnected, deleteMessage, markMessageRead, refreshMessages } = useAdmin();
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);

    // Filtered list based on search
    const filtered = (messages || []).filter(m =>
        (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.subject || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        await deleteMessage(id);
    };

    const toggle = (id) => {
        setExpanded(e => e === id ? null : id);
        const msg = (messages || []).find(m => m._id === id);
        if (msg && msg.status === 'unread') {
            markMessageRead(id);
        }
    };

    return (
        <div className="admin-messages">
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 className="admin-page-title">Contact Messages</h2>
                    <p className="admin-page-subtitle">{(messages || []).length} total inquiries</p>
                </div>
                <button
                    onClick={refreshMessages}
                    className="btn-admin-ghost"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FiCalendar /> Refresh List
                </button>
            </div>

            {/* Filters */}
            <div className="admin-search">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <FiSearch style={{ color: '#94a3b8' }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, email or subject..."
                        style={{ flex: 1, maxWidth: 320, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '0.88rem' }}
                    />
                </div>
                {!dbConnected && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Backend Offline?</span>}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state" style={{ padding: '60px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', marginTop: '20px' }}>
                    <FiMail size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 10px 0' }}>No messages found.</p>
                    <p style={{ fontSize: '0.85rem' }}>
                        Ensure your backend server is running at <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>{API_BASE_URL}</code>
                    </p>
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={refreshMessages} className="btn-admin-primary">Retry Connection</button>
                    </div>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Date</th>
                                <th>From</th>
                                <th>Subject</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((msg) => (
                                <React.Fragment key={msg._id}>
                                    <tr
                                        className={`clickable-row ${expanded === msg._id ? 'active' : ''} ${msg.status === 'unread' ? 'unread-row' : ''}`}
                                        onClick={() => toggle(msg._id)}
                                        style={{ background: msg.status === 'unread' ? '#f0f9ff' : 'transparent', cursor: 'pointer' }}
                                    >
                                        <td>
                                            {msg.status === 'unread' ? (
                                                <span className="badge badge-blue">New</span>
                                            ) : (
                                                <span className="badge badge-gray" style={{ opacity: 0.5 }}>Read</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                {msg.date ? new Date(msg.date).toLocaleDateString() : '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: msg.status === 'unread' ? 700 : 600, color: '#0f172a' }}>{msg.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{msg.email}</div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: msg.status === 'unread' ? 700 : 500 }}>{msg.subject || 'No Subject'}</span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="action-btn delete"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                                                title="Delete Message"
                                                style={{ padding: '6px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === msg._id && (
                                        <tr className="expand-row">
                                            <td colSpan="5">
                                                <div className="order-details-card" style={{ padding: '20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                                        <div>
                                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><FiUser /> Contact Info</h4>
                                                            <p style={{ margin: '4px 0' }}><strong>Name:</strong> {msg.name}</p>
                                                            <p style={{ margin: '4px 0' }}><strong>Email:</strong> {msg.email}</p>
                                                            <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {msg.phone || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><FiMessageCircle /> Message Body</h4>
                                                            <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', color: '#334155' }}>
                                                                {msg.message}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
