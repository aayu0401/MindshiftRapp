import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import './Navigation.css';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stories', path: '/stories' },
    { name: 'Courses', path: '/courses' },
    { name: 'Inspire', path: '/daily-inspiration' },
    { name: 'About', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="Mindshiftr Home">
          <span className="logo-icon" aria-hidden="true">☀️</span>
          <span className="logo-text">Mindshiftr</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-label={link.name}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav-active-pill"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'white',
                      borderRadius: '99px',
                      zIndex: -1,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{link.name}</span>
              </Link>
            );
          })}
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
                  <Button variant="primary" size="sm" href="/dashboard">
                    Dashboard
                  </Button>
                  {user?.role === 'school' && (
                    <Button variant="outline" size="sm" href="/school-admin">
                      Manage Users
                    </Button>
                  )}
                </>
              )}
              {user?.role === 'student' && (
                <Button variant="primary" size="sm" href="/student-dashboard">
                  My Portal
                </Button>
              )}
              {user?.role === 'parent' && (
                <Button variant="primary" size="sm" href="/parent-portal">
                  Parent Portal
                </Button>
              )}
              <div className="user-menu" role="menu" aria-label="User menu">
                <div className="user-avatar-small">
                  <FaUser aria-hidden="true" />
                </div>
                <span className="user-name">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
                  <FaSignOutAlt aria-hidden="true" />
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
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
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
                      <Button variant="primary" size="sm" href="/dashboard">
                        Dashboard
                      </Button>
                      {user?.role === 'school' && (
                        <Button variant="outline" size="sm" href="/school-admin">
                          Manage Users
                        </Button>
                      )}
                    </>
                  )}
                  {user?.role === 'student' && (
                    <Button variant="primary" size="sm" href="/student-dashboard">
                      My Portal
                    </Button>
                  )}
                  {user?.role === 'parent' && (
                    <Button variant="primary" size="sm" href="/parent-portal">
                      Parent Portal
                    </Button>
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
      </AnimatePresence>
    </nav>
  );
}
