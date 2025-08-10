import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Registration failed');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Register;