import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaBook, FaChartLine, FaAward, FaHeart, FaSpinner } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { fetchChildren, Child } from '../api/user.api';
import { fetchStudentReport } from '../api/analytics.api';
import './ParentPortal.css';

export default function ParentPortal() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<any>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const loadChildren = async () => {
        try {
            setLoading(true);
            const data = await fetchChildren();
            setChildren(data);
            if (data.length > 0) {
                setSelectedChildId(data[0].id);
            }
        } catch (error) {
            console.error('Error loading children:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadChildReport = async (childId: string) => {
        try {
            const data = await fetchStudentReport(childId);
            setReport(data);
        } catch (error) {
            console.error('Error loading report:', error);
        }
    };

    useEffect(() => {
        loadChildren();

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (selectedChildId) {
            loadChildReport(selectedChildId);
        }
    }, [selectedChildId]);

    const selectedChild = children.find(c => c.id === selectedChildId);
    const analytics = report?.analytics;

    if (loading) {
        return (
            <div className="parent-portal-page">
                <Navigation />
                <div className="container section">
                    <div className="loading-state">
                        <FaSpinner className="spinner" />
                        <h2 className="loading-text-hitech">Accessing Guardian Pulse...</h2>
                        <p className="portal-subtitle-hitech">Synchronizing biometric developmental data</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="parent-portal-page">
            {/* Monitoring HUD Background */}
            <div className="portal-hud">
                <motion.div
                    className="parallax-layer"
                    animate={{
                        x: mousePos.x,
                        y: mousePos.y
                    }}
                    transition={{ type: "spring", stiffness: 40, damping: 25 }}
                >
                    <div className="scanline"></div>
                    <div className="grid-overlay"></div>
                    <div className="gradient-sphere sphere-blue"></div>
                </motion.div>
            </div>

            <Navigation />

            <div className="portal-container">
                <div className="container">
                    {/* Mission Header */}
                    <motion.div
                        className="portal-header-hitech"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="header-status-hud">
                            <motion.div
                                className="live-monitor-badge"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="pulse-dot-cyan"></span>
                                GUARDIAN PROTOCOL: ONLINE
                            </motion.div>
                            <h1 className="portal-title-hitech">Guardian <span className="text-neon-blue">Pulse</span></h1>
                            <p className="portal-subtitle-hitech">
                                Real-time developmental monitoring and emotional intelligence diagnostics.
                            </p>
                        </div>
                    </motion.div>

                    {/* Child Selector HUD */}
                    <div className="child-selector-hud">
                        {children.map((child) => (
                            <motion.button
                                key={child.id}
                                className={`child-hud-btn ${selectedChildId === child.id ? 'active' : ''}`}
                                onClick={() => setSelectedChildId(child.id)}
                                whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(14, 165, 233, 0.15)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="child-avatar-mini">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child.name}`} alt={child.name} />
                                </div>
                                <div className="child-hud-info">
                                    <div className="child-hud-name">{child.name}</div>
                                    <div className="child-hud-meta">{child.grade} • {child.class}</div>
                                </div>
                                {selectedChildId === child.id && (
                                    <>
                                        <motion.div
                                            className="active-glow"
                                            layoutId="activeChildGlow"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        />
                                        <div className="active-scanning-line"></div>
                                    </>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Performance HUD */}
                    <div className="performance-hud">
                        <div className="hud-grid-4">
                            {[
                                { icon: <FaBook />, value: analytics?.storiesCompleted || 0, label: 'Narrative Nodes', color: 'var(--color-neon-blue)' },
                                { icon: <FaChartLine />, value: analytics?.storiesStarted || 0, label: 'Active Sessions', color: 'var(--color-neon-purple)' },
                                { icon: <FaHeart />, value: analytics?.assessmentsCompleted || 0, label: 'Wellbeing Checks', color: 'var(--color-neon-pink)' },
                                { icon: <FaAward />, value: analytics?.streakDays || 0, label: 'Retention Days', color: 'var(--color-neon-yellow)' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                >
                                    <Card variant="glass" className="hud-monitor-card" hover={true}>
                                        <div className="monitor-light-ray" style={{ animationDelay: `${i * 0.5}s` }}></div>
                                        <div className="monitor-icon" style={{ '--monitor-color': stat.color } as any}>
                                            {stat.icon}
                                        </div>
                                        <div className="monitor-data">
                                            <div className="monitor-value">{stat.value}</div>
                                            <div className="monitor-label">{stat.label}</div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="portal-content-grid">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedChildId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="portal-left-section"
                            >
                                <h2 className="section-title">Operational Feed</h2>
                                <div className="activity-list">
                                    {Array.isArray(report?.storyProgress?.details) && report.storyProgress.details.length > 0 ? (
                                        report.storyProgress.details.slice(0, 5).map((progress: any, index: number) => (
                                            <div key={index} className="activity-item">
                                                <div className="activity-icon">📖</div>
                                                <div className="activity-content">
                                                    <div className="activity-title">{progress.story.title}</div>
                                                    <div className="activity-date">
                                                        {new Date(progress.lastReadAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="activity-status">
                                                    {progress.completed ?
                                                        <span className="status-badge completed">Neutralized</span> :
                                                        <span className="status-badge progress">Syncing...</span>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-activity">No active sessions detected.</p>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedChildId + '-insights'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="portal-right-section"
                            >
                                <h2 className="section-title">Wellbeing Diagnostic</h2>
                                <div className="wellbeing-content">
                                    <div className="wellbeing-status">
                                        <span className="status-label">Current Stability Index</span>
                                        <div className="stability-indicator">
                                            <span className={`status-value ${analytics?.currentRiskLevel?.toLowerCase() || 'low'}`}>
                                                {analytics?.currentRiskLevel || 'OPTIMAL'}
                                            </span>
                                            <span className="last-sync">
                                                • LAST SCAN: {analytics?.lastAssessmentDate ? new Date(analytics.lastAssessmentDate).toLocaleDateString() : 'REALTIME'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="wellbeing-section">
                                        <h4>Guiding Protocols</h4>
                                        <ul className="wellbeing-list">
                                            {report?.recommendations?.length > 0 ? (
                                                report.recommendations.map((rec: string, i: number) => (
                                                    <li key={i} className="support-item">{rec}</li>
                                                ))
                                            ) : (
                                                <li className="support-item">Maintaining baseline resilience. No intervention required.</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="teacher-notes">
                                        <h4>Biometric Summary</h4>
                                        <p>
                                            {selectedChild?.name} has dedicated {analytics?.totalTimeSpent || 0} minutes to therapeutic narrative engagement.
                                            {analytics?.storiesCompleted > 0 ?
                                                ` Internalization of ${analytics.storiesCompleted} curriculum modules complete.` :
                                                ' Initializing first developmental module.'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Resources for Parents */}
                    <div className="portal-section">
                        <h2 className="section-title">Resource Database</h2>
                        <div className="hud-grid-4">
                            <Card variant="glass" className="hud-monitor-card" hover={true}>
                                <h3>Neural Resilience</h3>
                                <p>Strategies for home-based emotional reinforcement.</p>
                                <Button variant="outline" size="sm">Access Data</Button>
                            </Card>
                            <Card variant="glass" className="hud-monitor-card" hover={true}>
                                <h3>CBT Architecture</h3>
                                <p>Understanding the narrative behavioral framework.</p>
                                <Button variant="outline" size="sm">Learn More</Button>
                            </Card>
                            <Card variant="glass" className="hud-monitor-card" hover={true}>
                                <h3>Direct Uplink</h3>
                                <p>Coordinate with educational moderators.</p>
                                <Button variant="primary" size="sm">Contact Unit</Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
