
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaBookOpen, FaClipboardCheck, FaClock } from 'react-icons/fa';
import { useRealtime } from '../context/RealtimeContext';

interface Activity {
  id: string;
  studentName: string;
  type: string;
  content: string;
  timestamp: string | Date;
}

export default function LiveActivityFeed() {
  const { socket } = useRealtime();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleLiveActivity = (data: any) => {
      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        studentName: data.studentName || 'A Student',
        type: data.type,
        content: data.content || 'is active',
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10
    };

    socket.on('live-activity', handleLiveActivity);

    return () => {
      socket.off('live-activity');
    };
  }, [socket]);

  return (
    <div className="live-feed-container">
      <div className="feed-header">
        <div className="pulse-dot"></div>
        Live Classroom Activity
      </div>

      <div className="activities-list">
        <AnimatePresence initial={false}>
          {activities.length > 0 ? (
            activities.map(activity => (
              <motion.div
                key={activity.id}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="activity-icon">
                  {activity.type === 'STORY_PROGRESS' ? <FaBookOpen /> : <FaClipboardCheck />}
                </div>
                <div className="activity-content">
                  <div className="activity-info">
                    <strong>{activity.studentName}</strong> {activity.content}
                  </div>
                  <div className="activity-time">
                    <FaClock /> Just Now
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="empty-feed">
              <FaClock /> Waiting for student activity...
            </div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .live-feed-container {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .feed-header {
          padding: 1.25rem;
          font-weight: 800;
          color: white;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--color-neon-teal);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-neon-teal);
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 212, 170, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); }
        }
        .activities-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 1rem;
        }
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.2s;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-item:hover { background: rgba(255, 255, 255, 0.05); }
        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(0, 212, 170, 0.1);
          color: var(--color-neon-teal);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(0, 212, 170, 0.15);
        }
        .activity-content { flex: 1; }
        .activity-info {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.4;
        }
        .activity-info strong { color: white; }
        .activity-time {
          font-size: 0.75rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }
        .empty-feed {
          padding: 3rem;
          text-align: center;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
