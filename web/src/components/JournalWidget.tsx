import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSmile, FaMeh, FaFrown, FaGrinBeam, FaSadTear, FaPlus } from 'react-icons/fa';
import { createJournalEntry } from '../api/journal.api';
import { useRealtime } from '../context/RealtimeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function JournalWidget() {
    const { socket } = useRealtime();
    const { user } = useAuth();
    const [mood, setMood] = useState<number | null>(null);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const moods = [
        { value: 5, icon: <FaGrinBeam />, label: 'Great', color: '#00d4aa' },
        { value: 4, icon: <FaSmile />, label: 'Good', color: '#10b981' },
        { value: 3, icon: <FaMeh />, label: 'Okay', color: '#f59e0b' },
        { value: 2, icon: <FaFrown />, label: 'Bad', color: '#f97316' },
        { value: 1, icon: <FaSadTear />, label: 'Awful', color: '#ef4444' },
    ];

    const handleSubmit = async () => {
        if (!mood || !content) {
            toast.error('Please select a mood and write something');
            return;
        }

        try {
            setSubmitting(true);
            await createJournalEntry({
                mood,
                content,
                tags: mood > 3 ? ['positive'] : ['reflection'],
                gratitudeHighlights: [],
            });

            // REALTIME EMISSION
            if (socket) {
                socket.emit('journal-entry-created', {
                    studentId: user?.id,
                    studentName: user?.name,
                    mood,
                    content
                });
            }

            toast.success('Journal entry saved!');
            setMood(null);
            setContent('');
            setExpanded(false);
        } catch (error) {
            toast.error('Failed to save journal entry');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="journal-widget-container">
            <motion.div
                className={`glass-card journal-widget ${expanded ? 'expanded' : ''}`}
                layout
            >
                {!expanded ? (
                    <div className="journal-collapsed" onClick={() => setExpanded(true)}>
                        <div className="journal-icon-circle">
                            <FaPlus />
                        </div>
                        <div className="journal-text">
                            <h4>How are you feeling today?</h4>
                            <p>Track your mood and thoughts</p>
                        </div>
                    </div>
                ) : (
                    <div className="journal-expanded">
                        <div className="journal-header">
                            <h3>Daily Check-in</h3>
                            <button className="btn-close" onClick={() => setExpanded(false)}>&times;</button>
                        </div>

                        <div className="mood-selector">
                            {moods.map((m) => (
                                <button
                                    key={m.value}
                                    className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                                    onClick={() => setMood(m.value)}
                                    style={{ '--mood-color': m.color } as any}
                                >
                                    {m.icon}
                                    <span>{m.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="content-area">
                            <textarea
                                placeholder="What's on your mind today? (Optional)"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="journal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={submitting || mood === null}
                            >
                                {submitting ? 'Saving...' : 'Save Entry'}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            <style>{`
                .journal-widget {
                    padding: 1.25rem;
                    border-radius: 1.5rem;
                    background: white;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 2rem;
                }
                .journal-widget:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
                }
                .journal-widget.expanded {
                    cursor: default;
                    padding: 2rem;
                }
                .journal-collapsed {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }
                .journal-icon-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 16px;
                    background: var(--gradient-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.25rem;
                    box-shadow: 0 8px 16px rgba(0, 212, 170, 0.2);
                }
                .journal-text h4 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--color-text-primary);
                    font-weight: 700;
                }
                .journal-text p {
                    margin: 2px 0 0;
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                }
                .journal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .journal-header h3 {
                    margin: 0;
                    font-weight: 800;
                    color: var(--color-text-primary);
                }
                .btn-close {
                    background: rgba(0, 0, 0, 0.05);
                    border: none;
                    color: var(--color-text-secondary);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    font-size: 1.25rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .btn-close:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }
                .mood-selector {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }
                .mood-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 1rem 0.5rem;
                    border-radius: 1.25rem;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mood-btn:hover {
                    border-color: var(--mood-color);
                    background: white;
                    color: var(--mood-color);
                    transform: translateY(-3px);
                }
                .mood-btn.active {
                    background: white;
                    color: var(--mood-color);
                    border-color: var(--mood-color);
                    border-width: 2px;
                    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
                    transform: scale(1.05);
                }
                .mood-btn svg {
                    font-size: 1.75rem;
                }
                .mood-btn span {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }
                .content-area textarea {
                    width: 100%;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.25rem;
                    padding: 1.25rem;
                    color: var(--color-text-primary);
                    font-family: inherit;
                    font-size: 1rem;
                    resize: none;
                    margin-bottom: 1.5rem;
                    transition: all 0.2s;
                }
                .content-area textarea:focus {
                    outline: none;
                    background: white;
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 4px rgba(0, 212, 170, 0.1);
                }
                .journal-footer {
                    display: flex;
                    justify-content: flex-end;
                }
            `}</style>
        </div>
    );
}
