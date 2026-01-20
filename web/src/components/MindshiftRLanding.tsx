import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaBook, FaLaptopCode, FaChartLine, FaUsers, FaHeart, FaShieldAlt, FaStar, FaArrowRight, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import './MindshiftRLanding.css';

export default function MindshiftRLanding() {
    const stats = [
        { number: '10,000+', label: 'Students Supported', icon: <FaUsers /> },
        { number: '500+', label: 'Schools Worldwide', icon: <FaShieldAlt /> },
        { number: '95%', label: 'Engagement Rate', icon: <FaChartLine /> },
        { number: '4.9/5', label: 'Average Rating', icon: <FaStar /> }
    ];

    const features = [
        {
            icon: <FaBrain />,
            title: 'Evidence-Based Psychology',
            description: 'Grounded in CBT and SLT principles, validated by mental health professionals',
            color: '#8b5cf6'
        },
        {
            icon: <FaBook />,
            title: 'Engaging Storytelling',
            description: 'Interactive stories that make mental health concepts accessible and relatable',
            color: '#3b82f6'
        },
        {
            icon: <FaLaptopCode />,
            title: 'AI-Powered Technology',
            description: 'Smart assessments and personalized learning paths for every student',
            color: '#00d4aa'
        }
    ];

    const benefits = [
        {
            title: 'For Students',
            items: ['Build emotional resilience', 'Learn coping strategies', 'Track personal growth', 'Safe space to explore feelings'],
            icon: '🎓',
            color: '#3b82f6'
        },
        {
            title: 'For Teachers',
            items: ['Monitor student wellbeing', 'Identify at-risk students', 'Data-driven insights', 'Ready-to-use resources'],
            icon: '👨‍🏫',
            color: '#8b5cf6'
        },
        {
            title: 'For Parents',
            items: ['Track child progress', 'Understand mental health', 'Support at home', 'Connect with teachers'],
            icon: '👨‍👩‍👧',
            color: '#00d4aa'
        }
    ];

    const testimonials = [
        {
            quote: "Mindshiftr has transformed how we approach mental health in our school. Students are more engaged and open about their feelings.",
            author: "Sarah Johnson",
            role: "School Counselor",
            avatar: "👩‍🏫"
        },
        {
            quote: "The stories are incredible! My students actually look forward to their wellbeing sessions now.",
            author: "Michael Chen",
            role: "Year 5 Teacher",
            avatar: "👨‍🏫"
        },
        {
            quote: "As a parent, I love being able to see my child's progress and support their emotional development at home.",
            author: "Emma Williams",
            role: "Parent",
            avatar: "👩"
        }
    ];

    return (
        <div className="landing-page">
            <Navigation />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                    <div className="hero-orb orb-3"></div>
                </div>

                <div className="container">
                    <div className="hero-content">
                        <motion.div
                            className="hero-text"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="hero-badge">
                                <FaHeart /> Trusted by 500+ Schools Worldwide
                            </div>

                            <h1 className="hero-title">
                                Every Story
                                <span className="gradient-text"> Matters</span>
                            </h1>

                            <p className="hero-subtitle">
                                Transform mental health education with AI-powered storytelling, evidence-based assessments, and real-time analytics for schools.
                            </p>

                            <div className="hero-cta">
                                <Link to="/signup" className="btn-hero-primary">
                                    Get Started Free
                                    <FaArrowRight />
                                </Link>
                                <button className="btn-hero-secondary">
                                    <FaPlay />
                                    Watch Demo
                                </button>
                            </div>

                            <div className="hero-trust">
                                <div className="trust-avatars">
                                    <span className="avatar">👨‍🏫</span>
                                    <span className="avatar">👩‍🏫</span>
                                    <span className="avatar">👨‍💼</span>
                                    <span className="avatar">👩‍💼</span>
                                </div>
                                <div className="trust-text">
                                    <strong>Join 10,000+ educators</strong>
                                    <span>making mental health a priority</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hero-visual"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="dashboard-preview">
                                <div className="preview-header">
                                    <div className="preview-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span className="preview-title">Teacher Dashboard</span>
                                </div>
                                <div className="preview-content">
                                    <div className="preview-stats">
                                        <div className="preview-stat">
                                            <div className="stat-icon">📊</div>
                                            <div className="stat-info">
                                                <div className="stat-value">124</div>
                                                <div className="stat-label">Active Students</div>
                                            </div>
                                        </div>
                                        <div className="preview-stat">
                                            <div className="stat-icon">📚</div>
                                            <div className="stat-info">
                                                <div className="stat-value">342</div>
                                                <div className="stat-label">Stories Read</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="preview-chart">
                                        <div className="chart-bar" style={{ height: '60%' }}></div>
                                        <div className="chart-bar" style={{ height: '80%' }}></div>
                                        <div className="chart-bar" style={{ height: '70%' }}></div>
                                        <div className="chart-bar" style={{ height: '90%' }}></div>
                                        <div className="chart-bar" style={{ height: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="preview-glow"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Three Pillars of Excellence</h2>
                        <p className="section-subtitle">
                            Combining psychology, storytelling, and technology for maximum impact
                        </p>
                    </motion.div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="feature-icon" style={{ color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <div className="feature-shine" style={{ background: `linear-gradient(135deg, ${feature.color}20, transparent)` }}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section section bg-dark">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Built for Everyone</h2>
                        <p className="section-subtitle">
                            Supporting the entire school community
                        </p>
                    </motion.div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="benefit-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <div className="benefit-icon" style={{ background: benefit.color }}>
                                    {benefit.icon}
                                </div>
                                <h3>{benefit.title}</h3>
                                <ul className="benefit-list">
                                    {benefit.items.map((item, i) => (
                                        <li key={i}>
                                            <span className="check-icon" style={{ color: benefit.color }}>✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Loved by Educators</h2>
                        <p className="section-subtitle">
                            See what teachers and parents are saying
                        </p>
                    </motion.div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="testimonial-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <p className="testimonial-quote">"{testimonial.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{testimonial.avatar}</div>
                                    <div className="author-info">
                                        <div className="author-name">{testimonial.author}</div>
                                        <div className="author-role">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Ready to Transform Mental Health Education?</h2>
                        <p>Join thousands of schools making a difference in students' lives</p>
                        <div className="cta-buttons">
                            <Link to="/signup" className="btn-cta-primary">
                                Start Free Trial
                                <FaArrowRight />
                            </Link>
                            <Link to="/about" className="btn-cta-secondary">
                                Learn More
                            </Link>
                        </div>
                        <p className="cta-note">No credit card required • Free for 30 days</p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
