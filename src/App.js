import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProductDetail from './pages/ProductDetail';
import BuyProducts from './pages/BuyProducts';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import OrdersManager from './pages/admin/OrdersManager';
import Analytics from './pages/admin/Analytics';
import AdminMessages from './pages/admin/AdminMessages';
import UsersManager from './pages/admin/UsersManager';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuth') === 'true');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(localStorage.getItem('isAdminAuth') === 'true');

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('isAdminAuth');
  };

  return (
    <Router>
      <Routes>
        {/* === ADMIN ROUTES === */}
        <Route path="/admin/*" element={
          isAdminAuthenticated ? (
            <AdminLayout onLogout={handleAdminLogout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductsManager />} />
                <Route path="/orders" element={<OrdersManager />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/messages" element={<AdminMessages />} />
                <Route path="/users" element={<UsersManager />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/" replace />
          )
        } />

        {/* === PUBLIC ROUTES === */}
        <Route path="/*" element={
          !isAuthenticated && !isAdminAuthenticated ? (
            <Auth onLogin={(role) => {
              if (role === 'admin') {
                setIsAdminAuthenticated(true);
                localStorage.setItem('isAdminAuth', 'true');
              } else {
                setIsAuthenticated(true);
                localStorage.setItem('isAuth', 'true');
              }
            }} />
          ) : (
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Projects />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/buy-products" element={<BuyProducts />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            )
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
