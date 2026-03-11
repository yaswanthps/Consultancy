import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiHome, FiBox, FiShoppingCart, FiLogOut, FiBarChart2
} from 'react-icons/fi';
import { AdminProvider } from './AdminContext';
import './AdminLayout.css';

const AdminLayout = ({ children, onLogout }) => {
    return (
        <AdminProvider>
            <div className="admin-layout">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="admin-brand">
                        <h2>Surfaux Admin</h2>
                        <p>Management Console</p>
                    </div>

                    <nav className="admin-nav">
                        <div className="admin-nav-section">Main</div>
                        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                            <FiHome /> Dashboard
                        </NavLink>
                        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                            <FiBox /> Products
                        </NavLink>

                        <div className="admin-nav-section">Commerce</div>
                        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                            <FiShoppingCart /> Orders
                        </NavLink>
                        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                            <FiBarChart2 /> Analytics
                        </NavLink>
                    </nav>

                    <div className="admin-logout">
                        <button onClick={onLogout} className="admin-logout-btn">
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="admin-main">
                    <header className="admin-header">
                        <span className="admin-header-title">Admin Panel</span>
                        <div className="admin-header-right">
                            <div className="admin-avatar">A</div>
                        </div>
                    </header>
                    <div className="admin-content-area">
                        {children}
                    </div>
                </main>
            </div>
        </AdminProvider>
    );
};

export default AdminLayout;
