
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaSpinner, FaBrain, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getStoryById as getSampleStoryById } from '../data/sampleStories';
import { fetchStoryById, updateStoryProgress } from '../api/stories.api';
import { useRealtime } from '../context/RealtimeContext';
import { useAuth } from '../context/AuthContext';
import './StoryReader.css';

interface APIStory {
    id: string;
    title: string;
    author: string;
    description: string;
    category: string;
    ageGroup: string;
    imageUrl?: string;
    chapters: Array<{
        id: string;
        title: string;
        order: number;
        sections: Array<{
            id: string;
            type: 'TEXT' | 'QUESTION';
            content: string;
            order: number;
            question?: {
                id: string;
                questionText: string;
                questionType: 'REFLECTION' | 'DISCUSSION' | 'ACTIVITY';
            };
        }>;
    }>;
    progress?: {
        currentChapter: number;
        currentSection: number;
        completed: boolean;
    };
}

export default function StoryReader() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { socket } = useRealtime();
    const { user } = useAuth();

    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [usingMockData, setUsingMockData] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [savingProgress, setSavingProgress] = useState(false);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        loadStory();
    }, [id]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const loadStory = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const apiStory: any = await fetchStoryById(id);
            const convertedStory = convertAPIStory(apiStory);
            setStory(convertedStory);
            setUsingMockData(false);

            if (apiStory.progress) {
                setCurrentSection(apiStory.progress.currentSection || 0);
            }
        } catch (error) {
            const sampleStory = getSampleStoryById(id);
            if (sampleStory) {
                setStory(sampleStory);
                setUsingMockData(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const convertAPIStory = (apiStory: APIStory) => {
        const content: any[] = [];
        apiStory.chapters
            .sort((a, b) => a.order - b.order)
            .forEach(chapter => {
                chapter.sections
                    .sort((a, b) => a.order - b.order)
                    .forEach(section => {
                        if (section.type === 'TEXT') {
                            content.push({ type: 'text', content: section.content });
                        } else if (section.type === 'QUESTION' && section.question) {
                            const q = section.question as any;
                            content.push({
                                type: 'question',
                                content: q.question || q.questionText || "Reflect on this moment...",
                                questionType: (q.type || q.questionType || 'reflection').toLowerCase(),
                                questionId: q.id
                            });
                        }
                    });
            });

        return {
            id: apiStory.id,
            title: apiStory.title,
            author: apiStory.author,
            category: apiStory.category,
            ageGroup: apiStory.ageGroup,
            content
        };
    };

    const toggleRead = () => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        } else {
            const text = story.content[currentSection].content;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsReading(false);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
            setIsReading(true);
        }
    };

    const saveProgress = async (section: number, completed: boolean = false) => {
        if (usingMockData || !id) return;
        setSavingProgress(true);
        try {
            await updateStoryProgress(id, 0, section, completed);
        } catch (error) {
            console.error(error);
        } finally {
            setSavingProgress(false);
        }
    };

    const handleNext = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        if (!story || currentSection >= story.content.length - 1) return;
        const nextSection = currentSection + 1;
        setCurrentSection(nextSection);

        // REALTIME: Notify teacher of progress
        if (socket) {
            socket.emit('story-interaction', {
                studentName: user?.name,
                type: 'STORY_PROGRESS',
                content: `is now on page ${nextSection + 1} of "${story.title}"`
            });
        }

        saveProgress(nextSection, nextSection === story.content.length - 1);
    };

    const handlePrevious = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    if (loading) {
        return (
            <div className="story-reader">
                <Navigation />
                <div className="reader-container">
                    <div className="container text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hud-scanner-loading"
                        >
                            <div className="scanner-line"></div>
                            <h2 className="loading-text">SCANNING NEURAL NARRATIVE...</h2>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!story) return <div className="story-reader"><Navigation /><div className="container section">DATABASE ERROR: STORY NOT FOUND</div><Footer /></div>;

    const section = story.content[currentSection];
    const progress = ((currentSection + 1) / story.content.length) * 100;

    return (
        <div className="story-reader">
            <Navigation />
            <div className="reader-container">
                <div className="container container-narrow">
                    <motion.div className="reader-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="header-top">
                            <button className="back-button" onClick={() => navigate('/stories')}>
                                <FaArrowLeft /> Back to Library
                            </button>
                            <button className={`audio-btn ${isReading ? 'active' : ''}`} onClick={toggleRead}>
                                {isReading ? <FaVolumeMute /> : <FaVolumeUp />} {isReading ? 'Stop Reading' : 'Read Aloud'}
                            </button>
                        </div>
                        {story.imageUrl && (
                            <div className="reader-cover-image">
                                <img src={story.imageUrl} alt={story.title} />
                            </div>
                        )}
                        <h1 className="reader-title">{story.title}</h1>
                        <p className="reader-author">{story.author}</p>
                    </motion.div>

                    <div className="progress-container">
                        <div className="progress-info">
                            <span>Story Progress</span>
                            <span>{Math.round(((currentSection + 1) / story.content.length) * 100)}%</span>
                        </div>
                        <div className="progress-track">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentSection + 1) / story.content.length) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                            />
                        </div>
                    </div>

                    <div className="story-content-area">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentSection}
                                className="content-wrapper"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {section.type === 'text' ? (
                                    <motion.div
                                        className="story-card-container"
                                        initial={{ filter: 'blur(10px)', opacity: 0 }}
                                        animate={{ filter: 'blur(0px)', opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <div className="story-text-content">
                                            {section.content.split('\n').map((paragraph: string, pIdx: number) => (
                                                <motion.p
                                                    key={pIdx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: pIdx * 0.2 }}
                                                >
                                                    {paragraph}
                                                </motion.p>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="question-card-container">
                                        <div className="question-header">
                                            <div className="question-icon-wrapper">
                                                <FaBrain style={{ color: '#d97706' }} />
                                            </div>
                                            <span className="question-badge">
                                                {section.questionType} Moment
                                            </span>
                                            <h3 className="question-title">Time to Reflect</h3>
                                        </div>
                                        <p className="question-text-content">{section.content}</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="reader-navigation">
                        <button className="nav-btn" onClick={handlePrevious} disabled={currentSection === 0}>
                            <FaArrowLeft /> Previous
                        </button>
                        <button className="nav-btn primary" onClick={handleNext} disabled={currentSection === story.content.length - 1}>
                            Next Page <FaArrowRight />
                        </button>
                    </div>

                    {currentSection === story.content.length - 1 && (
                        <div className="story-complete-card">
                            <div className="completion-confetti">🎉</div>
                            <h3 className="complete-title">Story Completed!</h3>
                            <p style={{ color: '#64748b', fontSize: '1.2rem' }}>You've earned 50 Mind Points for completing this journey.</p>
                            <button className="complete-btn quiz-btn" onClick={() => navigate(`/story/${id}/quiz`)}>
                                <FaBrain /> Take Therapeutic Quiz
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
