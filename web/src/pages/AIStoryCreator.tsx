import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMagic, FaBook, FaUsers, FaHeart, FaBrain, FaSmile, FaSpinner } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';
import { generateAIStory, fetchAITemplates } from '../api/ai-generator.api';
import './AIStoryCreator.css';

export default function AIStoryCreator() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [usingMockData, setUsingMockData] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        ageGroup: '8-10',
        theme: 'friendship',
        length: 'medium',
        characters: ''
    });
    const [generatedStory, setGeneratedStory] = useState({
        title: '',
        content: '',
        questions: [] as string[]
    });

    const themes = [
        { value: 'friendship', label: 'Friendship', icon: <FaUsers /> },
        { value: 'courage', label: 'Courage', icon: <FaHeart /> },
        { value: 'anxiety', label: 'Managing Anxiety', icon: <FaBrain /> },
        { value: 'self-esteem', label: 'Self-Esteem', icon: <FaSmile /> }
    ];

    const handleGenerate = async () => {
        if (!formData.topic) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        try {
            // Try to generate from API
            const result: any = await generateAIStory({
                title: `The ${formData.topic} Adventure`,
                ageGroup: formData.ageGroup,
                category: formData.theme.toUpperCase(),
                therapeuticGoals: [formData.theme.toUpperCase()],
                criteria: {
                    topic: formData.topic,
                    characters: formData.characters,
                    length: formData.length
                }
            });

            const story = {
                title: result.title || `The ${formData.topic} Adventure`,
                content: result.content || result.generatedContent || '',
                questions: result.questions || []
            };

            setGeneratedStory(story);
            setGenerated(true);
            setUsingMockData(false);
            toast.success('Story generated successfully!');
        } catch (error) {
            console.log('Backend unavailable, using mock generation');
            // Fallback to mock generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const story = {
                title: `The ${formData.topic} Adventure`,
                content: `Once upon a time, in a peaceful village, there lived a young ${formData.characters || 'child'} who loved to explore. One day, they discovered something amazing about ${formData.topic}...\n\nAs they journeyed through the forest, they encountered challenges that tested their ${formData.theme}. With each obstacle, they learned valuable lessons about themselves and others.\n\nThrough determination and the help of friends, they overcame their fears and discovered that ${formData.topic} was not just about the destination, but about the journey and the growth along the way.\n\nIn the end, they returned home wiser and more confident, ready to share their newfound wisdom with others.`,
                questions: [
                    `How do you think the character felt when they first discovered ${formData.topic}?`,
                    `Can you think of a time when you showed ${formData.theme} like the character in the story?`,
                    `What would you have done differently if you were in the character's situation?`,
                    `How can we apply the lessons from this story to our own lives?`
                ]
            };

            setGeneratedStory(story);
            setGenerated(true);
            setUsingMockData(true);
            toast.success('Story generated (demo mode)!');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        toast.success('Story saved to library!');
        navigate('/stories');
    };

    const retryBackend = () => {
        setGenerated(false);
        setUsingMockData(false);
    };

    return (
        <div className="ai-creator-page">
            <Navigation />

            <section className="creator-hero section-sm">
                <div className="container container-narrow">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="creator-icon">
                            <FaMagic />
                        </div>
                        <h1 className="creator-title">AI Story Creator</h1>
                        <p className="creator-subtitle">
                            Generate custom therapeutic stories tailored to your students' needs
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="creator-content section">
                <div className="container container-narrow">
                    {!generated ? (
                        <Card variant="glass" className="creator-form-card">
                            <h2>Create Your Story</h2>

                            <div className="form-group">
                                <label htmlFor="topic">Story Topic</label>
                                <input
                                    id="topic"
                                    type="text"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    placeholder="e.g., Overcoming Fear, Making New Friends"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Mental Health Theme</label>
                                <div className="theme-grid">
                                    {themes.map(theme => (
                                        <button
                                            key={theme.value}
                                            className={`theme-btn ${formData.theme === theme.value ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, theme: theme.value })}
                                        >
                                            <span className="theme-icon">{theme.icon}</span>
                                            <span>{theme.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="ageGroup">Age Group</label>
                                    <select
                                        id="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="6-8">Ages 6-8</option>
                                        <option value="8-10">Ages 8-10</option>
                                        <option value="10-12">Ages 10-12</option>
                                        <option value="12-14">Ages 12-14</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="length">Story Length</label>
                                    <select
                                        id="length"
                                        value={formData.length}
                                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="short">Short (5 min)</option>
                                        <option value="medium">Medium (10 min)</option>
                                        <option value="long">Long (15 min)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="characters">Main Character (Optional)</label>
                                <input
                                    id="characters"
                                    type="text"
                                    value={formData.characters}
                                    onChange={(e) => setFormData({ ...formData, characters: e.target.value })}
                                    placeholder="e.g., brave knight, curious scientist"
                                    className="form-input"
                                />
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="generate-btn"
                            >
                                {loading ? <><FaSpinner className="spinner" /> Generating Story...</> : <><FaMagic /> Generate Story</>}
                            </Button>
                        </Card>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* Demo Mode Badge */}
                            {usingMockData && (
                                <div className="demo-mode-badge">
                                    <span className="badge-icon">✨</span>
                                    <span>Demo Mode - Using mock AI generation</span>
                                    <button className="badge-retry" onClick={retryBackend}>
                                        Try Backend
                                    </button>
                                </div>
                            )}

                            <Card variant="glass" className="story-preview-card">
                                <div className="preview-header">
                                    <h2>{generatedStory.title}</h2>
                                    <div className="preview-meta">
                                        <span>Ages {formData.ageGroup}</span>
                                        <span>{formData.theme}</span>
                                    </div>
                                </div>

                                <div className="story-content">
                                    <h3>Story</h3>
                                    <div className="story-text">
                                        {generatedStory.content.split('\n\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="questions-section">
                                    <h3>Therapeutic Questions</h3>
                                    <ul className="questions-list">
                                        {generatedStory.questions.map((q, i) => (
                                            <li key={i}>{q}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="preview-actions">
                                    <Button variant="outline" onClick={() => setGenerated(false)}>
                                        Generate Another
                                    </Button>
                                    <Button variant="primary" onClick={handleSave}>
                                        <FaBook /> Save to Library
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
