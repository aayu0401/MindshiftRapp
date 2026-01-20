import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import './Navigation.css';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stories', path: '/stories' },
    { name: 'Courses', path: '/courses' },
    { name: 'Behind The Science', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="nav-logo" aria-label="Mindshiftr Home">
            <span className="logo-icon" aria-hidden="true">📚</span>
            <span className="logo-text">Mindshiftr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="nav-link" aria-label={link.name}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons / User Menu */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                {(user?.role === 'teacher' || user?.role === 'school') && (
                  <>
                    <Button variant="outline" size="sm" href="/ai-creator">
                      AI Creator
                    </Button>
                    <Button variant="outline" size="sm" href="/dashboard">
                      Dashboard
                    </Button>
                  </>
                )}
                <div className="user-menu" role="menu" aria-label="User menu">
                  <FaUser aria-hidden="true" />
                  <span>{user?.name}</span>
                  <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
                    <FaSignOutAlt aria-hidden="true" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" href="/login">
                  Login
                </Button>
                <Button variant="primary" size="sm" href="/signup">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-nav-actions">
              {isAuthenticated ? (
                <>
                  {(user?.role === 'teacher' || user?.role === 'school') && (
                    <>
                      <Button variant="outline" size="sm" href="/ai-creator">
                        AI Creator
                      </Button>
                      <Button variant="outline" size="sm" href="/dashboard">
                        Dashboard
                      </Button>
                    </>
                  )}
                  <button onClick={handleLogout} className="logout-btn-mobile">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" href="/login">
                    Login
                  </Button>
                  <Button variant="primary" size="sm" href="/signup">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
