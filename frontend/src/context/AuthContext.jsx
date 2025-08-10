import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const navigate = useNavigate();

    useEffect(() => {
        // On initial load, read from localStorage
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
        }
    }, []);

    const loginAction = (data) => {
        setToken(data.token);
        setRole(data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        // Redirect based on role
        if (data.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/patient');
        }
    };

    const logoutAction = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const authContextValue = {
        token,
        role,
        loginAction,
        logoutAction,
    };

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};