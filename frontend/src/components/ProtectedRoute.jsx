import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ requiredRole }) {
    const { token, role } = useAuth();

    if (!token) {
        // Not logged in
        return <Navigate to="/login" />;
    }

    if (requiredRole && role !== requiredRole) {
        // Logged in, but wrong role
        // You could redirect to a "Not Authorized" page or back to a default page
        return <Navigate to="/" />;
    }

    return <Outlet />; // Render the child route component
}

export default ProtectedRoute;