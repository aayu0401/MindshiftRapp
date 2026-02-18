import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    fullScreen?: boolean;
    text?: string;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'var(--color-primary)',
    fullScreen = false,
    text
}: LoadingSpinnerProps) {
    const sizes = {
        sm: { width: 24, stroke: 3 },
        md: { width: 48, stroke: 4 },
        lg: { width: 80, stroke: 6 },
        xl: { width: 120, stroke: 8 }
    };

    const { width, stroke } = sizes[size];

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div style={{ position: 'relative', width, height: width }}>
                {/* Outer Ring */}
                <motion.span
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        border: `${stroke}px solid ${color}`,
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0.8
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring (Reverse) */}
                <motion.span
                    style={{
                        display: 'block',
                        width: '70%',
                        height: '70%',
                        border: `${stroke}px solid ${color}`,
                        borderBottomColor: 'transparent',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '15%',
                        left: '15%',
                        opacity: 0.5
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Pulse Center */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '40%',
                        width: '20%',
                        height: '20%',
                        backgroundColor: color,
                        borderRadius: '50%'
                    }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 font-medium text-sm mt-4 tracking-wider uppercase"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999
            }}>
                {spinnerContent}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
            {spinnerContent}
        </div>
    );
}
