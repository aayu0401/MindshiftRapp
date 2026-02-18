import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaBrain, FaBook, FaLaptopCode, FaChartLine, FaUsers, FaHeart, FaShieldAlt, FaStar, FaArrowRight, FaPlay, FaRocket, FaCheckCircle, FaLightbulb, FaHandHoldingHeart, FaGraduationCap } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import Navigation from './Navigation';
import Footer from './Footer';
import Pillars from './Pillars';
import FAQ from './FAQ';
import './MindshiftRLanding.css';

const AnimatedCounter = ({ value, duration = 2, decimals = 0 }: { value: number, duration?: number, decimals?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const increment = end / (duration * 60);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{displayValue.toFixed(decimals)}</span>;
};

const SectionDivider = ({ flip = false, color = "var(--color-bg-primary)" }: { flip?: boolean, color?: string }) => (
    <div className={`section-divider ${flip ? 'flipped' : ''}`} style={{ backgroundColor: color }}>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
    </div>
);

export default function MindshiftRLanding() {
    const { navigateTo, isNavigating } = useNavigation();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const stats = [
        { number: 10000, suffix: '+', label: 'Students Supported', icon: <FaUsers /> },
        { number: 500, suffix: '+', label: 'Schools Worldwide', icon: <FaShieldAlt /> },
        { number: 95, suffix: '%', label: 'Engagement Rate', icon: <FaChartLine /> },
        { number: 4.9, suffix: '/5', label: 'Average Rating', icon: <FaStar />, decimals: 1 }
    ];

    const features = [
        {
            icon: <FaBrain />,
            title: 'Evidence-Based Psychology',
            description: 'Grounded in CBT and SLT principles, validated by mental health professionals',
            color: '#8b5cf6',
            image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2025&auto=format&fit=crop'
        },
        {
            icon: <FaBook />,
            title: 'AI-Powered Storytelling',
            description: 'Interactive stories that make mental health concepts accessible and relatable',
            color: '#3b82f6',
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2072&auto=format&fit=crop'
        },
        {
            icon: <FaLaptopCode />,
            title: 'Real-Time Analytics',
            description: 'Smart assessments and personalized learning paths for every student',
            color: '#00d4aa',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
        }
    ];

    const benefits = [
        {
            title: 'For Students',
            items: ['Build emotional resilience', 'Learn coping strategies', 'Track personal growth', 'Safe space to explore feelings'],
            icon: '🎓',
            color: '#3b82f6',
            image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop'
        },
        {
            title: 'For Teachers',
            items: ['Monitor student wellbeing', 'Identify at-risk students', 'Data-driven insights', 'Ready-to-use resources'],
            icon: '👨‍🏫',
            color: '#8b5cf6',
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop'
        },
        {
            title: 'For Parents',
            items: ['Track child progress', 'Understand mental health', 'Support at home', 'Connect with teachers'],
            icon: '👨‍👩‍👧',
            color: '#00d4aa',
            image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2070&auto=format&fit=crop'
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
            {/* Unified Brand HUD */}
            <div className="portal-hud">
                <div className="scanline"></div>
                <div className="grid-overlay"></div>
                <div className="gradient-sphere sphere-blue"></div>
            </div>

            <Navigation />

            {/* Hero Section - Completely Redesigned */}
            <section className="hero-section-new">
                <div className="hero-background-new">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                    <div className="hero-orb orb-3"></div>
                    <div className="hero-grid-pattern"></div>

                    {/* Floating Particles */}
                    <div className="floating-particles">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="particle"
                                animate={{
                                    y: [0, -100, 0],
                                    x: [0, 50, 0],
                                    opacity: [0.1, 0.5, 0.1],
                                }}
                                transition={{
                                    duration: 10 + Math.random() * 10,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                }}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 10 + 5}px`,
                                    height: `${Math.random() * 10 + 5}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="container">
                    <div className="hero-content-new">
                        <motion.div
                            className="hero-text-new"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                className="hero-badge-new"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <FaHeart className="badge-icon" />
                                <span>Trusted by 500+ Schools Worldwide</span>
                            </motion.div>

                            <h1 className="hero-title-new">
                                Every Story
                                <span className="gradient-text-new animate-shimmer-text"> Matters</span>
                            </h1>

                            <p className="hero-subtitle-new">
                                Transform mental health education with AI-powered storytelling,
                                evidence-based assessments, and real-time analytics designed
                                specifically for schools.
                            </p>

                            <div className="hero-cta-new">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <button
                                        onClick={() => navigateTo('/signup', 'Initializing platform setup...')}
                                        className="btn-hero-primary-new"
                                        disabled={isNavigating}
                                    >
                                        <FaRocket />
                                        <span>Get Started Free</span>
                                        <FaArrowRight className="arrow-icon" />
                                    </button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <button
                                        onClick={() => navigateTo('/login', 'Accessing secure terminal...')}
                                        className="btn-hero-secondary-new"
                                        disabled={isNavigating}
                                    >
                                        <FaPlay />
                                        <span>Sign In / Demo</span>
                                    </button>
                                </motion.div>
                            </div>

                            <div className="hero-trust-new">
                                <div className="trust-avatars-new">
                                    <span className="avatar-new">👨‍🏫</span>
                                    <span className="avatar-new">👩‍🏫</span>
                                    <span className="avatar-new">👨‍💼</span>
                                    <span className="avatar-new">👩‍💼</span>
                                    <span className="avatar-count">+10K</span>
                                </div>
                                <div className="trust-text-new">
                                    <strong>Join 10,000+ educators</strong>
                                    <span>making mental health a priority</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hero-visual-new"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="hero-visual-container">
                                <div className="hero-image-wrapper-new">
                                    <img
                                        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
                                        alt="Children learning with MindshiftR"
                                        className="hero-main-image-new"
                                    />
                                    <div className="hero-image-glow-new"></div>

                                    <motion.div
                                        className="floating-card-new card-1"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <div className="card-icon">🎯</div>
                                        <div className="card-content">
                                            <strong>95%</strong>
                                            <span>Engagement</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="floating-card-new card-2"
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                    >
                                        <div className="card-icon">🛡️</div>
                                        <div className="card-content">
                                            <strong>100%</strong>
                                            <span>Secure</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="floating-card-new card-3"
                                        animate={{ y: [0, -12, 0] }}
                                        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                                    >
                                        <div className="card-icon">⭐</div>
                                        <div className="card-content">
                                            <strong>4.9/5</strong>
                                            <span>Rating</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <SectionDivider flip />
            </section>

            {/* Stats Section - Enhanced */}
            <section className="stats-section-new">
                <div className="container">
                    <div className="stats-grid-new">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-item-new"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className="stat-icon-new">{stat.icon}</div>
                                <div className="stat-number-new">
                                    <AnimatedCounter value={stat.number} decimals={stat.decimals} />
                                    {stat.suffix}
                                </div>
                                <div className="stat-label-new">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - With Images */}
            <section className="features-section-new section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title-new">Why Schools Choose Mindshiftr</h2>
                        <p className="section-subtitle-new">
                            Powerful features designed for real-world impact
                        </p>
                    </motion.div>

                    <div className="features-grid-new">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card-new"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, type: 'spring', stiffness: 50 }}
                                whileHover={{ y: -12, scale: 1.03 }}
                            >
                                <div className="feature-image-wrapper">
                                    <img src={feature.image} alt={feature.title} className="feature-image" />
                                    <div className="feature-overlay"></div>
                                </div>
                                <div className="feature-content">
                                    <div className="feature-icon-new" style={{ color: feature.color }}>
                                        {feature.icon}
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                    <Link to="/about" className="feature-link" style={{ color: feature.color }}>
                                        Learn more <FaArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section - NEW */}
            <section className="how-it-works bg-light">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title-new">How Mindshiftr Works</h2>
                        <p className="section-subtitle-new">Four simple steps to transform wellbeing in your school</p>
                    </motion.div>

                    <div className="steps-container">
                        {[
                            { step: '01', title: 'Choose a Story', desc: 'Browse our curated library of therapeutic short stories.', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000' },
                            { step: '02', title: 'Read Together', desc: 'Read the story aloud to spark student engagement.', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000' },
                            { step: '03', title: 'Spark Dialogue', desc: 'Follow embedded CBT-based questions to drive empathy.', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000' },
                            { step: '04', title: 'Track Success', desc: 'Analyze class-wide emotional health via your dashboard.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="step-card"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="step-number">{item.step}</div>
                                <div className="step-image">
                                    <img src={item.img} alt={item.title} />
                                </div>
                                <div className="step-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <Pillars />

            {/* Benefits Section - Enhanced with Images */}
            <section className="benefits-section-new section">
                <SectionDivider color="#f0f9ff" />
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title-new">Built for Everyone</h2>
                        <p className="section-subtitle-new">
                            Supporting the entire school community
                        </p>
                    </motion.div>

                    <div className="benefits-grid-new">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="benefit-card-new"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="benefit-image-wrapper">
                                    <img src={benefit.image} alt={benefit.title} className="benefit-image" />
                                </div>
                                <div className="benefit-icon-new" style={{ background: benefit.color }}>
                                    {benefit.icon}
                                </div>
                                <h3>{benefit.title}</h3>
                                <ul className="benefit-list-new">
                                    {benefit.items.map((item, i) => (
                                        <li key={i}>
                                            <FaCheckCircle style={{ color: benefit.color }} />
                                            <span>{item}</span>
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
                        <h2 className="section-title-new">Loved by Educators</h2>
                        <p className="section-subtitle-new">
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

            {/* FAQ Section */}
            <FAQ />

            {/* CTA Section */}
            <section className="cta-section-new">
                <SectionDivider color="#f8fafc" />
                <div className="container">
                    <motion.div
                        className="cta-content-new"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="cta-icon-new">
                            <FaGraduationCap />
                        </div>
                        <h2>Ready to Transform Mental Health Education?</h2>
                        <p>Join thousands of schools making a difference in students' lives</p>
                        <div className="cta-buttons-new">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/signup" className="btn-cta-primary-new">
                                    <FaRocket />
                                    <span>Start Free Trial</span>
                                    <FaArrowRight className="arrow-icon" />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/login" className="btn-cta-secondary-new">
                                    <span>Sign In</span>
                                </Link>
                            </motion.div>
                        </div>
                        <p className="cta-note-new">
                            <FaCheckCircle /> No credit card required
                            <FaCheckCircle /> Free for 30 days
                            <FaCheckCircle /> Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
