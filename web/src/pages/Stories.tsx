import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaSync } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { StoryCard, StoryCardSkeleton } from '../components/Card';
import { fetchStories } from '../api/stories.api';
import { sampleStories } from '../data/sampleStories';
import './Stories.css';

export default function Stories() {
    const navigate = useNavigate();
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingMockData, setUsingMockData] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');

    const categories = ['all', 'Classic Literature', 'Modern Classic', 'Original Story', 'ANXIETY_MANAGEMENT', 'SOCIAL_SKILLS', 'SELF_ESTEEM'];
    const ageGroups = ['all', '6-10', '10-14'];

    const loadStories = async () => {
        try {
            setLoading(true);
            const data = await fetchStories({ published: true });
            setStories(data);
            setUsingMockData(false);
        } catch (err: any) {
            console.warn('Backend not available, using mock data:', err.message);
            setStories(sampleStories);
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStories();
    }, []);

    const filteredStories = stories.filter(story => {
        const categoryMatch = selectedCategory === 'all' ||
            story.category === selectedCategory ||
            (story.category && story.category.toLowerCase().includes(selectedCategory.toLowerCase()));

        const ageMatch = selectedAgeGroup === 'all' ||
            story.ageGroup === selectedAgeGroup ||
            (story.ageGroup && story.ageGroup.toLowerCase().includes(selectedAgeGroup.toLowerCase()));

        return categoryMatch && ageMatch;
    });

    const formatCategory = (category: string) => {
        if (!category) return '';
        if (category === 'all') return 'All Stories';
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatAgeGroup = (ageGroup: string) => {
        if (!ageGroup) return '';
        if (ageGroup === 'all') return 'All Ages';
        return `Ages ${ageGroup.replace('AGE_', '').replace('_', '-')}`;
    };

    return (
        <div className="stories-page">
            <Navigation />

            {/* Hero */}
            <section className="stories-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="stories-hero-badge">
                            <FaBook /> Story Library
                        </div>
                        <h1 className="stories-title">
                            Therapeutic <span className="stories-title-accent">Stories</span>
                        </h1>
                        <p className="stories-subtitle">
                            Explore our curated collection of evidence-based stories designed to build emotional resilience, empathy, and wellbeing in young minds.
                        </p>

                        {usingMockData && (
                            <motion.div
                                className="demo-mode-pill"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <span className="pill-pulse" />
                                <span>Showing sample stories</span>
                                <button className="pill-action" onClick={loadStories}>
                                    <FaSync style={{ marginRight: '0.3rem' }} /> Refresh
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <section className="stories-filters">
                <div className="container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <span className="filter-label">Category</span>
                            <div className="filter-buttons">
                                {categories.slice(0, 5).map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {formatCategory(cat)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <span className="filter-label">Age Group</span>
                            <div className="filter-buttons">
                                {ageGroups.map(age => (
                                    <button
                                        key={age}
                                        className={`filter-btn ${selectedAgeGroup === age ? 'active' : ''}`}
                                        onClick={() => setSelectedAgeGroup(age)}
                                    >
                                        {formatAgeGroup(age)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="stories-grid-section">
                <div className="container">
                    <div className="archive-status-hud">
                        <div className="status-node">
                            <span className="pulse-dot-green" />
                            {filteredStories.length} {filteredStories.length === 1 ? 'Story' : 'Stories'} Available
                        </div>
                    </div>

                    <div className="stories-grid">
                        {loading ? (
                            [...Array(6)].map((_, i) => <StoryCardSkeleton key={i} />)
                        ) : (
                            filteredStories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <StoryCard
                                        title={story.title}
                                        author={story.author}
                                        excerpt={story.description || story.excerpt}
                                        category={story.category}
                                        imageUrl={story.imageUrl}
                                        onClick={() => navigate(`/story/${story.id}`)}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>

                    {!loading && filteredStories.length === 0 && (
                        <div className="no-stories">
                            <p>No stories found matching your filters.</p>
                            <button
                                className="filter-btn active"
                                onClick={() => { setSelectedCategory('all'); setSelectedAgeGroup('all'); }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
