import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'school' | 'teacher' | 'student';

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
    login: (email: string, password: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('mindshiftr_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            // Mock login - in production, this would call your API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user data based on email
            const mockUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                email,
                name: email.split('@')[0],
                role: email.includes('teacher') ? 'teacher' : email.includes('school') ? 'school' : 'student',
                schoolId: 'school-123',
                schoolName: 'Greenwood Academy',
                classId: 'class-456',
                className: 'Year 5A',
                grade: '5'
            };

            setUser(mockUser);
            localStorage.setItem('mindshiftr_user', JSON.stringify(mockUser));
        } catch (error) {
            throw new Error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData: SignupData) => {
        setLoading(true);
        try {
            // Mock signup - in production, this would call your API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                email: userData.email,
                name: userData.name,
                role: userData.role,
                schoolId: userData.schoolId || 'school-' + Math.random().toString(36).substr(2, 9),
                schoolName: userData.schoolName || 'New School',
                classId: userData.role === 'student' ? 'class-' + Math.random().toString(36).substr(2, 9) : undefined,
                className: userData.className,
                grade: userData.grade
            };

            setUser(newUser);
            localStorage.setItem('mindshiftr_user', JSON.stringify(newUser));
        } catch (error) {
            throw new Error('Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mindshiftr_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                loading
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
