import React from 'react';
import Navigation from '../components/Navigation';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function FAQPage() {
    return (
        <div className="faq-page">
            <Navigation />
            <FAQ />
            <Footer />
        </div>
    );
}
