import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const { role } = useAuth();

    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Patient Routes */}
                <Route element={<ProtectedRoute requiredRole="patient" />}>
                    <Route path="/patient" element={<PatientDashboard />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Redirect root path based on role */}
                <Route path="/" element={
                    role === 'admin' ? <Navigate to="/admin" /> :
                    role === 'patient' ? <Navigate to="/patient" /> :
                    <Navigate to="/login" />
                } />
            </Route>
        </Routes>
    );
}

export default App;