import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projects } from '../../data/mockData';

const API = 'http://localhost:5000';

const AdminContext = createContext();

// Seed data built from mockData for the GET /api/products/seed call
const seedData = projects.map(p => ({
    id: String(p.id),
    title: p.title,
    category: p.category,
    description: p.description,
    price: p.price || (p.id * 50 + 100),
    stock: 100,
    availability: 'In Stock',
    unit: '1 Liter Bottle',
    image: p.image || '/images/polyester-fabric.webp',
}));

// ----- Helper: localStorage fallback -----
const localSave = (products) => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
};
const localLoad = () => {
    try {
        const s = localStorage.getItem('adminProducts');
        return s ? JSON.parse(s) : null;
    } catch { return null; }
};

// ----- Orders from localStorage (written by Checkout.js) -----
const loadLocalOrders = () => {
    try {
        const s = localStorage.getItem('orders');
        return s ? JSON.parse(s) : [];
    } catch { return []; }
};

export const AdminProvider = ({ children }) => {
    const [products, setProducts] = useState(localLoad() || seedData);
    const [orders, setOrders] = useState(loadLocalOrders());
    const [dbConnected, setDbConnected] = useState(false);

    // ---- Fetch products from backend on mount ----
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Try to seed the DB with mockData (no-op if already seeded)
                await fetch(`${API}/api/products/seed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ products: seedData })
                });

                // 2. Fetch all products from DB
                const res = await fetch(`${API}/api/products`);
                const data = await res.json();
                if (data.success && Array.isArray(data.products) && data.products.length > 0) {
                    // Store _id as "id" for compatibility 
                    const normalized = data.products.map(p => ({ ...p, id: p._id || p.id }));
                    setProducts(normalized);
                    localSave(normalized);
                    setDbConnected(true);
                }

                // 3. Fetch orders from DB
                const oRes = await fetch(`${API}/api/orders`);
                const oData = await oRes.json();
                if (oData.success && Array.isArray(oData.orders)) {
                    setOrders(oData.orders);
                }
            } catch {
                // Backend offline — stay with localStorage data
            }
        };
        init();
    }, []);

    // ---- CRUD handlers ----
    const addProduct = useCallback(async (product) => {
        const newProd = {
            ...product,
            price: Number(product.price) || 0,
            stock: Number(product.stock) || 100,
            availability: Number(product.stock) > 19 ? 'In Stock' : Number(product.stock) > 0 ? 'Low Stock' : 'Out of Stock',
        };
        try {
            if (dbConnected) {
                const res = await fetch(`${API}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProd)
                });
                const data = await res.json();
                if (data.success) {
                    const saved = { ...data.product, id: data.product._id };
                    setProducts(prev => { const u = [saved, ...prev]; localSave(u); return u; });
                    return;
                }
            }
        } catch { }
        // Fallback: local only
        const localProd = { ...newProd, id: Date.now().toString() };
        setProducts(prev => { const u = [localProd, ...prev]; localSave(u); return u; });
    }, [dbConnected]);

    const updateProduct = useCallback(async (id, updates) => {
        const upd = { ...updates, price: Number(updates.price), stock: Number(updates.stock) };
        try {
            if (dbConnected) {
                await fetch(`${API}/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(upd)
                });
            }
        } catch { }
        setProducts(prev => {
            const u = prev.map(p => (p.id === id || p._id === id) ? { ...p, ...upd } : p);
            localSave(u); return u;
        });
    }, [dbConnected]);

    const deleteProduct = useCallback(async (id) => {
        try {
            if (dbConnected) {
                await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
            }
        } catch { }
        setProducts(prev => { const u = prev.filter(p => p.id !== id && p._id !== id); localSave(u); return u; });
    }, [dbConnected]);

    const updateOrderStatus = useCallback(async (id, newStatus) => {
        try {
            if (dbConnected) {
                await fetch(`${API}/api/orders/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderStatus: newStatus })
                });
            }
        } catch { }
        setOrders(prev => prev.map(o => (o._id === id || o.id === id) ? { ...o, orderStatus: newStatus } : o));
    }, [dbConnected]);

    return (
        <AdminContext.Provider value={{ products, orders, dbConnected, addProduct, updateProduct, deleteProduct, updateOrderStatus }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
