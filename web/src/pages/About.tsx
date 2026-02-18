import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaHeart, FaChartLine, FaShieldAlt, FaLightbulb, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card, FeatureCard } from '../components/Card';
import './About.css';

export default function About() {
    return (
        <div className="about-page">
            <Navigation />

            <section className="about-hero section">
                <div className="container">
                    <div className="about-hero-grid">
                        <motion.div
                            className="about-hero-text"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ position: 'relative', zIndex: 10 }}
                        >
                            <h1 className="about-title">Behind The Science</h1>
                            <p className="about-lead">
                                Mindshiftr is built on evidence-based psychological principles that have been
                                proven to support emotional wellbeing and mental health literacy.
                            </p>
                        </motion.div>
                        <motion.div
                            className="about-hero-visual"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <img src="https://images.unsplash.com/photo-1544717297-fa95b3ee21f3?auto=format&fit=crop&q=80&w=2070" alt="Psychology meets Technology" className="about-hero-image" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="science-section section">
                <div className="container">
                    <div className="science-grid">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <FeatureCard
                                icon={<FaBrain />}
                                title="Cognitive Behavioural Therapy (CBT)"
                                description="CBT is a scientifically-proven approach that helps people understand the connections between their thoughts, feelings, and behaviors. Our stories incorporate CBT principles to help students identify and challenge negative thought patterns, developing healthier ways of thinking."
                                imageUrl="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2080"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <FeatureCard
                                icon={<FaHeart />}
                                title="Social Learning Theory (SLT)"
                                description="SLT recognizes that people learn from observing others and their experiences. By engaging with characters in stories, students can safely explore different emotional situations and learn positive behaviors through observation and reflection."
                                imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2070"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="approach-section section bg-secondary">
                <div className="container container-narrow">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title text-center evidence-approach-title">Our Evidence-Based Approach</h2>
                        <div className="approach-content">
                            <Card variant="premium" className="research-card">
                                <div className="research-grid">
                                    <div className="research-text">
                                        <div className="icon-badge">
                                            <FaChartLine />
                                        </div>
                                        <h3>Research-Backed Methods</h3>
                                        <p>
                                            Every story and question in Mindshiftr is carefully designed based on
                                            established psychological research. We combine the power of narrative with
                                            therapeutic techniques to create engaging, effective mental health literacy
                                            programs.
                                        </p>
                                    </div>
                                    <div className="research-points">
                                        <ul className="approach-list">
                                            {[
                                                'Curated stories selected for their emotional and educational value',
                                                'Questions designed by mental health professionals',
                                                'Age-appropriate content for different developmental stages',
                                                'Continuous assessment and improvement based on outcomes'
                                            ].map((item, idx) => (
                                                <li key={idx} className="approach-item">
                                                    <span className="check-icon">✓</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="impact-section section">
                <div className="container">
                    <motion.div
                        className="impact-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title text-center storytelling-impact-title">The Impact of Storytelling</h2>
                        <p className="section-subtitle text-center">
                            Stories have been used for thousands of years to teach, heal, and connect.
                            Modern research confirms their power in mental health education.
                        </p>
                    </motion.div>

                    <div className="impact-grid">
                        {[
                            {
                                title: 'Safe Exploration',
                                description: 'Stories provide a safe space to explore difficult emotions and situations without personal risk.',
                                icon: <FaShieldAlt />,
                                color: 'var(--color-primary)'
                            },
                            {
                                title: 'Emotional Connection',
                                description: 'Characters help students connect emotionally with concepts that might otherwise seem abstract.',
                                icon: <FaHeart />,
                                color: 'var(--color-error)'
                            },
                            {
                                title: 'Memory & Retention',
                                description: 'Narrative formats improve memory retention and make learning more engaging and effective.',
                                icon: <FaLightbulb />,
                                color: 'var(--color-accent)'
                            },
                            {
                                title: 'Universal Themes',
                                description: 'Stories address universal human experiences, helping students feel less alone in their struggles.',
                                icon: <FaGlobe />,
                                color: 'var(--color-success)'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="impact-card-wrapper"
                            >
                                <Card variant="glass" className="impact-card h-full">
                                    <div className="impact-icon-wrapper" style={{ color: item.color }}>
                                        <span className="impact-icon">{item.icon}</span>
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
