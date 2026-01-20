import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { StoryCard } from '../components/Card';
import { sampleStories } from '../data/sampleStories';
import './Stories.css';

export default function Stories() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');

    const categories = ['all', 'Classic Literature', 'Modern Classic', 'Original Story'];
    const ageGroups = ['all', '6-10', '8-12', '10-14'];

    const filteredStories = sampleStories.filter(story => {
        const categoryMatch = selectedCategory === 'all' || story.category === selectedCategory;
        const ageMatch = selectedAgeGroup === 'all' || story.ageGroup === selectedAgeGroup;
        return categoryMatch && ageMatch;
    });

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
                                        {category}
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
                                        {age}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stories-grid-section section">
                <div className="container">
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
                                    category={story.category}
                                    imageUrl={story.imageUrl}
                                    onClick={() => navigate(`/story/${story.id}`)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {filteredStories.length === 0 && (
                        <div className="no-stories">
                            <p>No stories found matching your filters.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
