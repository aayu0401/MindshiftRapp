import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Card } from '../components/Card';
import { getAssessmentById, calculateAssessmentScore, AssessmentResult } from '../data/assessmentData';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import './Assessment.css';

export default function Assessment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const assessment = id ? getAssessmentById(id) : undefined;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!assessment) {
        return (
            <div className="assessment-page">
                <Navigation />
                <div className="container section text-center">
                    <h2>Assessment not found</h2>
                    <Button onClick={() => navigate('/assessments')}>Back to Assessments</Button>
                </div>
                <Footer />
            </div>
        );
    }

    const question = assessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

    const handleResponse = (value: number) => {
        setResponses({ ...responses, [question.id]: value });
        // Auto-advance after small delay for smoother UX?
        // setTimeout(() => handleNext(), 400); // Optional: might be annoying if accidental click
    };

    const handleNext = () => {
        if (responses[question.id] === undefined) {
            toast.error('Please select an answer');
            return;
        }

        setDirection(1);
        if (currentQuestion < assessment.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Complete assessment
            const assessmentResult = calculateAssessmentScore(assessment, responses);
            setResult(assessmentResult);
            setCompleted(true);
        }
    };

    const handlePrevious = () => {
        setDirection(-1);
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0
        })
    };

    if (completed && result) {
        return (
            <div className="assessment-page">
                <Navigation />
                {result.riskLevel === 'low' && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}

                <section className="assessment-result section">
                    <div className="container container-narrow">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', duration: 0.8 }}
                        >
                            <Card variant="glass" className="result-card">
                                <div className={`result-icon ${result.riskLevel}`}>
                                    {result.riskLevel === 'high' ? <FaExclamationTriangle /> : <FaCheckCircle />}
                                </div>

                                <h1>Assessment Complete</h1>
                                <p className="text-xl text-gray-500 mb-6">Here is your personalized summary</p>

                                <div className={`risk-badge ${result.riskLevel}`}>
                                    {result.riskLevel.toUpperCase()} RISK INDICATED
                                </div>

                                <div className="result-score-container">
                                    <div className="score-ring">
                                        <svg viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                                            <circle
                                                cx="50" cy="50" r="45"
                                                stroke={result.riskLevel === 'low' ? '#10b981' : result.riskLevel === 'moderate' ? '#f59e0b' : '#ef4444'}
                                                strokeWidth="10"
                                                fill="none"
                                                strokeDasharray="283"
                                                strokeDashoffset={283 - (283 * (result.score / (assessment.questions.length * 5)))}
                                                transform="rotate(-90 50 50)"
                                                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                            />
                                        </svg>
                                        <div className="score-center">
                                            <span className="text-3xl font-bold">{result.score}</span>
                                            <span className="text-xs text-gray-400">POINTS</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="recommendations-box">
                                    <h3><FaShieldAlt className="inline mr-2" /> Recommended Steps</h3>
                                    {result.recommendations.map((rec, i) => (
                                        <motion.div
                                            key={i}
                                            className={`recommendation ${result.riskLevel}`}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                        >
                                            {rec}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="result-actions">
                                    <Button variant="outline" onClick={() => navigate('/assessments')}>
                                        Back to Library
                                    </Button>
                                    <Button variant="primary" onClick={() => navigate('/courses')}>
                                        Recommended Courses
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="assessment-page">
            <Navigation />

            <section className="assessment-header section-sm">
                <div className="container container-narrow text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">{assessment.title}</h1>
                        <p className="text-lg text-gray-600 mb-6">{assessment.description}</p>
                    </motion.div>
                </div>
            </section>

            <section className="assessment-content">
                <div className="container container-narrow">
                    {/* Progress Bar */}
                    <div className="progress-container-sticky">
                        <div className="flex justify-between text-sm text-gray-500 mb-2 font-semibold">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-track">
                            <motion.div
                                className="progress-fill-gradient"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="question-area">
                        <AnimatePresence mode='wait' custom={direction}>
                            <motion.div
                                key={currentQuestion}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full"
                            >
                                <Card variant="glass" className="question-card-enhanced">
                                    <h2 className="question-text-dynamic">{question.question}</h2>

                                    {question.type === 'scale' && question.scaleRange && (
                                        <div className="scale-options-container">
                                            <div className="scale-labels-fancy">
                                                <span className="label-left">{question.scaleRange.minLabel}</span>
                                                <span className="label-right">{question.scaleRange.maxLabel}</span>
                                            </div>
                                            <div className="scale-buttons-row">
                                                {Array.from(
                                                    { length: question.scaleRange.max - question.scaleRange.min + 1 },
                                                    (_, i) => i + question.scaleRange!.min
                                                ).map((value) => (
                                                    <motion.button
                                                        key={value}
                                                        whileHover={{ scale: 1.15, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`scale-btn-big ${responses[question.id] === value ? 'selected' : ''}`}
                                                        onClick={() => handleResponse(value)}
                                                    >
                                                        {value}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="assessment-navigation-floating">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className="nav-btn-prev"
                        >
                            <FaArrowLeft /> Previous
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            className="nav-btn-next"
                        >
                            {currentQuestion === assessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'} <FaArrowRight />
                        </Button>
                    </div>
                </div>
            </section>

            <div className="spacer-footer" style={{ height: '100px' }}></div>
        </div>
    );
}
