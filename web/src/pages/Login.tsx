import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserGraduate, FaChalkboardTeacher, FaSchool, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'school'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        {
            id: 'student' as const,
            name: 'Student',
            icon: <FaUserGraduate />,
            color: '#3b82f6',
            description: 'Access stories, courses, and assessments',
            demo: { email: 'student@demo.com', password: 'password' }
        },
        {
            id: 'teacher' as const,
            name: 'Teacher',
            icon: <FaChalkboardTeacher />,
            color: '#8b5cf6',
            description: 'Monitor progress and create content',
            demo: { email: 'teacher@demo.com', password: 'password' }
        },
        {
            id: 'school' as const,
            name: 'School Admin',
            icon: <FaSchool />,
            color: '#00d4aa',
            description: 'Manage school-wide settings',
            demo: { email: 'school@demo.com', password: 'password' }
        }
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const success = login(email, password, selectedRole);
            setIsLoading(false);

            if (success) {
                toast.success(`Welcome back!`);
                if (selectedRole === 'teacher' || selectedRole === 'school') {
                    navigate('/dashboard');
                } else {
                    navigate('/stories');
                }
            } else {
                toast.error('Invalid credentials. Try demo accounts!');
            }
        }, 1000);
    };

    const handleDemoLogin = (role: typeof selectedRole) => {
        const demoAccount = roles.find(r => r.id === role)?.demo;
        if (demoAccount) {
            setEmail(demoAccount.email);
            setPassword(demoAccount.password);
            setSelectedRole(role);
        }
    };

    return (
        <div className="login-page">
            {/* Animated Background */}
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-container">
                {/* Left Side - Branding */}
                <motion.div
                    className="login-branding"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link to="/" className="brand-logo">
                        <span className="brand-icon">📚</span>
                        <span className="brand-name">Mindshiftr</span>
                    </Link>
                    <h1 className="brand-title">Welcome Back</h1>
                    <p className="brand-subtitle">
                        Continue your journey towards emotional wellbeing and mental health literacy
                    </p>

                    <div className="brand-features">
                        <div className="feature-item">
                            <FaCheckCircle />
                            <span>Evidence-based content</span>
                        </div>
                        <div className="feature-item">
                            <FaCheckCircle />
                            <span>Personalized learning</span>
                        </div>
                        <div className="feature-item">
                            <FaCheckCircle />
                            <span>Progress tracking</span>
                        </div>
                    </div>

                    <div className="brand-footer">
                        <p>Don't have an account?</p>
                        <Link to="/signup" className="signup-link">
                            Create Account <FaArrowRight />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    className="login-form-container"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="login-card">
                        <div className="login-header">
                            <h2>Sign In</h2>
                            <p>Select your role to continue</p>
                        </div>

                        {/* Role Selection */}
                        <div className="role-selector">
                            {roles.map((role) => (
                                <motion.button
                                    key={role.id}
                                    className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
                                    onClick={() => setSelectedRole(role.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        borderColor: selectedRole === role.id ? role.color : 'transparent'
                                    }}
                                >
                                    <div className="role-icon" style={{ color: role.color }}>
                                        {role.icon}
                                    </div>
                                    <div className="role-info">
                                        <div className="role-name">{role.name}</div>
                                        <div className="role-desc">{role.description}</div>
                                    </div>
                                    {selectedRole === role.id && (
                                        <motion.div
                                            className="role-check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{ color: role.color }}
                                        >
                                            <FaCheckCircle />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <motion.button
                                type="submit"
                                className="login-button"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        Sign In <FaArrowRight />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Demo Accounts */}
                        <div className="demo-section">
                            <div className="divider">
                                <span>Or try demo accounts</span>
                            </div>
                            <div className="demo-buttons">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        className="demo-btn"
                                        onClick={() => handleDemoLogin(role.id)}
                                        style={{ borderColor: role.color }}
                                    >
                                        {role.icon}
                                        <span>{role.name} Demo</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
