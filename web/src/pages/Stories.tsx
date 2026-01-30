import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { StoryCard } from '../components/Card';
import { fetchStories, Story } from '../api/stories.api';
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
    const ageGroups = ['all', '6-8', '6-10', '8-12', '10-14', 'AGE_6_8', 'AGE_8_10', 'AGE_10_12'];

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            setLoading(true);

            // Try to fetch from API
            const data = await fetchStories({ published: true });
            setStories(data);
            setUsingMockData(false);
        } catch (err: any) {
            console.warn('Backend not available, using mock data:', err.message);
            // Fallback to mock data if backend is not available
            setStories(sampleStories);
            setUsingMockData(true);
        } finally {
            setLoading(false);
        }
    };

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
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatAgeGroup = (ageGroup: string) => {
        if (!ageGroup) return '';
        return ageGroup.replace('AGE_', '').replace('_', '-');
    };

    return (
        <div className="stories-page">
            <Navigation />

            <section className="stories-hero section-sm">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="stories-title">Story Library</h1>
                        <p className="stories-subtitle">
                            Explore our curated collection of stories with embedded therapeutic questions
                            designed to spark meaningful conversations about mental and emotional health.
                        </p>
                        {usingMockData && (
                            <div className="demo-mode-badge">
                                <span className="badge-icon">📚</span>
                                <span>Demo Mode - Showing sample stories</span>
                                <button className="badge-retry" onClick={loadStories}>
                                    Try Backend
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="stories-filters section-sm">
                <div className="container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">Category</label>
                            <div className="filter-buttons">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category === 'all' ? 'All' : formatCategory(category)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Age Group</label>
                            <div className="filter-buttons">
                                {ageGroups.map(age => (
                                    <button
                                        key={age}
                                        className={`filter-btn ${selectedAgeGroup === age ? 'active' : ''}`}
                                        onClick={() => setSelectedAgeGroup(age)}
                                    >
                                        {age === 'all' ? 'All' : formatAgeGroup(age)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stories-grid-section section">
                <div className="container">
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading stories...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="stories-grid">
                            {filteredStories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <StoryCard
                                        title={story.title}
                                        author={story.author}
                                        excerpt={story.excerpt}
                                        category={formatCategory(story.category)}
                                        imageUrl={story.imageUrl}
                                        onClick={() => navigate(`/story/${story.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredStories.length === 0 && (
                        <div className="no-stories">
                            <p>No stories found matching your filters.</p>
                            <button className="btn btn-primary" onClick={() => {
                                setSelectedCategory('all');
                                setSelectedAgeGroup('all');
                            }}>
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
