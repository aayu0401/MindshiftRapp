import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaBook, FaMicrochip } from 'react-icons/fa';
import { FeatureCard } from './Card';
import './Pillars.css';

export default function Pillars() {
    const pillars = [
        {
            icon: <FaBrain />,
            title: 'Psychology',
            description: 'Our programmes are developed using evidence-based approaches and scientifically-proven principles, such as cognitive behavioural therapy (CBT) and Social Learning theory (SLT) that help people build sustainable emotional wellbeing habits that last a lifetime.',
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop'
        },
        {
            icon: <FaBook />,
            title: 'Storytelling',
            description: 'Each programme contains a collection of curated, tested & highly engaging short stories for people to read together. Each story is embedded with a series of specially guided, therapeutic question/activities that aim to stimulate purposeful conversations about mental & emotional health.',
            imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000&auto=format&fit=crop'
        },
        {
            icon: <FaMicrochip />,
            title: 'Technology',
            description: 'Our library of enjoyable and engaging therapeutic story collections is accessible via a flexible, self-serve delivery platform which has a customised user dashboard that takes the guesswork out of understanding your pupils\' behaviour. The technology enables you to monitor, analyse and report pupils\' emotional & mental wellbeing helping you to tailor your work to their needs.',
            imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop'
        }
    ];

    return (
        <section className="pillars section">
            {/* Fancy Background Elements */}
            <div className="pillars-bg-blob blob-1"></div>
            <div className="pillars-bg-blob blob-2"></div>

            <div className="container">
                <motion.div
                    className="pillars-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="vision-card">
                        <span className="method-badge">The Mindshiftr Method</span>
                        <h2 className="pillars-title">
                            A mental health literacy programme that integrates
                            <span className="highlight-text-blue"> behavioural science </span>
                            with <span className="highlight-text-purple">brilliant stories</span>,
                            great technology and data to support young people.
                        </h2>
                    </div>
                </motion.div>

                <motion.div
                    className="pillars-grid"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {pillars.map((pillar) => (
                        <motion.div
                            key={pillar.title}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <FeatureCard
                                icon={pillar.icon}
                                title={pillar.title}
                                description={pillar.description}
                                imageUrl={pillar.imageUrl}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
