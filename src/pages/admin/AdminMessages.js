import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiMail, FiUser, FiCalendar, FiPhone, FiMessageCircle } from 'react-icons/fi';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/messages');
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/messages/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setMessages(prev => prev.filter(m => m._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const filtered = messages.filter(m =>
        (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.subject || '').toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id) => setExpanded(e => e === id ? null : id);

    return (
        <div className="admin-messages">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Contact Messages</h2>
                    <p className="admin-page-subtitle">{messages.length} total inquiries</p>
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
                        placeholder="Search by name, email or subject..."
                        style={{ flex: 1, maxWidth: 320, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '0.88rem' }}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">Loading messages...</div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">No messages found.</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
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
                                        className={`clickable-row ${expanded === msg._id ? 'active' : ''}`}
                                        onClick={() => toggle(msg._id)}
                                    >
                                        <td>
                                            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                {new Date(msg.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{msg.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{msg.email}</div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 500 }}>{msg.subject || 'No Subject'}</span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                className="action-btn delete"
                                                onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                                                title="Delete Message"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === msg._id && (
                                        <tr className="expand-row">
                                            <td colSpan="4">
                                                <div className="order-details-card">
                                                    <div className="details-grid">
                                                        <div>
                                                            <h4><FiUser /> Contact Info</h4>
                                                            <p><strong>Name:</strong> {msg.name}</p>
                                                            <p><strong>Email:</strong> {msg.email}</p>
                                                            <p><strong>Phone:</strong> {msg.phone || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <h4><FiMessageCircle /> Message Body</h4>
                                                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginTop: '8px', whiteSpace: 'pre-wrap', color: '#334155' }}>
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
