
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaLightbulb, FaRobot, FaTimes } from 'react-icons/fa';
import { useRealtime } from '../context/RealtimeContext';
import { Card } from './Card';
import Button from './Button';

interface Insight {
    patternIdentifier: string;
    confidence: number;
    description: string;
    teacherGuidance: string;
    suggestedActivity: string;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

interface DeepInsightEvent {
    studentName: string;
    insights: Insight[];
}

export default function SmartInsightCard() {
    const { socket } = useRealtime();
    const [activeInsight, setActiveInsight] = useState<{ studentName: string, insight: Insight } | null>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on('deep-insights', (data: DeepInsightEvent) => {
            // For demo, we just show the first insight that arrives
            if (data.insights.length > 0) {
                setActiveInsight({
                    studentName: data.studentName,
                    insight: data.insights[0]
                });
            }
        });

        return () => {
            socket.off('deep-insights');
        };
    }, [socket]);

    if (!activeInsight) {
        return (
            <Card variant="solid" className="waiting-insight-card">
                <div className="waiting-content">
                    <FaRobot className="bot-icon-waiting" />
                    <h3>AI Analysis Standby</h3>
                    <p>Analyzing student reflections globally... Insights will appear here as they are detected.</p>
                </div>
                <style>{`
          .waiting-insight-card {
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: rgba(15, 23, 42, 0.2);
            border: 2px dashed rgba(255, 255, 255, 0.05);
            border-radius: 24px;
          }
          .waiting-content h3 { color: white; margin-top: 1rem; }
          .waiting-content p { font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; }
          .bot-icon-waiting { font-size: 2rem; color: #475569; margin-bottom: 1rem; }
        `}</style>
            </Card>
        );
    }

    const { insight, studentName } = activeInsight;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <Card variant="premium" className="smart-insight-card-active">
                    <button className="close-insight" onClick={() => setActiveInsight(null)}>
                        <FaTimes />
                    </button>

                    <div className="insight-badge">
                        <FaBrain /> NEW AI INSIGHT
                    </div>

                    <div className="insight-header">
                        <h3>{insight.patternIdentifier} detected for {studentName}</h3>
                        <span className={`risk-pill ${(insight.riskLevel || 'LOW').toLowerCase()}`}>
                            {insight.riskLevel || 'LOW'} Risk
                        </span>
                    </div>

                    <p className="insight-desc">{insight.description}</p>

                    <div className="guidance-box">
                        <h4><FaLightbulb /> Teacher Guidance</h4>
                        <p>{insight.teacherGuidance}</p>
                    </div>

                    <div className="activity-suggestion">
                        <strong>Recommended Activity:</strong> {insight.suggestedActivity}
                    </div>

                    <div className="insight-footer">
                        <Button variant="primary" size="sm">Acknowledge</Button>
                        <Button variant="outline" size="sm">Assign Exercise</Button>
                    </div>
                </Card>

                <style>{`
          .smart-insight-card-active {
            position: relative;
            border-left: 5px solid ${insight.riskLevel === 'HIGH' ? '#ef4444' : '#f59e0b'};
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(30px);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            border-radius: 24px !important;
          }
          .close-insight {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #475569;
            cursor: pointer;
            transition: color 0.2s;
          }
          .close-insight:hover { color: white; }
          .insight-badge {
            font-size: 0.7rem;
            font-weight: 800;
            color: var(--color-neon-blue);
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .insight-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .insight-header h3 { font-size: 1.1rem; margin: 0; color: white; line-height: 1.4; }
          .risk-pill {
            padding: 0.2rem 0.6rem;
            border-radius: 1rem;
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
          }
          .risk-pill.high { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
          .risk-pill.moderate { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
          .risk-pill.low { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
          
          .insight-desc { font-size: 0.9rem; color: #94a3b8; margin-bottom: 1.25rem; line-height: 1.6; }
          .guidance-box {
            background: rgba(255, 255, 255, 0.03);
            padding: 1.25rem;
            border-radius: 1rem;
            margin-bottom: 1.25rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .guidance-box h4 {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: var(--color-neon-yellow);
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .guidance-box p { font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; }
          .activity-suggestion {
            font-size: 0.85rem;
            color: #64748b;
            margin-bottom: 1.5rem;
            padding-left: 0.5rem;
            border-left: 2px solid rgba(255, 255, 255, 0.1);
          }
          .activity-suggestion strong { color: #94a3b8; }
          .insight-footer {
            display: flex;
            gap: 0.75rem;
          }
        `}</style>
            </motion.div>
        </AnimatePresence>
    );
}
