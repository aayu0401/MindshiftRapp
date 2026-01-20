import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaBook, FaChartLine, FaAward, FaHeart } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import './ParentPortal.css';

export default function ParentPortal() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedChild, setSelectedChild] = useState('child-1');

    // Mock data
    const children = [
        { id: 'child-1', name: 'Emma Johnson', grade: 'Year 5', class: '5A' },
        { id: 'child-2', name: 'Liam Johnson', grade: 'Year 3', class: '3B' }
    ];

    const childProgress = {
        storiesCompleted: 12,
        coursesEnrolled: 3,
        assessmentsCompleted: 2,
        overallProgress: 78,
        recentActivity: [
            { type: 'story', title: "Alice's Adventures in Wonderland", date: '2024-02-15', completed: true },
            { type: 'course', title: 'Emotional Awareness', date: '2024-02-14', progress: 65 },
            { type: 'assessment', title: 'Anxiety Screening', date: '2024-02-13', result: 'Low Risk' }
        ],
        achievements: [
            { title: 'Story Explorer', description: 'Completed 10 stories', icon: '📚' },
            { title: 'Reflective Thinker', description: 'Answered 50 questions', icon: '💭' },
            { title: 'Course Champion', description: 'Completed first course', icon: '🏆' }
        ]
    };

    const wellbeingInsights = {
        overallWellbeing: 'Good',
        strengths: ['Emotional awareness', 'Empathy', 'Communication'],
        areasToSupport: ['Stress management', 'Self-confidence'],
        teacherNotes: 'Emma shows great engagement with the stories and demonstrates strong emotional intelligence. Continue encouraging reflection activities at home.'
    };

    return (
        <div className="parent-portal-page">
            <Navigation />

            <div className="portal-container">
                <div className="container">
                    {/* Header */}
                    <motion.div
                        className="portal-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <h1 className="portal-title">Parent Portal</h1>
                            <p className="portal-subtitle">
                                Monitor your child's wellbeing journey
                            </p>
                        </div>
                    </motion.div>

                    {/* Child Selector */}
                    <div className="child-selector">
                        {children.map((child) => (
                            <button
                                key={child.id}
                                className={`child-btn ${selectedChild === child.id ? 'active' : ''}`}
                                onClick={() => setSelectedChild(child.id)}
                            >
                                <FaUser />
                                <div>
                                    <div className="child-name">{child.name}</div>
                                    <div className="child-grade">{child.grade} - {child.class}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Progress Overview */}
                    <div className="progress-overview">
                        <div className="overview-grid">
                            <Card variant="glass" hover={false}>
                                <div className="overview-stat">
                                    <FaBook className="overview-icon" />
                                    <div>
                                        <div className="overview-value">{childProgress.storiesCompleted}</div>
                                        <div className="overview-label">Stories Completed</div>
                                    </div>
                                </div>
                            </Card>
                            <Card variant="glass" hover={false}>
                                <div className="overview-stat">
                                    <FaChartLine className="overview-icon" />
                                    <div>
                                        <div className="overview-value">{childProgress.coursesEnrolled}</div>
                                        <div className="overview-label">Courses Enrolled</div>
                                    </div>
                                </div>
                            </Card>
                            <Card variant="glass" hover={false}>
                                <div className="overview-stat">
                                    <FaHeart className="overview-icon" />
                                    <div>
                                        <div className="overview-value">{childProgress.assessmentsCompleted}</div>
                                        <div className="overview-label">Assessments</div>
                                    </div>
                                </div>
                            </Card>
                            <Card variant="glass" hover={false}>
                                <div className="overview-stat">
                                    <FaAward className="overview-icon" />
                                    <div>
                                        <div className="overview-value">{childProgress.overallProgress}%</div>
                                        <div className="overview-label">Overall Progress</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="portal-content-grid">
                        {/* Recent Activity */}
                        <div className="portal-section">
                            <h2 className="section-title">Recent Activity</h2>
                            <Card variant="solid" hover={false}>
                                <div className="activity-list">
                                    {childProgress.recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-icon">
                                                {activity.type === 'story' && '📖'}
                                                {activity.type === 'course' && '📚'}
                                                {activity.type === 'assessment' && '📊'}
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-title">{activity.title}</div>
                                                <div className="activity-date">{activity.date}</div>
                                            </div>
                                            <div className="activity-status">
                                                {activity.completed && <span className="status-badge completed">Completed</span>}
                                                {activity.progress && <span className="status-badge progress">{activity.progress}%</span>}
                                                {activity.result && <span className="status-badge low-risk">{activity.result}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Wellbeing Insights */}
                        <div className="portal-section">
                            <h2 className="section-title">Wellbeing Insights</h2>
                            <Card variant="solid" hover={false}>
                                <div className="wellbeing-content">
                                    <div className="wellbeing-status">
                                        <span className="status-label">Overall Wellbeing:</span>
                                        <span className="status-value good">{wellbeingInsights.overallWellbeing}</span>
                                    </div>

                                    <div className="wellbeing-section">
                                        <h4>Strengths</h4>
                                        <ul className="wellbeing-list">
                                            {wellbeingInsights.strengths.map((strength, i) => (
                                                <li key={i} className="strength-item">{strength}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="wellbeing-section">
                                        <h4>Areas to Support</h4>
                                        <ul className="wellbeing-list">
                                            {wellbeingInsights.areasToSupport.map((area, i) => (
                                                <li key={i} className="support-item">{area}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="teacher-notes">
                                        <h4>Teacher Notes</h4>
                                        <p>{wellbeingInsights.teacherNotes}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="portal-section">
                        <h2 className="section-title">Achievements</h2>
                        <div className="achievements-grid">
                            {childProgress.achievements.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card variant="feature" hover={false}>
                                        <div className="achievement-icon">{achievement.icon}</div>
                                        <h3>{achievement.title}</h3>
                                        <p>{achievement.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Resources for Parents */}
                    <div className="portal-section">
                        <h2 className="section-title">Resources for Parents</h2>
                        <div className="resources-grid">
                            <Card variant="solid">
                                <h3>Supporting Mental Health at Home</h3>
                                <p>Tips and strategies for fostering emotional wellbeing in your family.</p>
                                <Button variant="outline" size="sm">Read More</Button>
                            </Card>
                            <Card variant="solid">
                                <h3>Understanding CBT for Children</h3>
                                <p>Learn about the therapeutic approaches used in our stories and courses.</p>
                                <Button variant="outline" size="sm">Learn More</Button>
                            </Card>
                            <Card variant="solid">
                                <h3>Talk to Your Child's Teacher</h3>
                                <p>Schedule a meeting to discuss your child's progress and wellbeing.</p>
                                <Button variant="primary" size="sm">Contact Teacher</Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
