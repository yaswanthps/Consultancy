import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { useAdmin } from './AdminContext';

const CATEGORIES = ['Circular Economy', 'Clean Technology', 'Sustainable Materials', 'Resource Recovery', 'Chemical Innovation'];
const AVAILABILITY_OPTIONS = ['In Stock', 'Low Stock', 'Out of Stock'];

const defaultForm = {
    title: '', category: CATEGORIES[0], description: '',
    price: '', stock: '', availability: 'In Stock',
    unit: '1 Liter Bottle', image: '',
};

const ProductsManager = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null); // null = add mode
    const [form, setForm] = useState(defaultForm);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const filtered = products.filter(p => {
        const matchCat = filterCat === 'All' || p.category === filterCat;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const openAdd = () => {
        setForm(defaultForm);
        setEditProduct(null);
        setShowModal(true);
    };

    const openEdit = (p) => {
        setForm({ ...defaultForm, ...p });
        setEditProduct(p.id);
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditProduct(null); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => {
            const updated = { ...f, [name]: value };
            // Auto-set availability from stock
            if (name === 'stock') {
                const n = Number(value);
                updated.availability = n <= 0 ? 'Out of Stock' : n < 20 ? 'Low Stock' : 'In Stock';
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editProduct !== null) {
            updateProduct(editProduct, { ...form, price: Number(form.price), stock: Number(form.stock) });
        } else {
            addProduct(form);
        }
        closeModal();
    };

    const handleDelete = (id) => {
        deleteProduct(id);
        setConfirmDelete(null);
    };

    const availBadge = (a) => {
        if (a === 'In Stock') return 'badge-green';
        if (a === 'Low Stock') return 'badge-yellow';
        return 'badge-red';
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-page-title">Products</h2>
                    <p className="admin-page-subtitle">{products.length} total products</p>
                </div>
                <button className="btn-admin-primary" onClick={openAdd}>
                    <FiPlus /> Add Product
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
                        placeholder="Search products..."
                        style={{ flex: 1, maxWidth: 320, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '0.88rem' }}
                    />
                </div>
                <select
                    value={filterCat}
                    onChange={e => setFilterCat(e.target.value)}
                    className="status-select"
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Availability</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No products found.</td></tr>
                        )}
                        {filtered.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={p.image} alt={p.title} className="product-thumb" onError={e => e.target.src = '/images/polyester-fabric.webp'} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.88rem', maxWidth: 200 }}>{p.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.unit}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge badge-blue">{p.category}</span></td>
                                <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString()}</td>
                                <td>
                                    <span style={{ color: p.stock < 20 ? '#dc2626' : '#0f172a', fontWeight: p.stock < 20 ? 700 : 400 }}>
                                        {p.stock} units
                                    </span>
                                </td>
                                <td><span className={`badge ${availBadge(p.availability)}`}>{p.availability}</span></td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn-admin-ghost" onClick={() => openEdit(p)} style={{ marginRight: 8 }}>
                                        <FiEdit2 size={14} /> Edit
                                    </button>
                                    <button className="btn-admin-danger" onClick={() => setConfirmDelete(p.id)}>
                                        <FiTrash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="admin-modal-close" onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form-grid">
                            <div className="admin-form-group full-width">
                                <label>Product Title *</label>
                                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. 100% Polyester Fabric Solution" />
                            </div>
                            <div className="admin-form-group">
                                <label>Category *</label>
                                <select name="category" value={form.category} onChange={handleChange}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Unit</label>
                                <input name="unit" value={form.unit} onChange={handleChange} placeholder="e.g. 1 Liter Bottle" />
                            </div>
                            <div className="admin-form-group">
                                <label>Price (₹) *</label>
                                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="0" />
                            </div>
                            <div className="admin-form-group">
                                <label>Stock (units) *</label>
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" placeholder="0" />
                            </div>
                            <div className="admin-form-group">
                                <label>Availability</label>
                                <select name="availability" value={form.availability} onChange={handleChange}>
                                    {AVAILABILITY_OPTIONS.map(a => <option key={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>Image URL</label>
                                <input name="image" value={form.image} onChange={handleChange} placeholder="/images/my-product.jpg" />
                            </div>
                            <div className="admin-form-group full-width">
                                <label>Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Short product description..." />
                            </div>
                            <div className="admin-form-actions">
                                <button type="button" className="btn-admin-ghost" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-admin-primary">
                                    {editProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {confirmDelete && (
                <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">Confirm Delete</h3>
                            <button className="admin-modal-close" onClick={() => setConfirmDelete(null)}><FiX /></button>
                        </div>
                        <p style={{ color: '#64748b', marginBottom: 24 }}>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button className="btn-admin-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                            <button className="btn-admin-danger" onClick={() => handleDelete(confirmDelete)}>Delete Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManager;
