
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaBookOpen, FaPlayCircle, FaCheckCircle, FaStar, FaArrowLeft, FaGraduationCap, FaLock, FaPlay } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { coursesData } from '../data/courseData';
import './Courses.css'; // Reusing course styles + new detail styles

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<any>(null);
    const [activeModule, setActiveModule] = useState(0);

    // Mock Loading
    useEffect(() => {
        const foundCourse = coursesData.find(c => c.id === id);
        if (foundCourse) {
            // Enrich with mock module data since listing might not have it
            setCourse({
                ...foundCourse,
                modules: [
                    { id: 1, title: 'Introduction to Emotions', duration: '10 min', type: 'video', completed: true },
                    { id: 2, title: 'Identifying Triggers', duration: '15 min', type: 'reading', completed: false },
                    { id: 3, title: 'Coping Strategies', duration: '20 min', type: 'interactive', completed: false },
                    { id: 4, title: 'Course Quiz', duration: '10 min', type: 'quiz', completed: false }
                ]
            });
        }
    }, [id]);

    if (!course) return <div className="p-8 text-center text-white">Loading course...</div>;

    const currentModule = course.modules[activeModule];

    return (
        <div className="course-detail-page">
            <Navigation />

            <motion.div
                className="course-header-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    position: 'relative',
                    height: '60vh',
                    minHeight: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Parallax Background */}
                <motion.div
                    style={{
                        backgroundImage: `url(${course.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                />

                <div className="hero-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.95))',
                    backdropFilter: 'blur(2px)',
                    zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                    <motion.button
                        className="back-link"
                        onClick={() => navigate('/courses')}
                        whileHover={{ x: -5 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        <FaArrowLeft /> Back to Courses
                    </motion.button>

                    <div className="header-content" style={{ maxWidth: '800px' }}>
                        <div className="badge-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span className="badge badge-primary" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', borderRadius: '100px', fontWeight: 'bold' }}>{course.category}</span>
                            <span className="badge badge-outline" style={{ padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '100px' }}>{course.difficulty}</span>
                        </div>

                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {course.title}
                        </h1>

                        <p className="description-lg" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            {course.description}
                        </p>

                        <div className="stats-row detail-stats" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                                <FaClock className="text-primary" />
                                <span>{course.duration}</span>
                            </div>
                            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                                <FaBookOpen className="text-primary" />
                                <span>{course.modules.length} Modules</span>
                            </div>
                            <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                                <FaStar className="text-yellow-400" />
                                <span>{course.rating} (120 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="container section course-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem', padding: '4rem 0' }}>
                <div className="course-content-main">
                    {/* Player / Content Area */}
                    <Card variant="premium" className="player-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="player-wrapper" style={{ height: '400px', background: '#0f172a', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {currentModule.type === 'video' ? (
                                <motion.div
                                    className="video-placeholder"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}
                                >
                                    <motion.div
                                        className="play-btn-circle"
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(14, 165, 233, 1)' }}
                                        style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', marginBottom: '1rem', boxShadow: '0 0 30px rgba(14, 165, 233, 0.3)' }}
                                    >
                                        <FaPlay style={{ marginLeft: '5px' }} />
                                    </motion.div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>Click to Start Lesson</p>
                                </motion.div>
                            ) : (
                                <div className="content-placeholder" style={{ textAlign: 'center', padding: '2rem' }}>
                                    <FaBookOpen className="placeholder-icon" style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{currentModule.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Reading material and interactive content would appear here.</p>
                                </div>
                            )}

                            {/* Player Controls Mock */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                <div style={{ width: '35%', height: '100%', background: 'var(--color-primary)' }}></div>
                            </div>
                        </div>

                        <div className="player-actions" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <div>
                                <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>{currentModule.title}</h3>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Module {activeModule + 1} of {course.modules.length}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                                    disabled={activeModule === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => setActiveModule(Math.min(course.modules.length - 1, activeModule + 1))}
                                    disabled={activeModule === course.modules.length - 1}
                                >
                                    {activeModule === course.modules.length - 1 ? 'Finish Course' : 'Next Lesson'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* About Section */}
                    <div className="course-about" style={{ marginTop: '3rem', color: 'white' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>About This Course</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                            {course.description || "This course is designed to help students understand emotional regulation through evidence-based practices. By the end of this module, students will be able to identify core emotions and apply coping mechanisms."}
                        </p>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What You Will Learn</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Understand emotional triggers', 'Practice mindfulness techniques', 'Develop coping strategies', 'Build emotional resilience'].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    <FaCheckCircle className="text-primary" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="course-sidebar">
                    <Card variant="glass" className="syllabus-card" style={{ padding: '0', overflow: 'hidden', position: 'sticky', top: '100px' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ margin: 0 }}>Course Content</h3>
                        </div>
                        <div className="module-list" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                            {course.modules.map((mod: any, index: number) => (
                                <motion.div
                                    key={mod.id}
                                    className={`module-item ${activeModule === index ? 'active' : ''}`}
                                    onClick={() => setActiveModule(index)}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        cursor: 'pointer',
                                        borderLeft: activeModule === index ? '4px solid var(--color-primary)' : '4px solid transparent',
                                        background: activeModule === index ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div className="module-status" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ minWidth: '24px' }}>
                                            {mod.completed ?
                                                <FaCheckCircle className="text-emerald-400" /> :
                                                index === activeModule ?
                                                    <FaPlayCircle className="text-primary" /> :
                                                    mod.type === 'lock' ? <FaLock className="text-gray-500" /> :
                                                        <div style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{index + 1}</div>
                                            }
                                        </div>
                                        <div className="module-info">
                                            <span className="module-title" style={{ display: 'block', fontWeight: activeModule === index ? '600' : '400', color: activeModule === index ? 'white' : 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{mod.title}</span>
                                            <span className="module-meta" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{mod.type} • {mod.duration}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="enrollment-action" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Button variant="primary" className="full-width" style={{ width: '100%' }}>
                                <FaGraduationCap /> Continue Learning
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
}
