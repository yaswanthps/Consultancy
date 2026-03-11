import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple hardcoded check for the admin dashboard demo
        if (email === 'admin@surfaux.com' && password === 'admin') {
            onLogin();
            navigate('/admin');
        } else {
            setError('Invalid admin credentials. Hint: use admin@surfaux.com / admin');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#0f172a'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ color: '#0f172a', margin: 0, fontSize: '1.8rem' }}>Admin Access</h2>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>Log in to manage the platform</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#475569', fontWeight: 500, fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                            placeholder="admin@surfaux.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#475569', fontWeight: 500, fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#38bdf8',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                    >
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
