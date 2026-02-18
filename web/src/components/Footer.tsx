import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaHeart, FaShieldAlt, FaGraduationCap, FaBrain, FaPaperPlane } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="footer">
            {/* Animated gradient border top */}
            <div className="footer-gradient-bar" aria-hidden="true"></div>

            <div className="container">
                {/* Trust Badges */}
                <div className="footer-trust-bar">
                    <div className="trust-badge">
                        <FaShieldAlt />
                        <span>COPPA Compliant</span>
                    </div>
                    <div className="trust-badge">
                        <FaBrain />
                        <span>Evidence-Based</span>
                    </div>
                    <div className="trust-badge">
                        <FaGraduationCap />
                        <span>Educator Approved</span>
                    </div>
                    <div className="trust-badge">
                        <FaHeart />
                        <span>Child-Safe</span>
                    </div>
                </div>

                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section footer-brand">
                        <div className="footer-logo">
                            <span className="footer-logo-icon">☀️</span>
                            <span className="footer-logo-text">Mindshiftr</span>
                        </div>
                        <p className="footer-tagline">
                            Building emotional wellbeing and resilience through
                            storytelling, psychology, and technology.
                        </p>
                        <div className="footer-social">
                            {[
                                { icon: <FaTwitter />, label: 'Twitter', href: '#' },
                                { icon: <FaLinkedin />, label: 'LinkedIn', href: '#' },
                                { icon: <FaInstagram />, label: 'Instagram', href: '#' },
                                { icon: <FaEnvelope />, label: 'Email', href: 'mailto:hello@mindshiftr.com' },
                            ].map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="social-link"
                                    aria-label={social.label}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Explore</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/stories">Stories</Link></li>
                            <li><Link to="/courses">Courses</Link></li>
                            <li><Link to="/assessments">Assessments</Link></li>
                            <li><Link to="/about">Behind The Science</Link></li>
                            <li><Link to="/faqs">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Resources</h4>
                        <ul className="footer-links">
                            <li><Link to="/dashboard">Teacher Dashboard</Link></li>
                            <li><Link to="/parent-portal">Parent Portal</Link></li>
                            <li><Link to="/student-dashboard">Student Portal</Link></li>
                            <li><Link to="/crisis-support">Crisis Support</Link></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-section footer-newsletter">
                        <h4 className="footer-heading">Stay Updated</h4>
                        <p className="footer-text">
                            Get the latest resources, tips, and updates on children's mental health literacy.
                        </p>
                        <form onSubmit={handleNewsletter} className="newsletter-form">
                            <div className="newsletter-input-group">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="newsletter-input"
                                />
                                <motion.button
                                    type="submit"
                                    className="newsletter-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaPaperPlane />
                                </motion.button>
                            </div>
                            {subscribed && (
                                <motion.p
                                    className="newsletter-success"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    ✨ Thank you for subscribing!
                                </motion.p>
                            )}
                        </form>
                        <a href="mailto:hello@mindshiftr.com" className="footer-email">
                            <FaEnvelope />
                            hello@mindshiftr.com
                        </a>
                    </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="medical-disclaimer">
                    <p>
                        <strong>Disclaimer:</strong> Mindshiftr is a supportive educational tool and is
                        <strong> not a substitute for professional mental health advice, diagnosis, or treatment.</strong>
                        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                        If you are in crisis, please contact your local emergency services immediately.
                    </p>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} Mindshiftr. All rights reserved.
                    </p>
                    <p className="footer-mission">
                        Made with <FaHeart className="heart-icon" /> for every child's emotional wellbeing
                    </p>
                </div>
            </div>
        </footer>
    );
}
