import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser, FaEnvelope, FaLock, FaSchool, FaGraduationCap, FaChalkboardTeacher,
    FaArrowRight, FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Signup.css';

type Role = 'student' | 'teacher' | 'school' | 'parent';

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Common fields
        name: '',
        email: '',
        password: '',
        confirmPassword: '',

        // Student fields
        grade: '',
        studentId: '',

        // Teacher fields
        subject: '',
        yearsExperience: '',

        // School fields
        schoolName: '',
        phone: '',
        address: '',
        principalName: ''
    });

    const steps = [
        { number: 1, title: 'Choose Role', description: 'Select your account type' },
        { number: 2, title: 'Basic Info', description: 'Your personal details' },
        { number: 3, title: 'Role Details', description: 'Additional information' },
        { number: 4, title: 'Complete', description: 'Review and confirm' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setTimeout(() => setCurrentStep(2), 300);
    };

    const handleNext = () => {
        if (currentStep === 2) {
            if (!formData.name || !formData.email || !formData.password) {
                toast.error('Please fill all required fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const roles = [
        {
            id: 'student' as Role,
            name: 'Student',
            icon: <FaGraduationCap />,
            color: '#3b82f6',
            description: 'Access mental health stories and courses',
            features: ['Interactive stories', 'Self-assessments', 'Progress tracking']
        },
        {
            id: 'teacher' as Role,
            name: 'Teacher',
            icon: <FaChalkboardTeacher />,
            color: '#8b5cf6',
            description: 'Monitor students and create content',
            features: ['Student analytics', 'AI story creator', 'Class management']
        },
        {
            id: 'school' as Role,
            name: 'School Admin',
            icon: <FaSchool />,
            color: '#00d4aa',
            description: 'Manage school-wide mental health program',
            features: ['School dashboard', 'Multi-class view', 'Reports & exports']
        },
        {
            id: 'parent' as Role,
            name: 'Parent',
            icon: <FaUser />,
            color: '#f59e0b',
            description: 'Monitor your childs progress',
            features: ['Progress reports', 'Wellbeing insights', 'Home resources']
        }
    ];

    const handleSubmit = async () => {
        setIsLoading(true);

        setTimeout(async () => {
            try {
                await signup({
                    email: formData.email,
                    password: formData.password,
                    role: selectedRole!,
                    name: formData.name,
                    grade: formData.grade,
                    schoolName: formData.schoolName,
                    className: selectedRole === 'student' ? 'Pending Assignment' : undefined
                });
                toast.success('Account created successfully!');

                // Redirect to respective dashboard
                if (selectedRole === 'teacher' || selectedRole === 'school') {
                    navigate('/dashboard');
                } else if (selectedRole === 'student') {
                    navigate('/student-dashboard');
                } else {
                    navigate('/parent-portal');
                }
            } catch (error) {
                toast.error('Signup failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    const currentRoleData = roles.find(r => r.id === selectedRole);

    return (
        <div className="signup-page">
            {/* Animated Background */}
            <div className="signup-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="signup-container">
                {/* Progress Sidebar */}
                <motion.div
                    className="signup-sidebar"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link to="/" className="brand-logo">
                        <motion.div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <span className="brand-icon">📚</span>
                            <span className="brand-name">Mindshiftr</span>
                        </motion.div>
                    </Link>

                    <div className="progress-steps">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                            >
                                <div className="step-indicator">
                                    {currentStep > step.number ? (
                                        <FaCheckCircle />
                                    ) : (
                                        <span>{step.number}</span>
                                    )}
                                </div>
                                <div className="step-info">
                                    <div className="step-title">{step.title}</div>
                                    <div className="step-description">{step.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-footer">
                        <p>Already have an account?</p>
                        <Link to="/login" className="login-link">
                            Sign In <FaArrowRight />
                        </Link>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="signup-content"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="signup-card">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Role Selection */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="step-content"
                                >
                                    <div className="step-header">
                                        <h2>Choose Your Role</h2>
                                        <p>Select the account type that best describes you</p>
                                    </div>

                                    <div className="role-grid">
                                        {roles.map((role) => (
                                            <motion.div
                                                key={role.id}
                                                className="role-option"
                                                onClick={() => handleRoleSelect(role.id)}
                                                whileHover={{ scale: 1.02, y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{
                                                    '--role-color': role.color,
                                                    '--role-color-alpha': `${role.color}4D` // 30% opacity
                                                } as React.CSSProperties}
                                            >
                                                <div className="role-icon-large" style={{ color: role.color }}>
                                                    {role.icon}
                                                </div>
                                                <h3>{role.name}</h3>
                                                <p className="role-description">{role.description}</p>
                                                <ul className="role-features">
                                                    {role.features.map((feature, i) => (
                                                        <li key={i}>
                                                            <FaCheckCircle style={{ color: role.color }} />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="select-button" style={{ background: role.color }}>
                                                    Connect as {role.name}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Basic Information */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="step-content"
                                >
                                    <div className="step-header">
                                        <div className="role-badge" style={{ background: currentRoleData?.color }}>
                                            {currentRoleData?.icon}
                                            <span>{currentRoleData?.name}</span>
                                        </div>
                                        <h2>Basic Information</h2>
                                        <p>Tell us about yourself</p>
                                    </div>

                                    <form className="signup-form">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <div className="input-wrapper">
                                                <FaUser className="input-icon" />
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <div className="input-wrapper">
                                                <FaEnvelope className="input-icon" />
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="password">Password *</label>
                                                <div className="input-wrapper">
                                                    <FaLock className="input-icon" />
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        placeholder="Create password"
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

                                            <div className="form-group">
                                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                                <div className="input-wrapper">
                                                    <FaLock className="input-icon" />
                                                    <input
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        placeholder="Confirm password"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="step-actions">
                                        <button className="btn-secondary" onClick={handleBack}>
                                            <FaArrowLeft /> Back
                                        </button>
                                        <button className="btn-primary" onClick={handleNext}>
                                            Continue <FaArrowRight />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Role-Specific Details */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="step-content"
                                >
                                    <div className="step-header">
                                        <h2>{currentRoleData?.name} Details</h2>
                                        <p>Additional information for your account</p>
                                    </div>

                                    <form className="signup-form">
                                        {selectedRole === 'student' && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="grade">Grade/Year *</label>
                                                    <select
                                                        id="grade"
                                                        name="grade"
                                                        value={formData.grade}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Select grade</option>
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i} value={`Year ${i + 1}`}>Year {i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="studentId">Student ID (Optional)</label>
                                                    <input
                                                        id="studentId"
                                                        name="studentId"
                                                        type="text"
                                                        value={formData.studentId}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter student ID"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedRole === 'teacher' && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="subject">Subject/Specialty *</label>
                                                    <input
                                                        id="subject"
                                                        name="subject"
                                                        type="text"
                                                        value={formData.subject}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., Psychology, Counseling"
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="yearsExperience">Years of Experience *</label>
                                                    <select
                                                        id="yearsExperience"
                                                        name="yearsExperience"
                                                        value={formData.yearsExperience}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Select experience</option>
                                                        <option value="0-2">0-2 years</option>
                                                        <option value="3-5">3-5 years</option>
                                                        <option value="6-10">6-10 years</option>
                                                        <option value="10+">10+ years</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        {selectedRole === 'school' && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="schoolName">School Name *</label>
                                                    <div className="input-wrapper">
                                                        <FaSchool className="input-icon" />
                                                        <input
                                                            id="schoolName"
                                                            name="schoolName"
                                                            type="text"
                                                            value={formData.schoolName}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter school name"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="principalName">Principal Name *</label>
                                                    <input
                                                        id="principalName"
                                                        name="principalName"
                                                        type="text"
                                                        value={formData.principalName}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter principal's name"
                                                        required
                                                    />
                                                </div>

                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label htmlFor="phone">Phone Number *</label>
                                                        <div className="input-wrapper">
                                                            <FaPhone className="input-icon" />
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="tel"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                                placeholder="(123) 456-7890"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="address">Address *</label>
                                                        <div className="input-wrapper">
                                                            <FaMapMarkerAlt className="input-icon" />
                                                            <input
                                                                id="address"
                                                                name="address"
                                                                type="text"
                                                                value={formData.address}
                                                                onChange={handleInputChange}
                                                                placeholder="School address"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </form>

                                    <div className="step-actions">
                                        <button className="btn-secondary" onClick={handleBack}>
                                            <FaArrowLeft /> Back
                                        </button>
                                        <button className="btn-primary" onClick={handleNext}>
                                            Continue <FaArrowRight />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Complete */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="step-content"
                                >
                                    <div className="step-header">
                                        <div className="success-icon">
                                            <FaCheckCircle />
                                        </div>
                                        <h2>Review Your Information</h2>
                                        <p>Please confirm your details are correct</p>
                                    </div>

                                    <div className="review-section">
                                        <div className="review-item">
                                            <span className="review-label">Role:</span>
                                            <span className="review-value">{currentRoleData?.name}</span>
                                        </div>
                                        <div className="review-item">
                                            <span className="review-label">Name:</span>
                                            <span className="review-value">{formData.name}</span>
                                        </div>
                                        <div className="review-item">
                                            <span className="review-label">Email:</span>
                                            <span className="review-value">{formData.email}</span>
                                        </div>
                                        {selectedRole === 'student' && formData.grade && (
                                            <div className="review-item">
                                                <span className="review-label">Grade:</span>
                                                <span className="review-value">{formData.grade}</span>
                                            </div>
                                        )}
                                        {selectedRole === 'teacher' && formData.subject && (
                                            <div className="review-item">
                                                <span className="review-label">Subject:</span>
                                                <span className="review-value">{formData.subject}</span>
                                            </div>
                                        )}
                                        {selectedRole === 'school' && formData.schoolName && (
                                            <div className="review-item">
                                                <span className="review-label">School:</span>
                                                <span className="review-value">{formData.schoolName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="terms-section">
                                        <label className="checkbox-label">
                                            <input type="checkbox" required />
                                            <span>I agree to the Terms of Service and Privacy Policy</span>
                                        </label>
                                    </div>

                                    <div className="step-actions">
                                        <button className="btn-secondary" onClick={handleBack}>
                                            <FaArrowLeft /> Back
                                        </button>
                                        <button
                                            className="btn-primary btn-submit"
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <span className="loading-spinner"></span>
                                            ) : (
                                                <>
                                                    Create Account <FaCheckCircle />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
