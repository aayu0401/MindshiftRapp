import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-state" style={{ minHeight: '100vh', background: '#020617' }}>
                <FaSpinner className="spinner" />
                <h2 className="loading-text-hitech">Verifying Credentials...</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>SECURE UPLINK IN PROGRESS</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.warn('ProtectedRoute: Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.warn(`ProtectedRoute: Role "${user.role}" not in allowed roles:`, allowedRoles);
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
