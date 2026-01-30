import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaBrain, FaUsers, FaSpinner } from 'react-icons/fa';
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

    const assessmentIcons: Record<string, React.ReactNode> = {
        'CBT': <FaBrain />,
        'PBCT': <FaUsers />,
        'Screening': <FaClipboardList />
    };

    useEffect(() => {
        loadAssessments();
    }, []);

    const loadAssessments = async () => {
        setLoading(true);
        try {
            // Try to fetch from API
            const apiAssessments = await fetchAssessments();
            setAssessments(apiAssessments);
            setUsingMockData(false);
        } catch (error) {
            console.log('Backend unavailable, using sample data');
            // Fallback to mock data
            setAssessments(allAssessments);
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    const retryBackend = () => {
        loadAssessments();
    };

    if (loading) {
        return (
            <div className="assessments-page">
                <Navigation />
                <div className="container section">
                    <div className="loading-state">
                        <FaSpinner className="spinner" />
                        <p>Loading assessments...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="assessments-page">
            <Navigation />

            <section className="assessments-hero section-sm">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="assessments-title">Mental Health Assessments</h1>
                        <p className="assessments-subtitle">
                            Evidence-based screening tools to support student wellbeing and identify those who may need additional support
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="assessments-grid-section section">
                <div className="container">
                    {/* Demo Mode Badge */}
                    {usingMockData && (
                        <div className="demo-mode-badge">
                            <span className="badge-icon">📋</span>
                            <span>Demo Mode - Using sample assessments</span>
                            <button className="badge-retry" onClick={retryBackend}>
                                Try Backend
                            </button>
                        </div>
                    )}

                    <div className="assessments-grid">
                        {assessments.map((assessment, index) => (
                            <motion.div
                                key={assessment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="solid" className="assessment-card" onClick={() => navigate(`/assessment/${assessment.id}`)}>
                                    <div className="assessment-icon">
                                        {assessmentIcons[assessment.type]}
                                    </div>
                                    <div className="assessment-type-badge">{assessment.type}</div>
                                    <h3 className="assessment-title">{assessment.title}</h3>
                                    <p className="assessment-description">{assessment.description}</p>
                                    <div className="assessment-meta">
                                        <span>Ages {assessment.ageGroup}</span>
                                        <span>{assessment.questions?.length || assessment.questionCount || 0} Questions</span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="info-section">
                        <Card variant="glass">
                            <h3>About These Assessments</h3>
                            <p>
                                Our assessments are based on evidence-based therapeutic approaches including Cognitive Behavioral Therapy (CBT)
                                and Problem-Based Cognitive Therapy (PBCT). They help identify students who may benefit from additional support
                                or professional screening.
                            </p>
                            <ul className="info-list">
                                <li><strong>Confidential:</strong> Results are private and only shared with authorized school staff</li>
                                <li><strong>Non-diagnostic:</strong> These are screening tools, not clinical diagnoses</li>
                                <li><strong>Supportive:</strong> Designed to connect students with appropriate resources</li>
                                <li><strong>Evidence-based:</strong> Grounded in psychological research and best practices</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
