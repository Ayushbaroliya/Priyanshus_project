import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute: loading =', loading, ', user =', user);

    if (loading) {
        console.log('ProtectedRoute: Rendering LOADING state');
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log('ProtectedRoute: No user, redirecting to /login');
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'admin') {
        console.log('ProtectedRoute: Access denied for admin-only route, redirecting to /dashboard');
        return <Navigate to="/dashboard" />;
    }

    console.log('ProtectedRoute: Access granted, rendering children');
    return children;
};

export default ProtectedRoute;
