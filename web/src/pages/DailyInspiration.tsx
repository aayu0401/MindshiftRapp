import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar, FaLeaf, FaSun, FaMoon, FaQuoteLeft, FaShareAlt, FaRedo, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import './DailyInspiration.css';

const inspirations = [
    { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", theme: "resilience" },
    { quote: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", theme: "courage" },
    { quote: "Every moment is a fresh beginning.", author: "T.S. Eliot", theme: "hope" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", theme: "passion" },
    { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", theme: "happiness" },
    { quote: "Be kind whenever possible. It is always possible.", author: "Dalai Lama", theme: "kindness" },
    { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", theme: "strength" },
    { quote: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha", theme: "self-love" },
    { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", theme: "perseverance" },
    { quote: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn", theme: "possibility" },
    { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", theme: "action" },
    { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", theme: "hope" },
    { quote: "The mind is everything. What you think, you become.", author: "Buddha", theme: "mindset" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", theme: "belief" },
    { quote: "Life isn't about waiting for the storm to pass. It's about learning to dance in the rain.", author: "Vivian Greene", theme: "adaptability" },
];

const themeColors: Record<string, { bg: string; accent: string; glow: string }> = {
    resilience: { bg: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', accent: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.3)' },
    courage: { bg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' },
    hope: { bg: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
    passion: { bg: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)', accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' },
    happiness: { bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' },
    kindness: { bg: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', accent: '#a78bfa', glow: 'rgba(167, 139, 250, 0.3)' },
    strength: { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', accent: '#6366f1', glow: 'rgba(99, 102, 241, 0.3)' },
    'self-love': { bg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', accent: '#ec4899', glow: 'rgba(236, 72, 153, 0.3)' },
    perseverance: { bg: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)', accent: '#14b8a6', glow: 'rgba(20, 184, 166, 0.3)' },
    possibility: { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', accent: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
    action: { bg: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.3)' },
    mindset: { bg: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)', accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)' },
    belief: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
    adaptability: { bg: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)', accent: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.3)' },
};

const wellnessActivities = [
    { icon: '🧘', title: '5-Min Meditation', desc: 'Close your eyes. Focus on your breath. Let thoughts float by like clouds.', duration: '5 min' },
    { icon: '📝', title: 'Gratitude List', desc: 'Write 3 things you\'re grateful for today. Small things count!', duration: '3 min' },
    { icon: '🚶', title: 'Mindful Walk', desc: 'Take a short walk. Notice 5 things you see, 4 you hear, 3 you can touch.', duration: '10 min' },
    { icon: '🎨', title: 'Creative Expression', desc: 'Draw, doodle, or color something. No rules, just expression.', duration: '15 min' },
    { icon: '💪', title: 'Body Scan', desc: 'Slowly focus attention from your toes to the top of your head. Release tension.', duration: '7 min' },
    { icon: '🌿', title: 'Nature Connection', desc: 'Step outside. Feel the air. Listen to natural sounds around you.', duration: '5 min' },
];

export default function DailyInspiration() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [favorited, setFavorited] = useState<number[]>([]);
    const [showActivities, setShowActivities] = useState(false);

    useEffect(() => {
        // Pick today's inspiration based on the day of year
        const start = new Date(new Date().getFullYear(), 0, 0);
        const diff = Date.now() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        setCurrentIndex(dayOfYear % inspirations.length);

        // Load favorites
        const saved = JSON.parse(localStorage.getItem('mindshiftr_favorites') || '[]');
        setFavorited(saved);
    }, []);

    const inspiration = inspirations[currentIndex];
    const theme = themeColors[inspiration.theme] || themeColors.resilience;

    const nextInspiration = () => {
        setCurrentIndex((prev) => (prev + 1) % inspirations.length);
    };

    const toggleFavorite = () => {
        const updated = favorited.includes(currentIndex)
            ? favorited.filter(i => i !== currentIndex)
            : [...favorited, currentIndex];
        setFavorited(updated);
        localStorage.setItem('mindshiftr_favorites', JSON.stringify(updated));
    };

    const shareQuote = async () => {
        const text = `"${inspiration.quote}" — ${inspiration.author}`;
        if (navigator.share) {
            try {
                await navigator.share({ text, title: 'Daily Inspiration from Mindshiftr' });
            } catch (e) { /* user cancelled */ }
        } else {
            navigator.clipboard.writeText(text);
        }
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const greetingIcon = hour < 12 ? <FaSun /> : hour < 17 ? <FaLeaf /> : <FaMoon />;

    return (
        <div className="inspiration-page">
            <Navigation />

            <div className="inspiration-container">
                {/* Greeting */}
                <motion.div
                    className="inspiration-greeting"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="greeting-icon">{greetingIcon}</span>
                    <h2>{greeting}</h2>
                    <p>Here's your daily dose of inspiration</p>
                </motion.div>

                {/* Main Quote Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className="quote-card"
                        style={{
                            '--quote-bg': theme.bg,
                            '--quote-accent': theme.accent,
                            '--quote-glow': theme.glow,
                        } as any}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                        <div className="quote-bg-pattern" aria-hidden="true">
                            <div className="quote-orb quote-orb-1"></div>
                            <div className="quote-orb quote-orb-2"></div>
                        </div>

                        <div className="quote-content">
                            <FaQuoteLeft className="quote-mark" />
                            <blockquote className="quote-text">
                                {inspiration.quote}
                            </blockquote>
                            <p className="quote-author">— {inspiration.author}</p>
                            <span className="quote-theme-badge">{inspiration.theme}</span>
                        </div>

                        <div className="quote-actions">
                            <motion.button
                                className={`quote-action-btn ${favorited.includes(currentIndex) ? 'favorited' : ''}`}
                                onClick={toggleFavorite}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaHeart />
                                <span>{favorited.includes(currentIndex) ? 'Saved' : 'Save'}</span>
                            </motion.button>
                            <motion.button
                                className="quote-action-btn"
                                onClick={shareQuote}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaShareAlt />
                                <span>Share</span>
                            </motion.button>
                            <motion.button
                                className="quote-action-btn"
                                onClick={nextInspiration}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaRedo />
                                <span>Next</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Wellness Activities */}
                <motion.div
                    className="wellness-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="wellness-header">
                        <h3>🌱 Today's Wellness Activities</h3>
                        <p>Small steps make big changes. Try one today!</p>
                    </div>
                    <div className="wellness-grid">
                        {wellnessActivities.map((activity, i) => (
                            <motion.div
                                key={i}
                                className="wellness-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)' }}
                            >
                                <span className="wellness-icon">{activity.icon}</span>
                                <div className="wellness-info">
                                    <h4>{activity.title}</h4>
                                    <p>{activity.desc}</p>
                                </div>
                                <span className="wellness-duration">{activity.duration}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="inspiration-stats"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="stat-item">
                        <FaStar className="stat-icon star" />
                        <span className="stat-value">{favorited.length}</span>
                        <span className="stat-label">Saved Quotes</span>
                    </div>
                    <div className="stat-item">
                        <FaHeart className="stat-icon heart" />
                        <span className="stat-value">{inspirations.length}</span>
                        <span className="stat-label">Inspirations</span>
                    </div>
                    <div className="stat-item">
                        <FaLeaf className="stat-icon leaf" />
                        <span className="stat-value">{wellnessActivities.length}</span>
                        <span className="stat-label">Activities</span>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
