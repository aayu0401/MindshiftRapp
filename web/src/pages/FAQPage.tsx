import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import './FAQPage.css';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        question: 'What is Mindshiftr and how does it work?',
        answer: 'Mindshiftr is a new way to build better emotional wellbeing and resilience in your classroom. Integrating and harnessing the power of storytelling, psychology and data to support your children. Our digital platform contains different programmes each with a series of specially treated short story collections for a range of ages and abilities that can be read aloud together and are combined with evidence-based therapy type questions that will spark an insightful, reflective conversation.',
        category: 'General'
    },
    {
        question: 'Who is Mindshiftr for?',
        answer: 'Mindshiftr is designed for schools, teachers, and educators who want to support the emotional wellbeing and mental health of their students. It\'s suitable for a range of ages and abilities, with specially curated content for different age groups.',
        category: 'General'
    },
    {
        question: 'What makes Mindshiftr different?',
        answer: 'Mindshiftr uniquely combines three powerful elements: evidence-based psychology (CBT and SLT), engaging storytelling, and advanced technology. Our platform doesn\'t just provide stories - it embeds therapeutic questions at key moments to spark meaningful conversations about mental and emotional health.',
        category: 'Platform'
    },
    {
        question: 'How do the therapeutic questions work?',
        answer: 'Each story is carefully treated with embedded questions based on Cognitive Behavioural Therapy (CBT) and Social Learning Theory (SLT). These questions appear at strategic moments in the story to help students reflect on characters\' experiences and relate them to their own emotions and behaviors.',
        category: 'Methodology'
    },
    {
        question: 'Can teachers track student progress?',
        answer: 'Yes! Our platform includes a customized teacher dashboard that allows you to monitor, analyze, and report on students\' emotional and mental wellbeing. The technology takes the guesswork out of understanding your pupils\' behavior and helps you tailor your approach to their needs.',
        category: 'Platform'
    },
    {
        question: 'Is there a free trial available?',
        answer: 'Yes, we offer a 14-day free trial for schools to explore our platform and story library. You can sign up without a credit card and get full access to select stories and assessments.',
        category: 'Billing'
    }
];

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = ['All', 'General', 'Platform', 'Methodology', 'Billing'];

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <Navigation />

            <div className="faq-page-container">
                <section className="faq-hero">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="faq-hero-content"
                        >
                            <h1 className="faq-page-title">How can we help you?</h1>
                            <p className="faq-page-subtitle">Find answers to common questions about Mindshiftr.</p>

                            <div className="search-wrapper">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    className="faq-search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="container container-narrow">
                    <div className="faq-categories">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="faq-results">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="faq-page-item"
                                >
                                    <button
                                        className={`faq-page-question ${openIndex === index ? 'active' : ''}`}
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <span className="question-text">{faq.question}</span>
                                        <span className={`chevron-icon ${openIndex === index ? 'rotate' : ''}`}>
                                            <FaChevronDown />
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                className="faq-page-answer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="answer-content">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <div className="no-results">
                                <FaQuestionCircle className="no-results-icon" />
                                <h3>No results found</h3>
                                <p>Try adjusting your search or category.</p>
                            </div>
                        )}
                    </div>

                    <div className="support-card-section">
                        <Card variant="premium" className="contact-support-card">
                            <h3>Still have questions?</h3>
                            <p>Our team is here to help you get the most out of Mindshiftr.</p>
                            <button className="btn-primary">Contact Support</button>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
