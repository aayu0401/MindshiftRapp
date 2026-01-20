import React from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaComments, FaExclamationTriangle, FaHeart, FaUserMd } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import './CrisisSupport.css';

export default function CrisisSupport() {
    const crisisHotlines = [
        {
            name: 'National Suicide Prevention Lifeline',
            number: '988',
            description: '24/7 free and confidential support',
            icon: <FaPhoneAlt />
        },
        {
            name: 'Crisis Text Line',
            number: 'Text HOME to 741741',
            description: 'Free 24/7 crisis support via text',
            icon: <FaComments />
        },
        {
            name: 'SAMHSA National Helpline',
            number: '1-800-662-4357',
            description: 'Treatment referral and information',
            icon: <FaUserMd />
        }
    ];

    const immediateSteps = [
        {
            title: 'Talk to Someone',
            description: 'Reach out to a trusted adult, teacher, counselor, or call a crisis hotline',
            icon: '💬'
        },
        {
            title: 'Stay Safe',
            description: 'If you\'re in immediate danger, call 911 or go to the nearest emergency room',
            icon: '🛡️'
        },
        {
            title: 'Remove Harmful Items',
            description: 'Put distance between yourself and anything that could cause harm',
            icon: '🔒'
        },
        {
            title: 'Practice Grounding',
            description: 'Use the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
            icon: '🧘'
        }
    ];

    const warningSign = [
        'Talking about wanting to die or hurt oneself',
        'Looking for ways to end one\'s life',
        'Talking about feeling hopeless or having no purpose',
        'Talking about feeling trapped or in unbearable pain',
        'Talking about being a burden to others',
        'Increasing use of alcohol or drugs',
        'Acting anxious, agitated, or reckless',
        'Sleeping too little or too much',
        'Withdrawing or feeling isolated',
        'Showing rage or talking about seeking revenge',
        'Displaying extreme mood swings'
    ];

    return (
        <div className="crisis-support-page">
            <Navigation />

            {/* Emergency Banner */}
            <div className="emergency-banner">
                <div className="container">
                    <FaExclamationTriangle />
                    <div>
                        <strong>If you are in immediate danger, call 911</strong>
                        <p>Or call the National Suicide Prevention Lifeline: 988</p>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="crisis-hero section-sm">
                <div className="container container-narrow">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="crisis-icon">
                            <FaHeart />
                        </div>
                        <h1>You Are Not Alone</h1>
                        <p className="crisis-subtitle">
                            If you're experiencing a mental health crisis, help is available 24/7.
                            You matter, and there are people who care and want to help.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Crisis Hotlines */}
            <section className="hotlines-section section">
                <div className="container">
                    <h2 className="section-title">Get Immediate Help</h2>
                    <div className="hotlines-grid">
                        {crisisHotlines.map((hotline, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="glass" className="hotline-card">
                                    <div className="hotline-icon">{hotline.icon}</div>
                                    <h3>{hotline.name}</h3>
                                    <div className="hotline-number">{hotline.number}</div>
                                    <p>{hotline.description}</p>
                                    <Button variant="primary" href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}>
                                        Call Now
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immediate Steps */}
            <section className="steps-section section bg-secondary">
                <div className="container">
                    <h2 className="section-title">What to Do Right Now</h2>
                    <div className="steps-grid">
                        {immediateSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="solid" hover={false}>
                                    <div className="step-icon">{step.icon}</div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Warning Signs */}
            <section className="warning-section section">
                <div className="container container-narrow">
                    <h2 className="section-title">Warning Signs</h2>
                    <Card variant="glass">
                        <p className="warning-intro">
                            If you or someone you know is showing these signs, reach out for help immediately:
                        </p>
                        <ul className="warning-list">
                            {warningSign.map((sign, index) => (
                                <li key={index}>{sign}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </section>

            {/* Resources */}
            <section className="resources-section section bg-secondary">
                <div className="container container-narrow">
                    <h2 className="section-title">Additional Resources</h2>
                    <div className="resources-grid">
                        <Card variant="solid">
                            <h3>School Counselor</h3>
                            <p>Talk to your school counselor during school hours. They are trained to help and can connect you with additional support.</p>
                        </Card>
                        <Card variant="solid">
                            <h3>Trusted Adult</h3>
                            <p>Reach out to a parent, teacher, coach, or any adult you trust. You don't have to go through this alone.</p>
                        </Card>
                        <Card variant="solid">
                            <h3>Mental Health Professional</h3>
                            <p>Consider seeing a therapist or counselor who specializes in working with young people.</p>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
