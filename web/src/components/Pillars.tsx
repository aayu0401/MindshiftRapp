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
            description: 'Our programmes are developed using evidence-based approaches and scientifically-proven principles, such as cognitive behavioural therapy (CBT) and Social Learning theory (SLT) that help people build sustainable emotional wellbeing habits that last a lifetime.'
        },
        {
            icon: <FaBook />,
            title: 'Storytelling',
            description: 'Each programme contains a collection of curated, tested & highly engaging short stories for people to read together. Each story is embedded with a series of specially guided, therapeutic question/activities that aim to stimulate purposeful conversations about mental & emotional health.'
        },
        {
            icon: <FaMicrochip />,
            title: 'Technology',
            description: 'Our library of enjoyable and engaging therapeutic story collections is accessible via a flexible, self-serve delivery platform which has a customised user dashboard that takes the guesswork out of understanding your pupils\' behaviour. The technology enables you to monitor, analyse and report pupils\' emotional & mental wellbeing helping you to tailor your work to their needs.'
        }
    ];

    return (
        <section className="pillars section">
            <div className="container">
                <motion.div
                    className="pillars-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="pillars-title">
                        Mindshiftr is a mental health literacy programme that integrates & harnesses
                        the power of behavioural science with brilliant stories, great technology and
                        data to support children & young people
                    </h2>
                </motion.div>

                <div className="pillars-grid">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <FeatureCard
                                icon={pillar.icon}
                                title={pillar.title}
                                description={pillar.description}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
