import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaWind, FaHeart, FaLightbulb, FaSmile, FaMeh, FaFrown, FaSadTear, FaGrinStars, FaPencilAlt, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { chatWithAI } from '../api/ai-generator.api';
import './ZenBot.css';

const affirmations = [
    "You are brave and strong.",
    "It's okay to feel your feelings.",
    "Every day is a new start.",
    "You have the power to make good choices.",
    "You are loved and valued.",
    "Deep breaths help you stay calm.",
    "You are capable of amazing things.",
    "Your feelings are valid and important.",
    "Mistakes help you learn and grow.",
    "You deserve kindness, especially from yourself.",
    "It's okay to ask for help.",
    "You make the world a better place.",
    "Your best is always good enough.",
    "Tomorrow is a fresh beginning.",
    "You are stronger than you think."
];

const wisdomNuggets = [
    { emoji: '🧠', text: "Taking deep breaths tells your brain that you are safe, which helps you think more clearly!" },
    { emoji: '💪', text: "Your brain grows new connections every time you learn something new. You're literally getting smarter right now!" },
    { emoji: '🌊', text: "Emotions are like waves — they rise, peak, and pass. No feeling lasts forever." },
    { emoji: '⭐', text: "Being kind to others releases oxytocin, a hormone that actually makes YOU feel happier!" },
    { emoji: '🎯', text: "Your brain can't tell the difference between vivid imagination and reality. Visualize success to achieve it!" },
    { emoji: '🌱', text: "Gratitude rewires your brain. Writing 3 things you're thankful for daily can boost happiness by 25%!" },
    { emoji: '😴', text: "Your brain processes emotions while you sleep. A good night's rest helps you feel better emotionally!" },
    { emoji: '🤗', text: "A 20-second hug releases oxytocin, which reduces stress and makes you feel safe." },
    { emoji: '🎵', text: "Music can change your mood in just 30 seconds by affecting the same brain areas as food and exercise!" },
    { emoji: '🌈', text: "Smiling — even when you don't feel like it — sends signals to your brain that boost your mood!" }
];

const moods = [
    { id: 'great', emoji: <FaGrinStars />, label: 'Amazing', color: '#10b981', message: "That's wonderful! Keep spreading those good vibes! 🌟" },
    { id: 'good', emoji: <FaSmile />, label: 'Good', color: '#0ea5e9', message: "Great to hear! You're doing awesome! 💙" },
    { id: 'okay', emoji: <FaMeh />, label: 'Okay', color: '#f59e0b', message: "That's perfectly fine. Every day is different. 🌤️" },
    { id: 'sad', emoji: <FaFrown />, label: 'Sad', color: '#8b5cf6', message: "I'm sorry you're feeling this way. Remember, it's okay to not be okay. 💜" },
    { id: 'awful', emoji: <FaSadTear />, label: 'Upset', color: '#ef4444', message: "I hear you. Would you like to try a breathing exercise? It might help. ❤️" }
];

type BotMode = 'idle' | 'breathing' | 'affirmation' | 'insight' | 'mood' | 'moodResult' | 'gratitude' | 'chat';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function ZenBot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<BotMode>('idle');
    const [breathStep, setBreathStep] = useState<'inhale' | 'hold' | 'exhale' | 'done'>('inhale');
    const [counter, setCounter] = useState(4);
    const [breathCycles, setBreathCycles] = useState(0);
    const [currentAffirmation, setCurrentAffirmation] = useState("");
    const [currentWisdom, setCurrentWisdom] = useState(wisdomNuggets[0]);
    const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
    const [gratitudeText, setGratitudeText] = useState('');
    const [gratitudeSaved, setGratitudeSaved] = useState(false);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (mode === 'chat') {
            scrollToBottom();
        }
    }, [chatHistory, mode]);

    const startBreathing = () => {
        setMode('breathing');
        setBreathStep('inhale');
        setCounter(4);
        setBreathCycles(0);
    };

    const nextAffirmation = () => {
        setMode('affirmation');
        setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    };

    const nextWisdom = () => {
        setMode('insight');
        setCurrentWisdom(wisdomNuggets[Math.floor(Math.random() * wisdomNuggets.length)]);
    };

    const handleMoodSelect = (mood: typeof moods[0]) => {
        setSelectedMood(mood);
        setMode('moodResult');
    };

    const handleGratitudeSave = () => {
        if (gratitudeText.trim()) {
            // Save to localStorage
            const saved = JSON.parse(localStorage.getItem('mindshiftr_gratitude') || '[]');
            saved.push({ text: gratitudeText, date: new Date().toISOString() });
            localStorage.setItem('mindshiftr_gratitude', JSON.stringify(saved.slice(-50)));
            setGratitudeSaved(true);
            setGratitudeText('');
            setTimeout(() => {
                setGratitudeSaved(false);
                setMode('idle');
            }, 2500);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || isTyping) return;

        const userMsg = chatInput.trim();
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const reply = await chatWithAI(userMsg, chatHistory);
            setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "I'm having a little trouble connecting. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        let timer: any;
        if (mode === 'breathing') {
            timer = setInterval(() => {
                setCounter((prev) => {
                    if (prev <= 1) {
                        if (breathStep === 'inhale') { setBreathStep('hold'); return 4; }
                        if (breathStep === 'hold') { setBreathStep('exhale'); return 4; }
                        if (breathStep === 'exhale') {
                            setBreathCycles((c) => {
                                if (c >= 2) { // 3 cycles total
                                    setMode('idle');
                                    return 0;
                                }
                                setBreathStep('inhale');
                                return c + 1;
                            });
                            return 4;
                        }
                        return 4;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [mode, breathStep]);

    const goBack = () => setMode('idle');

    return (
        <div className="zenbot-container">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        className="zenbot-window"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="zenbot-header">
                            <div className="zenbot-title">
                                <div className="zenbot-title-icon">
                                    <FaRobot />
                                </div>
                                <div className="zenbot-title-text">
                                    <span>{user?.role === 'student' ? 'ZenBot' : 'Mindshiftr AI'}</span>
                                    <span className="zenbot-status">● System Live</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => { setIsOpen(false); setMode('idle'); }}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="zenbot-content">
                            <AnimatePresence mode="wait">
                                {mode === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        className="zenbot-welcome"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="zenbot-avatar">{user?.role === 'student' ? '🤖' : '🛡️'}</div>
                                        <h3>{user?.role === 'student' ? "Hi there! I'm ZenBot" : `Greetings, ${user?.name || 'Guardian'}`}</h3>
                                        <p>{user?.role === 'student' ? "Your wellbeing companion. How can I help?" : "How can I assist with your institutional objectives today?"}</p>
                                        <div className="zenbot-actions">
                                            <button className="zen-action-btn" onClick={() => setMode('chat')}>
                                                <span className="zen-action-icon chat-ai-icon"><FaRobot /></span>
                                                <span className="zen-action-text">
                                                    <strong>Chat with AI</strong>
                                                    <small>Talk about anything</small>
                                                </span>
                                            </button>
                                            <button className="zen-action-btn" onClick={startBreathing}>
                                                <span className="zen-action-icon breath-icon"><FaWind /></span>
                                                <span className="zen-action-text">
                                                    <strong>Breathing Exercise</strong>
                                                    <small>Calm down in 1 minute</small>
                                                </span>
                                            </button>
                                            <button className="zen-action-btn" onClick={() => setMode('mood')}>
                                                <span className="zen-action-icon mood-icon"><FaSmile /></span>
                                                <span className="zen-action-text">
                                                    <strong>Mood Check-in</strong>
                                                    <small>How are you feeling?</small>
                                                </span>
                                            </button>
                                            <button className="zen-action-btn" onClick={nextAffirmation}>
                                                <span className="zen-action-icon heart-icon"><FaHeart /></span>
                                                <span className="zen-action-text">
                                                    <strong>Get Affirmation</strong>
                                                    <small>Positive encouragement</small>
                                                </span>
                                            </button>
                                            <button className="zen-action-btn" onClick={nextWisdom}>
                                                <span className="zen-action-icon wisdom-icon"><FaLightbulb /></span>
                                                <span className="zen-action-text">
                                                    <strong>Wisdom Nugget</strong>
                                                    <small>Fun brain facts</small>
                                                </span>
                                            </button>
                                            <button className="zen-action-btn" onClick={() => setMode('gratitude')}>
                                                <span className="zen-action-icon gratitude-icon"><FaPencilAlt /></span>
                                                <span className="zen-action-text">
                                                    <strong>Gratitude Journal</strong>
                                                    <small>What are you thankful for?</small>
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'breathing' && (
                                    <motion.div
                                        key="breathing"
                                        className="zenbot-breathing"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <div className="breath-progress">
                                            {[0, 1, 2].map((i) => (
                                                <div key={i} className={`breath-dot ${i <= breathCycles ? 'active' : ''}`} />
                                            ))}
                                        </div>
                                        <motion.div
                                            className="breath-circle"
                                            animate={{
                                                scale: breathStep === 'inhale' ? 1.6 : breathStep === 'exhale' ? 0.7 : 1.6,
                                                boxShadow: breathStep === 'inhale'
                                                    ? '0 0 60px rgba(14, 165, 233, 0.4)'
                                                    : breathStep === 'exhale'
                                                        ? '0 0 20px rgba(14, 165, 233, 0.15)'
                                                        : '0 0 40px rgba(14, 165, 233, 0.3)'
                                            }}
                                            transition={{ duration: 4, ease: "easeInOut" }}
                                        >
                                            <FaWind />
                                        </motion.div>
                                        <h2 className="breath-instruction">
                                            {breathStep === 'inhale' && 'Breathe In...'}
                                            {breathStep === 'hold' && 'Hold...'}
                                            {breathStep === 'exhale' && 'Breathe Out...'}
                                        </h2>
                                        <div className="breath-counter">{counter}</div>
                                        <button className="btn-stop" onClick={goBack}>
                                            <FaArrowLeft /> Stop & Go Back
                                        </button>
                                    </motion.div>
                                )}

                                {mode === 'affirmation' && (
                                    <motion.div
                                        key="affirmation"
                                        className="zenbot-affirmation"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="affirmation-glow">
                                            <div className="affirmation-icon">✨</div>
                                        </div>
                                        <motion.p
                                            key={currentAffirmation}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="affirmation-text"
                                        >
                                            "{currentAffirmation}"
                                        </motion.p>
                                        <div className="zenbot-footer-actions">
                                            <Button variant="outline" size="sm" onClick={nextAffirmation}>Another one ✨</Button>
                                            <Button variant="primary" size="sm" onClick={goBack}>Back</Button>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'insight' && (
                                    <motion.div
                                        key="insight"
                                        className="zenbot-insight"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="insight-emoji">{currentWisdom.emoji}</div>
                                        <p className="insight-text">{currentWisdom.text}</p>
                                        <div className="zenbot-footer-actions">
                                            <Button variant="outline" size="sm" onClick={nextWisdom}>More 🧠</Button>
                                            <Button variant="primary" size="sm" onClick={goBack}>Thanks!</Button>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'mood' && (
                                    <motion.div
                                        key="mood"
                                        className="zenbot-mood"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <h3 className="mood-title">How are you feeling?</h3>
                                        <p className="mood-subtitle">It's okay to feel anything right now</p>
                                        <div className="mood-options">
                                            {moods.map((mood) => (
                                                <motion.button
                                                    key={mood.id}
                                                    className="mood-btn"
                                                    onClick={() => handleMoodSelect(mood)}
                                                    whileHover={{ scale: 1.1, y: -4 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{ '--mood-color': mood.color } as any}
                                                >
                                                    <span className="mood-emoji">{mood.emoji}</span>
                                                    <span className="mood-label">{mood.label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                        <button className="btn-back-link" onClick={goBack}>
                                            <FaArrowLeft /> Back
                                        </button>
                                    </motion.div>
                                )}

                                {mode === 'moodResult' && selectedMood && (
                                    <motion.div
                                        key="moodResult"
                                        className="zenbot-mood-result"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <div className="mood-result-icon" style={{ color: selectedMood.color }}>
                                            {selectedMood.emoji}
                                        </div>
                                        <p className="mood-result-message">{selectedMood.message}</p>
                                        {(selectedMood.id === 'sad' || selectedMood.id === 'awful') && (
                                            <Button variant="primary" size="sm" onClick={startBreathing}>
                                                Try Breathing Exercise 🌬️
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" onClick={goBack}>Thank you ❤️</Button>
                                    </motion.div>
                                )}

                                {mode === 'gratitude' && (
                                    <motion.div
                                        key="gratitude"
                                        className="zenbot-gratitude"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="gratitude-header-icon">🙏</div>
                                        <h3>Gratitude Journal</h3>
                                        <p>Write one thing you're grateful for today:</p>
                                        {gratitudeSaved ? (
                                            <motion.div
                                                className="gratitude-saved"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                            >
                                                <span className="saved-check">✅</span>
                                                <p>Saved! Gratitude grows happiness 🌱</p>
                                            </motion.div>
                                        ) : (
                                            <>
                                                <textarea
                                                    value={gratitudeText}
                                                    onChange={(e) => setGratitudeText(e.target.value)}
                                                    placeholder="Today I'm grateful for..."
                                                    className="gratitude-input"
                                                    rows={3}
                                                    maxLength={200}
                                                />
                                                <div className="gratitude-char-count">
                                                    {gratitudeText.length}/200
                                                </div>
                                                <div className="zenbot-footer-actions">
                                                    <Button variant="outline" size="sm" onClick={goBack}>Cancel</Button>
                                                    <Button variant="primary" size="sm" onClick={handleGratitudeSave}>Save 🌟</Button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                {mode === 'chat' && (
                                    <motion.div
                                        key="chat"
                                        className="zenbot-chat"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="chat-messages">
                                            {chatHistory.length === 0 && (
                                                <div className="chat-empty">
                                                    <p>How can I support you today?</p>
                                                </div>
                                            )}
                                            {chatHistory.map((msg, i) => (
                                                <div key={i} className={`chat-bubble ${msg.role}`}>
                                                    {msg.content}
                                                </div>
                                            ))}
                                            {isTyping && (
                                                <div className="chat-bubble assistant typing">
                                                    <span className="dot"></span>
                                                    <span className="dot"></span>
                                                    <span className="dot"></span>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>
                                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                placeholder="Type your message..."
                                                className="chat-input"
                                            />
                                            <button type="submit" className="chat-send-btn" disabled={!chatInput.trim() || isTyping}>
                                                <FaPaperPlane />
                                            </button>
                                        </form>
                                        <button className="btn-back-link" onClick={goBack}>
                                            <FaArrowLeft /> Back
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        className="zenbot-trigger"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 1 }}
                    >
                        <div className="trigger-pulse"></div>
                        <div className="trigger-pulse trigger-pulse-2"></div>
                        <FaRobot />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
