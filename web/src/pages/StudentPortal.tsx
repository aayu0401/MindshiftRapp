import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaClipboardList, FaAward, FaChartLine, FaHeart, FaStar, FaSpinner } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useRealtime } from '../context/RealtimeContext';
import JournalWidget from '../components/JournalWidget';
import { toast } from 'react-hot-toast';
import { fetchMyAnalytics, UserAnalytics } from '../api/analytics.api';
import { fetchStories } from '../api/stories.api';
import './StudentPortal.css';

export default function StudentPortal() {
    const navigate = useNavigate();
    const { socket } = useRealtime();
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [recommendedStories, setRecommendedStories] = useState<any[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const loadPortalData = async () => {
        try {
            setLoading(true);
            const [analyticsData, storiesData] = await Promise.all([
                fetchMyAnalytics(),
                fetchStories({ featured: true })
            ]);
            setAnalytics(analyticsData);
            setRecommendedStories(storiesData.slice(0, 3));
        } catch (error) {
            console.error('Error loading portal data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('System Online: Good Morning');
        else if (hour < 18) setGreeting('System Online: Good Afternoon');
        else setGreeting('System Online: Good Evening');

        loadPortalData();

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const stats = [
        { label: 'Narrative Syncs', value: analytics?.storiesCompleted || '0', icon: <FaBookOpen />, color: '#00d4aa' },
        { label: 'Neural Points', value: analytics?.points || '0', icon: <FaStar />, color: '#f59e0b' },
        { label: 'Uptime Streak', value: `${analytics?.streakDays || 0}d`, icon: <FaChartLine />, color: '#8b5cf6' },
    ];

    const achievements = [
        { title: 'Neural Baseline', description: 'Log in 3 days in a row', icon: '🌅', unlocked: (analytics?.streakDays || 0) >= 3 },
        { title: 'Data Explorer', description: 'Complete 5 therapeutic sessions', icon: '📚', unlocked: (analytics?.storiesCompleted || 0) >= 5 },
        { title: 'Core Reflector', description: 'Sync 10 neural journals', icon: '✍️', unlocked: (analytics?.assessmentsCompleted || 0) >= 10 },
    ];

    if (loading) {
        return (
            <div className="student-portal-page">
                <Navigation />
                <div className="container section">
                    <div className="loading-state">
                        <FaSpinner className="spinner" />
                        <h2 className="loading-text-hitech">Syncing Neural Connection...</h2>
                        <p className="hero-subtitle-hitech">Downloading personalized narrative pathways</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="student-portal-page">
            {/* Realistic HUD / Background Effects */}
            <div className="portal-hud">
                <motion.div
                    className="parallax-layer"
                    animate={{
                        x: mousePos.x,
                        y: mousePos.y
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    <div className="scanline"></div>
                    <div className="gradient-sphere sphere-1"></div>
                    <div className="gradient-sphere sphere-2"></div>
                    <div className="grid-overlay"></div>
                </motion.div>
            </div>

            <Navigation />

            <div className="portal-container">
                <div className="container">
                    {/* Adventure Hero HUD */}
                    <motion.div
                        className="portal-hero-hud"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="data-stream-overlay">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="data-stream-dot"
                                    style={{
                                        animationDelay: `${i * 0.8}s`,
                                        opacity: 0.2 + (i * 0.1)
                                    }}
                                />
                            ))}
                        </div>
                        <div className="hero-profile-hud">
                            <motion.div
                                className="profile-avatar-outer"
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                animate={{
                                    boxShadow: mousePos.x > 0
                                        ? "10px 10px 40px rgba(14, 165, 233, 0.2)"
                                        : "-10px -10px 40px rgba(14, 165, 233, 0.2)"
                                }}
                            >
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Explorer'}`} alt="Avatar" />
                                <div className="scanning-avatar-overlay"></div>
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="neural-data-bit"
                                        animate={{
                                            x: [0, (i - 1) * 30, 0],
                                            y: [0, (i - 1) * -30, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{
                                            duration: 2 + i,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        style={{
                                            top: '50%',
                                            left: '50%'
                                        }}
                                    />
                                ))}
                                <div className="level-badge">NODE LVL {Math.floor((analytics?.points || 0) / 100) + 1}</div>
                            </motion.div>
                            <div className="hero-text-content">
                                <motion.div
                                    className="system-alert-pill"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--color-neon-blue)" }}
                                >
                                    <span className="pulse-dot"></span> BIOMETRIC SYNC: ACTIVE
                                </motion.div>
                                <motion.h1
                                    className="hero-title-hitech glitch-hover"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {greeting}, <br /><span className="text-glow ">{user?.name?.split(' ')[0] || 'Explorer'}</span>
                                </motion.h1>
                                <div className="xp-bar-container">
                                    <div className="xp-info">
                                        <span>NEURAL PROGRESSION</span>
                                        <span>{(analytics?.points || 0) % 100} / 100 XP</span>
                                    </div>
                                    <div className="xp-bar-outer">
                                        <motion.div
                                            className="xp-bar-inner"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(analytics?.points || 0) % 100}%` }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                        >
                                            <div className="xp-shimmer"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Realistic Stats HUD */}
                    <div className="stats-hud-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <Card variant="glass" className="hud-stat-card" hover={true}>
                                    <div className="hud-stat-icon-wrapper" style={{ '--accent-color': stat.color } as any}>
                                        <div className="hud-stat-icon">{stat.icon}</div>
                                        <div className="hud-stat-glow"></div>
                                    </div>
                                    <div className="hud-stat-details">
                                        <div className="hud-stat-value">{stat.value}</div>
                                        <div className="hud-stat-label">{stat.label}</div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="portal-main-grid">
                        {/* Left Column: Wellbeing & Journal */}
                        <div className="portal-left">
                            <section className="portal-section">
                                <h2 className="section-title">Mood Pulse</h2>
                                <Card variant="premium" className="mood-pulse-container">
                                    <div className="mood-pulse-header">
                                        <h3>How's your vibe today?</h3>
                                        <p>Click an emoji to share your energy</p>
                                    </div>
                                    <div className="mood-pulse-options">
                                        {[
                                            { e: '🌟', m: 5 },
                                            { e: '😊', m: 4 },
                                            { e: '😐', m: 3 },
                                            { e: '😔', m: 2 },
                                            { e: '🌋', m: 1 }
                                        ].map((item, i) => (
                                            <motion.button
                                                key={i}
                                                className="mood-pulse-btn"
                                                whileHover={{ scale: 1.2, y: -5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    toast.success(`Energy logged: ${item.e}! You're doing great.`, {
                                                        icon: item.e,
                                                        duration: 4000
                                                    });

                                                    if (socket) {
                                                        socket.emit('journal-entry-created', {
                                                            studentName: user?.name,
                                                            mood: item.m,
                                                            content: `Logged mood: ${item.e}`
                                                        });
                                                    }
                                                }}
                                            >
                                                {item.e}
                                            </motion.button>
                                        ))}
                                    </div>
                                </Card>
                            </section>

                            <section className="portal-section">
                                <h2 className="section-title">Daily Reflection</h2>
                                <JournalWidget />
                            </section>

                            <section className="portal-section">
                                <h2 className="section-title">Achievements</h2>
                                <div className="achievements-list">
                                    {achievements.map((achievement, index) => (
                                        <Card
                                            key={index}
                                            variant="solid"
                                            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                                        >
                                            <div className="achievement-icon">{achievement.icon}</div>
                                            <div className="achievement-info">
                                                <h4>{achievement.title}</h4>
                                                <p>{achievement.description}</p>
                                            </div>
                                            {!achievement.unlocked && <div className="lock-overlay">🔒</div>}
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Recommendations */}
                        <div className="portal-right">
                            <section className="portal-section">
                                <h2 className="section-title">Recommended Just for You</h2>
                                <div className="recommendations-list">
                                    {recommendedStories.length > 0 ? (
                                        recommendedStories.map((story) => (
                                            <Card key={story.id} variant="glass" className="rec-card" hover={true} onClick={() => navigate(`/story/${story.id}`)}>
                                                <img
                                                    src={story.imageUrl || 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2680&auto=format&fit=crop'}
                                                    alt={story.title}
                                                    className="rec-image"
                                                />
                                                <div className="rec-content">
                                                    <span className="rec-category">{story.category.replace(/_/g, ' ')}</span>
                                                    <h3>{story.title}</h3>
                                                    <div className="rec-footer">
                                                        <span><FaBookOpen /> {story.estimatedReadingTime || 10} min</span>
                                                        <Button variant="primary" size="sm">Read Now</Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="no-data">No recommended stories yet. Explore the library!</p>
                                    )}
                                </div>
                            </section>

                            <section className="portal-section">
                                <Card variant="feature" className="assessment-cta" hover={true} onClick={() => navigate('/assessments')}>
                                    <div className="cta-icon"><FaClipboardList /></div>
                                    <h3>Time for a Check-in?</h3>
                                    <p>Take a quick assessment to understand your emotions better.</p>
                                    <Button variant="outline" size="sm">View Assessments</Button>
                                </Card>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
