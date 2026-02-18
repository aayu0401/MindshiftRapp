import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';
import LiveReadCounter from './LiveReadCounter';

interface CardProps {
    children: React.ReactNode;
    variant?: 'glass' | 'solid' | 'feature' | 'premium' | 'deep';
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, variant = 'glass', className = '', hover = true, onClick }: CardProps) {
    return (
        <motion.div
            className={`card card-${variant} ${hover ? 'card-hover' : ''} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {children}
        </motion.div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    imageUrl?: string;
}

export function FeatureCard({ icon, title, description, imageUrl }: FeatureCardProps) {
    return (
        <Card variant="feature" className="pillar-feature-card">
            {imageUrl && <div className="feature-pillar-image" style={{ backgroundImage: `url(${imageUrl})` }} />}
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </Card>
    );
}

interface StoryCardProps {
    title: string;
    author: string;
    excerpt: string;
    category: string;
    imageUrl?: string;
    onClick?: () => void;
}

export function StoryCard({ title, author, excerpt, category, imageUrl, onClick }: StoryCardProps) {
    return (
        <motion.div
            className="story-card"
            onClick={onClick}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            {imageUrl && (
                <div className="story-card-image" style={{ backgroundImage: `url(${imageUrl})` }}>
                    <div className="story-card-overlay">
                        <LiveReadCounter />
                    </div>
                </div>
            )}
            <div className="story-card-content">
                <span className="story-card-category">{category}</span>
                <h3 className="story-card-title">{title}</h3>
                <p className="story-card-author">by {author}</p>
                <p className="story-card-excerpt">{excerpt}</p>
            </div>
        </motion.div>
    );
}
export function StoryCardSkeleton() {
    return (
        <div className="story-card skeleton-card">
            <div className="skeleton skeleton-image" />
            <div className="story-card-content">
                <div className="skeleton skeleton-category" />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            </div>
        </div>
    );
}
