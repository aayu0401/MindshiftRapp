import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaUsers, FaBook } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import { coursesData } from '../data/courseData';
import './Courses.css';

export default function Courses() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedAge, setSelectedAge] = useState('all');

    const categories = ['all', 'Emotional Intelligence', 'Resilience', 'Social Skills', 'Self-Esteem', 'Anxiety Management', 'Mental Health Literacy'];
    const ageGroups = ['all', '6-8', '9-11', '10-14', '12-14', '15-18'];

    const filteredCourses = coursesData.filter(course => {
        const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
        const ageMatch = selectedAge === 'all' || course.ageGroup === selectedAge;
        return categoryMatch && ageMatch;
    });

    return (
        <div className="courses-page">
            <Navigation />

            <section className="courses-hero section-md">
                <div className="hero-background-glow">
                    <div className="glow-orb orb-1"></div>
                    <div className="glow-orb orb-2"></div>
                </div>
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-6 border border-blue-500/20">
                            <FaBook /> Learning Library
                        </div>
                        <h1 className="courses-title">
                            Master Your <span className="text-gradient">Mental Wellbeing</span>
                        </h1>
                        <p className="courses-subtitle">
                            Expert-led courses combining psychological science with interactive storytelling.
                            Build resilience, confidence, and emotional intelligence at your own pace.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="courses-filters section-sm">
                <div className="container">
                    <div className="filters-wrapper">
                        <div className="filter-group">
                            <label>Category</label>
                            <div className="filter-buttons">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Age Group</label>
                            <div className="filter-buttons">
                                {ageGroups.map(age => (
                                    <button
                                        key={age}
                                        className={`filter-btn ${selectedAge === age ? 'active' : ''}`}
                                        onClick={() => setSelectedAge(age)}
                                    >
                                        {age}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="courses-grid-section section">
                <div className="container">
                    <div className="courses-grid">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card variant="glass" className="course-card" onClick={() => navigate(`/course/${course.id}`)}>
                                    {course.imageUrl && <div className="course-card-image" style={{ backgroundImage: `url(${course.imageUrl})` }} />}
                                    <div className="course-card-content">
                                        <div className="course-badge">{course.difficulty}</div>
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-description">{course.description}</p>
                                        <div className="course-meta">
                                            <span><FaClock /> {course.duration}</span>
                                            <span><FaUsers /> {course.enrolled} enrolled</span>
                                            <span><FaStar /> {course.rating}</span>
                                        </div>
                                        <div className="course-tags">
                                            <span className="tag">{course.category}</span>
                                            <span className="tag">Ages {course.ageGroup}</span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
