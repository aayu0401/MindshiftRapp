import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Card } from '../components/Card';
import { getAssessmentById, calculateAssessmentScore, AssessmentResult } from '../data/assessmentData';
import toast from 'react-hot-toast';
import './Assessment.css';

export default function Assessment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const assessment = id ? getAssessmentById(id) : undefined;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);

    if (!assessment) {
        return (
            <div className="assessment-page">
                <Navigation />
                <div className="container section">
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
    };

    const handleNext = () => {
        if (responses[question.id] === undefined) {
            toast.error('Please select an answer');
            return;
        }

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
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    if (completed && result) {
        return (
            <div className="assessment-page">
                <Navigation />
                <section className="assessment-result section">
                    <div className="container container-narrow">
                        <Card variant="glass" className="result-card">
                            <div className={`result-icon ${result.riskLevel}`}>
                                {result.riskLevel === 'high' ? <FaExclamationTriangle /> : <FaCheckCircle />}
                            </div>

                            <h1>Assessment Complete</h1>
                            <h2>{assessment.title}</h2>

                            <div className={`risk-badge ${result.riskLevel}`}>
                                {result.riskLevel.toUpperCase()} RISK
                            </div>

                            <div className="result-score">
                                <div className="score-label">Your Score</div>
                                <div className="score-value">{result.score}</div>
                            </div>

                            <div className="recommendations">
                                <h3>Recommendations</h3>
                                {result.recommendations.map((rec, i) => (
                                    <div key={i} className={`recommendation ${result.riskLevel}`}>
                                        {rec}
                                    </div>
                                ))}
                            </div>

                            {result.requiresScreening && (
                                <div className="screening-alert">
                                    <FaExclamationTriangle />
                                    <div>
                                        <strong>Further Assessment Recommended</strong>
                                        <p>Based on your responses, we recommend speaking with a school counselor or mental health professional.</p>
                                    </div>
                                </div>
                            )}

                            <div className="result-actions">
                                <Button variant="outline" onClick={() => navigate('/assessments')}>
                                    Back to Assessments
                                </Button>
                                <Button variant="primary" onClick={() => navigate('/courses')}>
                                    Explore Courses
                                </Button>
                            </div>
                        </Card>
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
                <div className="container container-narrow">
                    <h1>{assessment.title}</h1>
                    <p>{assessment.description}</p>
                    <div className="assessment-meta">
                        <span className="meta-badge">{assessment.type}</span>
                        <span className="meta-badge">Ages {assessment.ageGroup}</span>
                    </div>
                </div>
            </section>

            <section className="assessment-content section">
                <div className="container container-narrow">
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
                            Question {currentQuestion + 1} of {assessment.questions.length}
                        </span>
                    </div>

                    {/* Question Card */}
                    <Card variant="glass" className="question-card">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="question-text">{question.question}</h2>

                            {question.type === 'scale' && question.scaleRange && (
                                <div className="scale-options">
                                    <div className="scale-labels">
                                        <span>{question.scaleRange.minLabel}</span>
                                        <span>{question.scaleRange.maxLabel}</span>
                                    </div>
                                    <div className="scale-buttons">
                                        {Array.from(
                                            { length: question.scaleRange.max - question.scaleRange.min + 1 },
                                            (_, i) => i + question.scaleRange!.min
                                        ).map((value) => (
                                            <button
                                                key={value}
                                                className={`scale-btn ${responses[question.id] === value ? 'selected' : ''}`}
                                                onClick={() => handleResponse(value)}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </Card>

                    {/* Navigation */}
                    <div className="assessment-navigation">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleNext}
                        >
                            {currentQuestion === assessment.questions.length - 1 ? 'Complete' : 'Next'}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
