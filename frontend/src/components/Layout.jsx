// src/components/Layout.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
    const { token, role, logoutAction } = useAuth();

    return (
        <>
            <nav>
                {/* <NavLink to="/">Home</NavLink>  <-- DELETE THIS LINE */}
                {role === 'patient' && <NavLink to="/patient">Dashboard</NavLink>}
                {role === 'patient' && <NavLink to="/my-bookings">My Bookings</NavLink>}
                {role === 'admin' && <NavLink to="/admin">Admin Dashboard</NavLink>}
                
                <div style={{ marginLeft: 'auto' }}>
                    {token ? (
                        <button onClick={logoutAction}>Logout</button>
                    ) : (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register">Register</NavLink>
                        </>
                    )}
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;