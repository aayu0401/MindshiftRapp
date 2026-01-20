import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    {/* Left Content */}
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="hero-title">
                            Every Story <span className="text-gradient">Matters</span>
                        </h1>
                        <p className="hero-description">
                            Mindshiftr is a new way to build better emotional wellbeing and resilience
                            in the classroom by combining the power of storytelling, psychology, and
                            data to support children & young people.
                        </p>
                        <p className="hero-subdescription">
                            Our digital platform contains different programmes each with a series of
                            specially treated short story collections for a range of ages and abilities
                            that can be read aloud together and are combined with evidence-based therapy
                            type questions that will spark an insightful, reflective conversation.
                        </p>
                        <div className="hero-actions">
                            <Button variant="primary" size="lg">
                                Get Started
                            </Button>
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Content - App Mockup */}
                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="app-mockup">
                            <div className="mockup-card glass">
                                <div className="mockup-header">
                                    <div className="mockup-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <h3>Upcoming Session</h3>
                                </div>
                                <div className="mockup-content">
                                    <div className="session-info">
                                        <span className="session-date">Mon 12 Feb 2024</span>
                                        <h4 className="session-title">Alice's Adventures in Wonderland</h4>
                                        <p className="session-author">Written by Lewis Carroll in 1865</p>
                                        <p className="session-description">
                                            It tells the story of a young girl named Alice, who falls through
                                            a rabbit hole into a subterranean fantasy world...
                                        </p>
                                        <button className="session-button">View Programme</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
