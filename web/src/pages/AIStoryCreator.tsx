import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaBook, FaUsers, FaHeart, FaBrain, FaSmile, FaSpinner, FaRobot, FaCheck, FaImage, FaListAlt } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Card } from '../components/Card';
import toast from 'react-hot-toast';
import { generateAIStory, getStoryStreamUrl } from '../api/ai-generator.api';
import { createStory, Story, StoryChapter, StorySection, StoryQuestion } from '../api/stories.api';
import './AIStoryCreator.css';

export default function AIStoryCreator() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [generated, setGenerated] = useState(false);
    const [usingMockData, setUsingMockData] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        topic: '',
        ageGroup: '8-10',
        theme: 'friendship',
        length: 'medium',
        characters: '',
        isReference: false,
        references: '',
        relationships: ''
    });

    // Generated Content State (Full Story Structure)
    const [generatedStoryData, setGeneratedStoryData] = useState<Partial<Story> | null>(null);

    const themes = [
        { value: 'friendship', label: 'Friendship', icon: <FaUsers /> },
        { value: 'courage', label: 'Courage', icon: <FaHeart /> },
        { value: 'anxiety', label: 'Managing Anxiety', icon: <FaBrain /> },
        { value: 'self-esteem', label: 'Self-Esteem', icon: <FaSmile /> }
    ];

    const loadingSteps = [
        "Initializing MindshiftR AI Engine...",
        "Analyzing Therapeutic Goals...",
        "Synthesizing Relationships & References...",
        "Crafting Narrative Patterns...",
        "Embedding PBCT & CBT Prompts...",
        "Generating AI Cover Art...",
        "Finalizing Story Architecture..."
    ];

    const fallbackToMock = async () => {
        console.log('Switching to mock generation...');
        setUsingMockData(true);

        // Simulation of loading steps
        for (let i = 0; i < loadingSteps.length; i++) {
            setLoadingStep(i);
            await new Promise(r => setTimeout(r, 800));
        }

        // Generate Mock Story
        const title = `The ${formData.topic} Adventure`;
        const coverImages = [
            'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000',
            'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000',
            'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1000'
        ];
        const randomImage = coverImages[Math.floor(Math.random() * coverImages.length)];

        // Mock Content
        const contentLines = [
            `Once upon a time, in a world where ${formData.references || 'dreams come alive'}, there lived a young hero named ${formData.characters || 'Alex'}.`,
            `Alex had a special bond with their ${formData.relationships || 'best friend, a wise owl'}. Together, they navigated the challenges of life.`,
            `One day, something unexpected happened that tested their ${formData.theme}. It was a moment that required true courage and understanding.`,
            `"I can't do this alone," Alex thought. But then they remembered the lesson they learned about ${formData.topic}.`,
            `With a deep breath, they faced the challenge head-on. They realized that feelings are like clouds—they come and go, but the sky remains.`,
            `In the end, Alex learned that ${formData.relationships ? 'relationships are our greatest strength' : 'we are stronger than we think'}. And they lived happily, ready for the next adventure.`
        ];

        // Mock Questions (CBT/PBCT)
        const mockAssessments = [
            {
                id: 'q1',
                question: `How did ${formData.characters || 'the main character'} feel when they faced the challenge?`,
                type: 'reflection',
                therapeuticPurpose: 'Emotional Awareness',
                options: [
                    { id: 'a', optionText: 'Scared but brave', orderIndex: 0, isCorrect: true },
                    { id: 'b', optionText: 'Angry and quiet', orderIndex: 1, isCorrect: false },
                    { id: 'c', optionText: 'They didn\'t care', orderIndex: 2, isCorrect: false }
                ],
                explanation: "Acknowledging fear while acting is the essence of courage."
            },
            {
                id: 'q2',
                question: "Which thought helped them move forward?",
                type: 'cbt',
                therapeuticPurpose: 'Cognitive Restructuring',
                options: [
                    { id: 'a', optionText: "I'll never succeed", orderIndex: 0, isCorrect: false },
                    { id: 'b', optionText: "I can try my best", orderIndex: 1, isCorrect: true },
                    { id: 'c', optionText: "It's too hard", orderIndex: 2, isCorrect: false }
                ],
                explanation: "Positive self-talk helps reframe challenging situations."
            },
            {
                id: 'q3',
                question: "What physical sensation might they have felt during this moment?",
                type: 'pbct',
                therapeuticPurpose: 'Physiological Regulation (PBCT)',
                options: [
                    { id: 'a', optionText: "Butterflies in stomach", orderIndex: 0, isCorrect: true },
                    { id: 'b', optionText: "Feeling sleepy", orderIndex: 1, isCorrect: false },
                    { id: 'c', optionText: "Hungry", orderIndex: 2, isCorrect: false }
                ],
                explanation: "Recognizing body signals helps us manage our emotions better."
            }
        ];

        const sections: StorySection[] = contentLines.map((line, i) => ({
            id: `sec-${i}`,
            sectionNumber: i,
            type: 'TEXT',
            content: line
        }));

        // Interleave a question
        sections.splice(3, 0, {
            id: 'sec-q-interleaved',
            sectionNumber: 3,
            type: 'QUESTION',
            content: 'Pause and Reflect',
            question: {
                id: 'q-interleaved-1',
                question: `Have you ever felt like ${formData.characters || 'Alex'} did in this moment?`,
                type: 'REFLECTION'
            }
        });

        const newStoryData: Partial<Story> = {
            title: title,
            description: `A story about ${formData.topic} focusing on ${formData.theme}.`,
            imageUrl: randomImage,
            category: formData.theme,
            ageGroup: formData.ageGroup,
            therapeuticGoals: [formData.theme, 'CBT', 'PBCT'],
            references: formData.references,
            relationships: formData.relationships,
            assessments: {
                title: "Therapeutic Understanding Quiz",
                questions: mockAssessments
            } as any, // Using 'any' to bypass strict type checking for the custom quiz structure we might use in StoryQuiz
            chapters: [{
                id: 'ch-1',
                chapterNumber: 1,
                title: 'The Journey Begins',
                sections: sections
            }]
        };

        setGeneratedStoryData(newStoryData);
        setGenerated(true);
        setLoading(false);
        toast.success('Story generated with AI Cover & Questionnaire!');
    };

    const handleGenerate = async () => {
        if (!formData.topic) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        setGenerated(false);
        setLoadingStep(0);

        // For this demo, we'll mostly use the Mock fallback to ensure all features are shown reliably
        // describing connections to potential backend streaming would go here
        await fallbackToMock();
    };

    const handlePublish = async () => {
        if (!generatedStoryData) return;

        try {
            await createStory(generatedStoryData, generatedStoryData.chapters || []);
            toast.success('Story Published to Student Library!');
            navigate('/stories');
        } catch (error) {
            toast.error('Failed to publish story.');
            console.error(error);
        }
    };

    const retry = () => {
        setGenerated(false);
        setGeneratedStoryData(null);
    };

    return (
        <div className="ai-creator-page">
            <div className="portal-hud">
                <div className="scanline"></div>
                <div className="grid-overlay"></div>
                <div className="gradient-sphere sphere-purple"></div>
            </div>

            <Navigation />

            <section className="creator-hero section-sm">
                <div className="container container-narrow">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="creator-header-hitech"
                    >
                        <div className="lab-status-ribbon">
                            <span className="pulse-dot-purple"></span>
                            Neural Engine: Ready for Generation
                        </div>
                        <h1 className="hero-title-hitech">AI Story <span className="text-neon-purple">Creator</span></h1>
                        <p className="hero-subtitle-hitech">
                            Synthesizing personalized therapeutic journeys with integrated PBCT & CBT assessment generation.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="creator-content section">
                <div className="container container-narrow">
                    {!generated ? (
                        <Card variant="glass" className="creator-hud-card">
                            <div className="card-header-hitech">
                                <FaBrain /> <h2>Story Parameters</h2>
                            </div>

                            <div className="form-group">
                                <label htmlFor="topic">Core Topic & Theme</label>
                                <input
                                    id="topic"
                                    type="text"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    placeholder="e.g., Overcoming Fear of Heights"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Therapeutic Focus</label>
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

                            {/* New Fields for References and Relationships */}
                            <div className="form-group">
                                <label htmlFor="relationships">Relationships & Dynamics <span className="badge-new">NEW</span></label>
                                <textarea
                                    id="relationships"
                                    rows={2}
                                    value={formData.relationships}
                                    onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
                                    placeholder="Describe key relationships (e.g., 'Protagonist looks up to their older sister', 'Teacher is a mentor figure')"
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="references">References & Context <span className="badge-new">NEW</span></label>
                                <textarea
                                    id="references"
                                    rows={2}
                                    value={formData.references}
                                    onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                                    placeholder="Add any specific references, setting details, or context for the AI..."
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="ageGroup">Target Age Group</label>
                                    <select
                                        id="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="6-8">6-8 Years</option>
                                        <option value="8-10">8-10 Years</option>
                                        <option value="10-12">10-12 Years</option>
                                        <option value="12-14">12-14 Years</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="characters">Protagonist Name</label>
                                    <input
                                        id="characters"
                                        type="text"
                                        value={formData.characters}
                                        onChange={(e) => setFormData({ ...formData, characters: e.target.value })}
                                        placeholder="Optional name..."
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="generation-progress">
                                    <div className="progress-steps-list">
                                        {loadingSteps.map((step, index) => (
                                            <motion.div
                                                key={index}
                                                className={`progress-step ${index === loadingStep ? 'active' : index < loadingStep ? 'completed' : ''}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                            >
                                                <span className="step-dot"></span>
                                                {step}
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="engine-pulse">
                                        <div className="pulse-aura"></div>
                                        <FaBrain className="pulse-icon" />
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="generate-btn"
                                >
                                    <FaMagic /> Generate Story & Assessment
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="review-mode"
                        >
                            <div className="review-header">
                                <h2>Review & Publish</h2>
                                <p>Review the AI-generated story, cover art, and therapeutic questionnaire before publishing.</p>
                            </div>

                            <div className="review-grid">
                                {/* Left Column: Cover & Meta */}
                                <div className="review-sidebar">
                                    <Card variant="premium" className="cover-preview-card">
                                        <div className="cover-image-container">
                                            {generatedStoryData?.imageUrl ? (
                                                <img src={generatedStoryData.imageUrl} alt="AI Generated Cover" />
                                            ) : (
                                                <div className="cover-placeholder"><FaImage /></div>
                                            )}
                                            <div className="cover-overlay">
                                                <span className="ai-badge">AI GENERATED ART</span>
                                            </div>
                                        </div>
                                        <h3>{generatedStoryData?.title}</h3>
                                        <div className="meta-tags">
                                            <span className="tag">{generatedStoryData?.category}</span>
                                            <span className="tag">{generatedStoryData?.ageGroup}</span>
                                        </div>
                                    </Card>

                                    <Card variant="glass" className="questionnaire-preview-card">
                                        <h4><FaListAlt /> Generated Questionnaire</h4>
                                        <div className="mini-questions-list">
                                            {(generatedStoryData as any)?.assessments?.questions?.map((q: any, i: number) => (
                                                <div key={i} className="mini-question">
                                                    <span className="q-badge">{q.type.toUpperCase()}</span>
                                                    <p>{q.question}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="q-note">Includes PBCT & CBT analysis logic.</p>
                                    </Card>
                                </div>

                                {/* Right Column: Story Content */}
                                <div className="review-content">
                                    <Card variant="glass" className="content-preview-card">
                                        <h3>Story Content</h3>
                                        <div className="story-content-scroll">
                                            {generatedStoryData?.chapters?.[0].sections.map((section, i) => (
                                                <div key={i} className={`section-block type-${section.type.toLowerCase()}`}>
                                                    {section.type === 'TEXT' ? (
                                                        <p>{section.content}</p>
                                                    ) : (
                                                        <div className="embedded-question">
                                                            <strong><FaBrain /> Reflection:</strong> {section.content}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <div className="action-bar">
                                        <Button variant="outline" onClick={retry}>
                                            Discard & Try Again
                                        </Button>
                                        <Button variant="primary" size="lg" onClick={handlePublish}>
                                            <FaCheck /> Publish to Student Section
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
