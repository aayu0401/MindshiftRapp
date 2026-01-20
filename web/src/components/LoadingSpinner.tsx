import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({ size = 'md', color = 'var(--color-primary)', fullScreen = false }: LoadingSpinnerProps) {
    const sizes = {
        sm: '24px',
        md: '40px',
        lg: '60px'
    };

    const spinner = (
        <motion.div
            className="loading-spinner"
            style={{
                width: sizes[size],
                height: sizes[size],
                border: `4px solid rgba(0, 212, 170, 0.2)`,
                borderTopColor: color,
                borderRadius: '50%'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    );

    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                {spinner}
            </div>
        );
    }

    return spinner;
}
