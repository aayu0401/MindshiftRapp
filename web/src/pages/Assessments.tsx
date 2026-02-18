import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaBrain, FaUsers, FaArrowRight } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import { allAssessments } from '../data/assessmentData';
import { fetchAssessments } from '../api/assessments.api';
import './Assessments.css';

export default function Assessments() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [usingMockData, setUsingMockData] = useState(false);
    const [assessments, setAssessments] = useState<any[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const assessmentIcons: Record<string, React.ReactNode> = {
        'CBT': <FaBrain />,
        'PBCT': <FaUsers />,
        'Screening': <FaClipboardList />
    };

    const loadAssessments = async () => {
        setLoading(true);
        try {
            const apiAssessments = await fetchAssessments();
            setAssessments(apiAssessments);
            setUsingMockData(false);
        } catch (error) {
            console.log('Backend unavailable, using sample data');
            setAssessments(allAssessments);
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssessments();

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const retryBackend = () => {
        loadAssessments();
    };

    if (loading) {
        return (
            <div className="assessments-page">
                <Navigation />
                <div className="portal-hud">
                    <div className="scanline"></div>
                    <div className="grid-overlay"></div>
                </div>
                <div className="container section text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hud-scanner-loading"
                    >
                        <div className="scanner-line"></div>
                        <h2 className="loading-text" style={{ color: 'var(--color-neon-blue)' }}>CALIBRATING DIAGNOSTIC MODULES...</h2>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="assessments-page">
            <Navigation />

            {/* Realistic HUD Background */}
            <div className="portal-hud">
                <motion.div
                    className="parallax-layer"
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    transition={{ type: "spring", stiffness: 40, damping: 25 }}
                >
                    <div className="scanline"></div>
                    <div className="grid-overlay"></div>
                </motion.div>
            </div>

            <section className="assessments-hero">
                <div className="container">
                    <div className="hero-split-layout">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hero-text-content"
                        >
                            <div className="live-monitor-badge">
                                <span className="pulse-dot-cyan"></span>
                                NEURAL SCANNER: ONLINE
                            </div>
                            <h1 className="assessments-title">
                                Neural <span className="text-gradient">Diagnostic</span> Hub
                            </h1>
                            <p className="assessments-subtitle">
                                evidence-based cognitive screening for developmental resilience.
                                Securely analyzing emotional baseline and identifying intervention nodes.
                            </p>
                            <div className="hero-stats-row">
                                <div className="hero-stat">
                                    <span className="stat-number">15+</span>
                                    <span className="stat-label">Modules</span>
                                </div>
                                <div className="hero-stat">
                                    <span className="stat-number">98%</span>
                                    <span className="stat-label">Accuracy</span>
                                </div>
                                <div className="hero-stat">
                                    <span className="stat-number">SCAN</span>
                                    <span className="stat-label">Real-time</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="hero-visual-wrapper"
                        >
                            <div className="hero-image-glow"></div>
                            <img
                                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                                alt="Assessment Assessment"
                                className="hero-image-premium"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="assessments-grid-section">
                <div className="container">
                    {/* Demo Mode Badge */}
                    {usingMockData && (
                        <motion.div
                            className="demo-mode-pill"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ marginBottom: '3rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '15px', padding: '10px 25px' }}
                        >
                            <span className="pulse-dot" style={{ background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }} />
                            <span style={{ color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Demo Protocols Active</span>
                            <button onClick={retryBackend} style={{ background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '50px', padding: '5px 15px', fontWeight: 900, fontSize: '0.7rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                                Sync Live
                            </button>
                        </motion.div>
                    )}

                    <div className="assessments-grid">
                        {assessments.map((assessment, index) => (
                            <motion.div
                                key={assessment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="glass" className="assessment-card" onClick={() => navigate(`/assessment/${assessment.id}`)}>
                                    <div className="assessment-icon">
                                        {assessmentIcons[assessment.type] || <FaBrain />}
                                    </div>
                                    <div className="assessment-type-badge">{assessment.type}</div>
                                    {index === 0 && (
                                        <div className="ai-rec-badge">
                                            Priority Scan
                                        </div>
                                    )}
                                    <h3 className="assessment-title">{assessment.title}</h3>
                                    <p className="assessment-description">{assessment.description}</p>
                                    <div className="assessment-meta">
                                        <span>Target: {assessment.ageGroup}</span>
                                        <span>Nodes: {assessment.questions?.length || assessment.questionCount || 0}</span>
                                    </div>
                                    <div className="hover-action">
                                        INITIALIZE SCAN <FaArrowRight />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="info-section">
                        <Card variant="glass">
                            <h3>Diagnostic Architecture</h3>
                            <p>
                                Our monitoring frameworks utilize Cognitive Behavioral Therapy (CBT)
                                and Problem-Based Cognitive Therapy (PBCT) blueprints to generate real-time
                                developmental insights and intervention protocols.
                            </p>
                            <ul className="info-list">
                                <li><strong>Encrypted:</strong> Triple-layer data hardening for biometric security</li>
                                <li><strong>Analytical:</strong> Algorithmic pattern detection, non-clinical screening</li>
                                <li><strong>Adaptive:</strong> Dynamic curriculum mapping based on results</li>
                                <li><strong>Objective:</strong> Grounded in research-backed neural behavioral frameworks</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
