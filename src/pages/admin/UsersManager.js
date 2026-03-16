import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiMail, FiCalendar } from 'react-icons/fi';
import './UsersManager.css';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/users');
                const data = await response.json();
                if (data.success) {
                    setUsers(data.users);
                } else {
                    setError(data.message || 'Failed to fetch users');
                }
            } catch (err) {
                setError('Cannot connect to the server. Please ensure the backend is running.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) return <div className="loading-spinner">Loading users...</div>;

    return (
        <div className="users-manager">
            <div className="users-header">
                <div className="header-title">
                    <h1>User Management</h1>
                    <p>View and manage all registered platform users</p>
                </div>
                <div className="users-stats">
                    <div className="stat-card">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{users.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Active Today</span>
                        <span className="stat-value">{Math.floor(users.length * 0.4)}</span>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Date Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="user-detail">
                                            <div className="user-name">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="user-email-row">
                                        <FiMail style={{ marginRight: '8px', verticalAlign: 'middle', color: '#94a3b8' }} />
                                        {user.email}
                                    </div>
                                </td>
                                <td>
                                    <span className="role-badge role-user">Customer</span>
                                </td>
                                <td>
                                    <div className="date-joined">
                                        <FiCalendar style={{ marginRight: '8px', verticalAlign: 'middle', color: '#94a3b8' }} />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <button className="view-btn" style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontWeight: '600' }}>View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManager;
