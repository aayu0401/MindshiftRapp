import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getStoryById } from '../data/sampleStories';
import './StoryReader.css';

export default function StoryReader() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const story = id ? getStoryById(id) : undefined;
    const [currentSection, setCurrentSection] = useState(0);

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

    const handleNext = () => {
        if (currentSection < story.content.length - 1) {
            setCurrentSection(currentSection + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const section = story.content[currentSection];
    const progress = ((currentSection + 1) / story.content.length) * 100;

    return (
        <div className="story-reader">
            <Navigation />

            <div className="reader-container">
                <div className="container container-narrow">
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
