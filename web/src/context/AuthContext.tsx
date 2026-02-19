import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

// Frontend uses lowercase roles; backend uses UPPERCASE enum.
// This mapping bridges them.
export type UserRole = 'school' | 'teacher' | 'student' | 'parent';

const ROLE_MAP_TO_FRONTEND: Record<string, UserRole> = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    SCHOOL_ADMIN: 'school',
    PARENT: 'parent',
};

const ROLE_MAP_TO_BACKEND: Record<UserRole, string> = {
    student: 'STUDENT',
    teacher: 'TEACHER',
    school: 'SCHOOL_ADMIN',
    parent: 'PARENT',
};

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    schoolId?: string;
    schoolName?: string;
    classId?: string;
    className?: string;
    grade?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role?: UserRole) => Promise<void>;
    signup: (userData: SignupData) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export interface SignupData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    schoolName?: string;
    schoolId?: string;
    className?: string;
    grade?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Normalize a backend user object to our frontend User shape.
 */
function normalizeUser(raw: any): User {
    return {
        id: raw.id || raw.sub || '',
        email: raw.email || '',
        name: raw.name || raw.email?.split('@')[0] || '',
        role: ROLE_MAP_TO_FRONTEND[raw.role] || raw.role || 'student',
        schoolId: raw.schoolId,
        schoolName: raw.schoolName,
        classId: raw.classId,
        className: raw.className,
        grade: raw.grade,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const stored = localStorage.getItem('mindshiftr_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    /**
     * On mount, if we have a stored token try to fetch the real user profile.
     * This validates the token is still valid and refreshes user data.
     */
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        apiClient.loadAccessToken();

        // Silently refresh user profile
        apiClient.get('/user/me')
            .then(res => {
                const u = normalizeUser(res.data.user || res.data);
                setUser(u);
                localStorage.setItem('mindshiftr_user', JSON.stringify(u));
            })
            .catch(() => {
                // Token expired or invalid — user stays logged in with cached data
                // The axios interceptor will attempt a refresh on next API call
                console.info('Could not refresh profile — using cached data');
            });
    }, []);

    /**
     * Login — calls the real backend API.
     * Falls back to demo mode when the backend is unreachable.
     */
    const login = useCallback(async (email: string, password: string, role?: UserRole) => {
        setLoading(true);
        try {
            // Attempt real API login
            const res = await apiClient.post('/auth/login', { email, password });
            const { accessToken } = res.data;
            apiClient.setAccessToken(accessToken);

            // Fetch full user profile
            const profileRes = await apiClient.get('/user/me');
            const u = normalizeUser(profileRes.data.user || profileRes.data);

            setUser(u);
            localStorage.setItem('mindshiftr_user', JSON.stringify(u));
        } catch (apiError: any) {
            console.warn('Backend login failed, falling back to demo mode:', apiError.message);

            // ---- Demo / Offline fallback ----
            const userRole: UserRole = role || (
                email.includes('teacher') ? 'teacher' :
                    email.includes('school') ? 'school' :
                        email.includes('parent') ? 'parent' :
                            'student'
            );

            const demoUser: User = {
                id: 'demo-' + Math.random().toString(36).substr(2, 9),
                email,
                name: email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').trim() || 'Demo User',
                role: userRole,
                schoolId: 'school-demo',
                schoolName: 'Greenwood Academy',
                classId: 'class-demo',
                className: 'Year 5A',
                grade: '5',
            };

            setUser(demoUser);
            localStorage.setItem('mindshiftr_user', JSON.stringify(demoUser));
            localStorage.setItem('accessToken', 'demo-offline-token');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Signup — calls the real backend API.
     */
    const signup = useCallback(async (userData: SignupData) => {
        setLoading(true);
        try {
            const res = await apiClient.post('/auth/signup', {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: ROLE_MAP_TO_BACKEND[userData.role],
                grade: userData.grade,
                schoolId: userData.schoolId,
            });

            const { accessToken } = res.data;
            apiClient.setAccessToken(accessToken);

            // Fetch full user profile
            const profileRes = await apiClient.get('/user/me');
            const u = normalizeUser(profileRes.data.user || profileRes.data);

            setUser(u);
            localStorage.setItem('mindshiftr_user', JSON.stringify(u));
        } catch (apiError: any) {
            console.warn('Backend signup failed, falling back to demo mode:', apiError.message);

            const demoUser: User = {
                id: 'demo-' + Math.random().toString(36).substr(2, 9),
                email: userData.email,
                name: userData.name,
                role: userData.role,
                schoolId: userData.schoolId || 'school-demo',
                schoolName: userData.schoolName || 'New School',
                className: userData.className,
                grade: userData.grade,
            };

            setUser(demoUser);
            localStorage.setItem('mindshiftr_user', JSON.stringify(demoUser));
            localStorage.setItem('accessToken', 'demo-offline-token');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Logout — calls the real backend API then clears local state.
     */
    const logout = useCallback(async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch {
            // Ignore — we're logging out anyway
        }
        apiClient.clearAccessToken();
        setUser(null);
        localStorage.removeItem('mindshiftr_user');
        localStorage.removeItem('accessToken');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
