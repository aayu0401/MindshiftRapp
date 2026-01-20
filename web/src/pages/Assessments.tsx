import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaBrain, FaUsers } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import { allAssessments } from '../data/assessmentData';
import './Assessments.css';

export default function Assessments() {
    const navigate = useNavigate();

    const assessmentIcons: Record<string, React.ReactNode> = {
        'CBT': <FaBrain />,
        'PBCT': <FaUsers />,
        'Screening': <FaClipboardList />
    };

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
                    <div className="assessments-grid">
                        {allAssessments.map((assessment, index) => (
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
                                        <span>{assessment.questions.length} Questions</span>
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
