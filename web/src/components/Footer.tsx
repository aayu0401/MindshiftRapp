import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-icon">📚</span>
                            <span className="logo-text">Mindshiftr</span>
                        </div>
                        <p className="footer-tagline">
                            Building emotional wellbeing through storytelling, psychology, and technology.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-link" aria-label="Email">
                                <FaEnvelope />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/stories">Stories</Link></li>
                            <li><Link to="/about">Behind The Science</Link></li>
                            <li><Link to="/faqs">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Resources</h4>
                        <ul className="footer-links">
                            <li><Link to="/dashboard">Teacher Dashboard</Link></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Get In Touch</h4>
                        <p className="footer-text">
                            Have questions? We'd love to hear from you.
                        </p>
                        <a href="mailto:hello@mindshiftr.com" className="footer-email">
                            hello@mindshiftr.com
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} Mindshiftr. All rights reserved. Every Story Matters.
                    </p>
                </div>
            </div>
        </footer>
    );
}
