import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getStoryById as getSampleStoryById } from '../data/sampleStories';
import { fetchStoryById, updateStoryProgress } from '../api/stories.api';
import './StoryReader.css';

// API Story type (matches backend schema)
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

    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [usingMockData, setUsingMockData] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [savingProgress, setSavingProgress] = useState(false);

    useEffect(() => {
        loadStory();
    }, [id]);

    const loadStory = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Try to fetch from API
            const apiStory: any = await fetchStoryById(id);

            // Convert API story to component format
            const convertedStory = convertAPIStory(apiStory);
            setStory(convertedStory);
            setUsingMockData(false);

            // Set progress from API if available
            if (apiStory.progress) {
                setCurrentChapter(apiStory.progress.currentChapter || 0);
                setCurrentSection(apiStory.progress.currentSection || 0);
            }
        } catch (error) {
            console.log('Backend unavailable, using sample data');
            // Fallback to mock data
            const sampleStory = getSampleStoryById(id);
            if (sampleStory) {
                setStory(sampleStory);
                setUsingMockData(true);
            } else {
                setStory(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const convertAPIStory = (apiStory: APIStory) => {
        // Flatten chapters and sections into a single content array
        const content: any[] = [];

        apiStory.chapters
            .sort((a, b) => a.order - b.order)
            .forEach(chapter => {
                chapter.sections
                    .sort((a, b) => a.order - b.order)
                    .forEach(section => {
                        if (section.type === 'TEXT') {
                            content.push({
                                type: 'text',
                                content: section.content
                            });
                        } else if (section.type === 'QUESTION' && section.question) {
                            content.push({
                                type: 'question',
                                content: section.question.questionText,
                                questionType: section.question.questionType.toLowerCase(),
                                questionId: section.question.id
                            });
                        }
                    });
            });

        return {
            id: apiStory.id,
            title: apiStory.title,
            author: apiStory.author,
            excerpt: apiStory.description,
            category: apiStory.category,
            ageGroup: apiStory.ageGroup,
            imageUrl: apiStory.imageUrl,
            content
        };
    };

    const saveProgress = async (section: number, completed: boolean = false) => {
        if (usingMockData || !id) return;

        setSavingProgress(true);
        try {
            await updateStoryProgress(id, currentChapter, section, completed);
        } catch (error) {
            console.error('Failed to save progress:', error);
        } finally {
            setSavingProgress(false);
        }
    };

    const handleNext = () => {
        if (!story || currentSection >= story.content.length - 1) return;

        const nextSection = currentSection + 1;
        setCurrentSection(nextSection);

        // Save progress to backend
        const isComplete = nextSection === story.content.length - 1;
        saveProgress(nextSection, isComplete);
    };

    const handlePrevious = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const retryBackend = () => {
        loadStory();
    };

    if (loading) {
        return (
            <div className="story-reader">
                <Navigation />
                <div className="container section">
                    <div className="loading-state">
                        <FaSpinner className="spinner" />
                        <p>Loading story...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!story) {
        return (
            <div className="story-reader">
                <Navigation />
                <div className="container section">
                    <h2>Story not found</h2>
                    <button onClick={() => navigate('/stories')}>Back to Stories</button>
                </div>
                <Footer />
            </div>
        );
    }

    const section = story.content[currentSection];
    const progress = ((currentSection + 1) / story.content.length) * 100;

    return (
        <div className="story-reader">
            <Navigation />

            <div className="reader-container">
                <div className="container container-narrow">
                    {/* Demo Mode Badge */}
                    {usingMockData && (
                        <div className="demo-mode-badge">
                            <span className="badge-icon">📖</span>
                            <span>Demo Mode - Using sample data</span>
                            <button className="badge-retry" onClick={retryBackend}>
                                Try Backend
                            </button>
                        </div>
                    )}

                    {/* Story Header */}
                    <motion.div
                        className="reader-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button className="back-button" onClick={() => navigate('/stories')}>
                            <FaArrowLeft /> Back to Stories
                        </button>
                        <h1 className="reader-title">{story.title}</h1>
                        <p className="reader-author">by {story.author}</p>
                        <div className="reader-meta">
                            <span className="meta-badge">{story.category}</span>
                            <span className="meta-badge">Ages {story.ageGroup}</span>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="progress-text">
                            Section {currentSection + 1} of {story.content.length}
                            {savingProgress && <span className="saving-indicator"> • Saving...</span>}
                        </span>
                    </div>

                    {/* Content Section */}
                    <motion.div
                        key={currentSection}
                        className={`content-section ${section.type === 'question' ? 'question-section' : 'text-section'}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {section.type === 'text' ? (
                            <div className="story-text">
                                <p>{section.content}</p>
                            </div>
                        ) : (
                            <div className="question-card glass">
                                <div className="question-icon">💭</div>
                                <h3 className="question-type">
                                    {section.questionType === 'reflection' && 'Reflection Question'}
                                    {section.questionType === 'discussion' && 'Discussion Question'}
                                    {section.questionType === 'activity' && 'Activity'}
                                </h3>
                                <p className="question-text">{section.content}</p>
                                <div className="question-hint">
                                    Take a moment to think about this question. There are no wrong answers.
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="reader-navigation">
                        <button
                            className="nav-btn"
                            onClick={handlePrevious}
                            disabled={currentSection === 0}
                        >
                            <FaArrowLeft /> Previous
                        </button>
                        <button
                            className="nav-btn primary"
                            onClick={handleNext}
                            disabled={currentSection === story.content.length - 1}
                        >
                            Next <FaArrowRight />
                        </button>
                    </div>

                    {currentSection === story.content.length - 1 && (
                        <motion.div
                            className="story-complete"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3>Story Complete! 🎉</h3>
                            <p>You've finished reading "{story.title}"</p>
                            <button className="complete-btn" onClick={() => navigate('/stories')}>
                                Explore More Stories
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
