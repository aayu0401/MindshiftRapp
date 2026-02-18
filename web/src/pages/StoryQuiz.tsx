import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaBrain, FaArrowRight, FaHome, FaRedo } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import Confetti from 'react-confetti';
import { useRealtime } from '../context/RealtimeContext';
import { useAuth } from '../context/AuthContext';
import { fetchStoryById } from '../api/stories.api';
import './StoryQuiz.css';

// Mock data generator (fallback)
const generateQuizForStory = (storyId: string) => {
    return {
        title: "Understanding Your Emotions",
        questions: [
            {
                id: 1,
                question: "How do you think the main character felt when they faced the big challenge?",
                options: [
                    { id: 'a', text: "They were completely fearless", isCorrect: false },
                    { id: 'b', text: "They felt scared but did it anyway", isCorrect: true },
                    { id: 'c', text: "They didn't care about what happened", isCorrect: false },
                    { id: 'd', text: "They wanted to give up immediately", isCorrect: false }
                ],
                explanation: "Correct! Courage isn't the absence of fear, but acting in spite of it. Recognising fear is the first step to managing it (CBT Principle: Emotional Awareness)."
            },
            {
                id: 2,
                question: "What was a helpful thought the character had?",
                options: [
                    { id: 'a', text: "\"I'll never be able to do this.\"", isCorrect: false },
                    { id: 'b', text: "\"Everyone is laughing at me.\"", isCorrect: false },
                    { id: 'c', text: "\"I can try my best and ask for help.\"", isCorrect: true },
                    { id: 'd', text: "\"It's too hard, I quit.\"", isCorrect: false }
                ],
                explanation: "That's right! This is a 'Growth Mindset' thought. Replacing negative thoughts with helpful ones is key to overcoming anxiety (CBT Principle: Cognitive Restructuring)."
            },
            {
                id: 3,
                question: "What did the character do to calm down?",
                options: [
                    { id: 'a', text: "Took deep breaths and counted to ten", isCorrect: true },
                    { id: 'b', text: "Screamed at their friends", isCorrect: false },
                    { id: 'c', text: "Ran away and hid", isCorrect: false },
                    { id: 'd', text: "Pretended nothing was wrong", isCorrect: false }
                ],
                explanation: "Exactly! Deep breathing engages the parasympathetic nervous system, helping to physically reduce stress (PBCT Principle: Physiological Regulation)."
            }
        ]
    };
};

export default function StoryQuiz() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const { socket } = useRealtime();
    const { user } = useAuth();

    // Load quiz data (Fetch real or generate mock)
    useEffect(() => {
        const loadQuizData = async () => {
            if (!id) return;
            try {
                const story: any = await fetchStoryById(id);

                if (story && story.assessments && story.assessments.questions && story.assessments.questions.length > 0) {
                    // Use embedded assessments from the story
                    const adaptedQuiz = {
                        title: story.assessments.title || "Story Reflection Quiz",
                        questions: story.assessments.questions.map((q: any, index: number) => ({
                            id: q.id || index,
                            question: q.question,
                            options: q.options.map((o: any) => ({
                                id: o.id,
                                text: o.optionText || o.text,
                                isCorrect: o.isCorrect
                            })),
                            explanation: q.explanation || "Great reflection! Understanding the story helps us understand ourselves."
                        }))
                    };
                    setQuiz(adaptedQuiz);
                } else {
                    // Fallback to mock generator if no embedded quiz found
                    console.log("No embedded quiz found, using generic template.");
                    setQuiz(generateQuizForStory(id));
                }
            } catch (e) {
                console.error("Error loading quiz data:", e);
                setQuiz(generateQuizForStory(id));
            }
        };

        loadQuizData();
    }, [id]);

    const handleOptionClick = (optionId: string) => {
        if (isAnswered) return;
        setSelectedOption(optionId);
        setIsAnswered(true);

        const currentQ = quiz.questions[currentQuestion];
        const isCorrect = currentQ.options.find((o: any) => o.id === optionId)?.isCorrect;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);

            // REALTIME EMISSION
            if (socket) {
                socket.emit('quiz-completed', {
                    studentId: user?.id,
                    studentName: user?.name,
                    score: score + (quiz.questions[currentQuestion].options.find((o: any) => o.id === selectedOption)?.isCorrect ? 1 : 0),
                    totalQuestions: quiz.questions.length,
                    storyId: id
                });
            }
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (!quiz) return <div className="loading-quiz"><FaBrain className="spin" /> Preparing Assessment...</div>;

    const question = quiz.questions[currentQuestion];

    return (
        <div className="story-quiz-page">
            <Navigation />

            {showResults && <Confetti recycle={false} numberOfPieces={500} />}

            <div className="quiz-container">
                <motion.div
                    className="quiz-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="icon-wrapper" style={{ fontSize: '3rem', color: '#00d4aa', marginBottom: '1rem' }}>
                        <FaBrain />
                    </div>
                    <h1 className="quiz-title">{quiz.title}</h1>
                    <p className="quiz-subtitle">Let's see what you learned about yourself and the story.</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!showResults ? (
                        <motion.div
                            key="question-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card variant="glass" className="quiz-card">
                                <div className="question-count">
                                    Question {currentQuestion + 1} of {quiz.questions.length}
                                </div>
                                <h2 className="quiz-question">{question.question}</h2>

                                <div className="options-grid">
                                    {question.options.map((option: any) => (
                                        <button
                                            key={option.id}
                                            className={`option-btn ${isAnswered
                                                ? option.isCorrect
                                                    ? 'correct'
                                                    : selectedOption === option.id
                                                        ? 'incorrect'
                                                        : ''
                                                : selectedOption === option.id
                                                    ? 'selected'
                                                    : ''
                                                }`}
                                            onClick={() => handleOptionClick(option.id)}
                                            disabled={isAnswered}
                                        >
                                            <span>{option.text}</span>
                                            {isAnswered && option.isCorrect && <FaCheck />}
                                            {isAnswered && selectedOption === option.id && !option.isCorrect && <FaTimes />}
                                        </button>
                                    ))}
                                </div>

                                {isAnswered && (
                                    <motion.div
                                        className="feedback-section"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <span className="feedback-title">
                                            {question.options.find((o: any) => o.id === selectedOption)?.isCorrect ? "Spot on!" : "Not quite."}
                                        </span>
                                        <p className="feedback-text">{question.explanation}</p>
                                    </motion.div>
                                )}

                                {isAnswered && (
                                    <motion.button
                                        className="next-btn"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleNext}
                                    >
                                        {currentQuestion < quiz.questions.length - 1 ? (
                                            <>Next Question <FaArrowRight style={{ marginLeft: '8px' }} /></>
                                        ) : (
                                            "See Results"
                                        )}
                                    </motion.button>
                                )}
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card variant="glass" className="results-card">
                                <div className="success-icon-large">
                                    <FaCheck />
                                </div>
                                <h2>Great Reflection!</h2>
                                <p className="result-message">
                                    You scored {score} out of {quiz.questions.length}. Thanks for thinking deeply about the story.
                                </p>

                                <div className="privacy-badge">
                                    <span className="lock-icon">🔒</span>
                                    <span>Your responses have been securely sent to your teacher.</span>
                                </div>

                                <div className="cbt-insight-student">
                                    <h3>💡 Thoughts for You</h3>
                                    <p>Remember, like the character in the story, it's okay to ask for help when things feel big. You're doing great!</p>
                                </div>

                                <div className="actions-row">
                                    <Button variant="outline" onClick={restartQuiz}>
                                        <FaRedo /> Retry Reflection
                                    </Button>
                                    <Button variant="primary" onClick={() => navigate('/stories')}>
                                        <FaHome /> Back to Stories
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}
