import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-primary, #f8fafc)',
                gap: '1rem',
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid rgba(14, 165, 233, 0.15)',
                    borderTopColor: '#0ea5e9',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{
                    color: 'var(--color-text-secondary, #64748b)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                }}>
                    Verifying your session…
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.warn(`ProtectedRoute: Role "${user.role}" not in allowed roles:`, allowedRoles);
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
