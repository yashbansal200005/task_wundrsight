import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAction } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            loginAction(response.data); // This will handle token, role, and navigation
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Login failed');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
             <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;