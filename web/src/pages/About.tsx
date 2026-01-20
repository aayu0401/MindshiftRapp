import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaHeart, FaChartLine } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import './About.css';

export default function About() {
    return (
        <div className="about-page">
            <Navigation />

            <section className="about-hero section">
                <div className="container container-narrow">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="about-title">Behind The Science</h1>
                        <p className="about-lead">
                            Mindshiftr is built on evidence-based psychological principles that have been
                            proven to support emotional wellbeing and mental health literacy.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="science-section section">
                <div className="container">
                    <div className="science-grid">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card variant="feature">
                                <FaBrain className="science-icon" />
                                <h2>Cognitive Behavioural Therapy (CBT)</h2>
                                <p>
                                    CBT is a scientifically-proven approach that helps people understand the
                                    connections between their thoughts, feelings, and behaviors. Our stories
                                    incorporate CBT principles to help students identify and challenge negative
                                    thought patterns, developing healthier ways of thinking.
                                </p>
                                <p>
                                    Through guided questions embedded in stories, students learn to recognize
                                    their emotional responses and develop coping strategies that last a lifetime.
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card variant="feature">
                                <FaHeart className="science-icon" />
                                <h2>Social Learning Theory (SLT)</h2>
                                <p>
                                    SLT recognizes that people learn from observing others and their experiences.
                                    By engaging with characters in stories, students can safely explore different
                                    emotional situations and learn positive behaviors through observation and
                                    reflection.
                                </p>
                                <p>
                                    Our therapeutic questions encourage students to think about how characters
                                    handle challenges, helping them develop their own emotional intelligence and
                                    resilience.
                                </p>
                            </Card>
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
                        <h2 className="section-title text-center">Our Evidence-Based Approach</h2>
                        <div className="approach-content">
                            <Card variant="glass">
                                <FaChartLine className="approach-icon" />
                                <h3>Research-Backed Methods</h3>
                                <p>
                                    Every story and question in Mindshiftr is carefully designed based on
                                    established psychological research. We combine the power of narrative with
                                    therapeutic techniques to create engaging, effective mental health literacy
                                    programs.
                                </p>
                                <ul className="approach-list">
                                    <li>Curated stories selected for their emotional and educational value</li>
                                    <li>Questions designed by mental health professionals</li>
                                    <li>Age-appropriate content for different developmental stages</li>
                                    <li>Continuous assessment and improvement based on outcomes</li>
                                </ul>
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
                        <h2 className="section-title text-center">The Impact of Storytelling</h2>
                        <p className="section-subtitle text-center">
                            Stories have been used for thousands of years to teach, heal, and connect.
                            Modern research confirms their power in mental health education.
                        </p>
                    </motion.div>

                    <div className="impact-grid">
                        {[
                            {
                                title: 'Safe Exploration',
                                description: 'Stories provide a safe space to explore difficult emotions and situations without personal risk.'
                            },
                            {
                                title: 'Emotional Connection',
                                description: 'Characters help students connect emotionally with concepts that might otherwise seem abstract.'
                            },
                            {
                                title: 'Memory & Retention',
                                description: 'Narrative formats improve memory retention and make learning more engaging and effective.'
                            },
                            {
                                title: 'Universal Themes',
                                description: 'Stories address universal human experiences, helping students feel less alone in their struggles.'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card variant="solid" hover={false}>
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
