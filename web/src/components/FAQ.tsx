import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import './FAQ.css';

interface FAQItemProps {
    question: string;
    answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <button
                className="faq-question"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <motion.span
                    className="faq-icon"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaChevronDown />
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQ() {
    const faqs = [
        {
            question: 'What is Mindshiftr and how does it work?',
            answer: 'Mindshiftr is a new way to build better emotional wellbeing and resilience in your classroom. Integrating and harnessing the power of storytelling, psychology and data to support your children. Our digital platform contains different programmes each with a series of specially treated short story collections for a range of ages and abilities that can be read aloud together and are combined with evidence-based therapy type questions that will spark an insightful, reflective conversation.'
        },
        {
            question: 'Who is Mindshiftr for?',
            answer: 'Mindshiftr is designed for schools, teachers, and educators who want to support the emotional wellbeing and mental health of their students. It\'s suitable for a range of ages and abilities, with specially curated content for different age groups.'
        },
        {
            question: 'What makes Mindshiftr different from other programs?',
            answer: 'Mindshiftr uniquely combines three powerful elements: evidence-based psychology (CBT and SLT), engaging storytelling, and advanced technology. Our platform doesn\'t just provide stories - it embeds therapeutic questions at key moments to spark meaningful conversations about mental and emotional health.'
        },
        {
            question: 'How do the therapeutic questions work?',
            answer: 'Each story is carefully treated with embedded questions based on Cognitive Behavioural Therapy (CBT) and Social Learning Theory (SLT). These questions appear at strategic moments in the story to help students reflect on characters\' experiences and relate them to their own emotions and behaviors.'
        },
        {
            question: 'Can teachers track student progress?',
            answer: 'Yes! Our platform includes a customized teacher dashboard that allows you to monitor, analyze, and report on students\' emotional and mental wellbeing. The technology takes the guesswork out of understanding your pupils\' behavior and helps you tailor your approach to their needs.'
        }
    ];

    return (
        <section className="faq-section section">
            <div className="container container-narrow">
                <motion.div
                    className="faq-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <p className="faq-subtitle">
                        Everything you need to know about Mindshiftr
                    </p>
                </motion.div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <FAQItem question={faq.question} answer={faq.answer} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
