import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import './LiveReadCounter.css';

interface LiveReadCounterProps {
    min?: number;
    max?: number;
}

export default function LiveReadCounter({ min = 5, max = 25 }: LiveReadCounterProps) {
    const [count, setCount] = useState(Math.floor(Math.random() * (max - min)) + min);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const next = prev + change;
                return Math.max(min, Math.min(max, next));
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [min, max]);

    return (
        <div className="live-read-counter">
            <span className="pulse-dot"></span>
            <FaEye className="eye-icon" />
            <span className="count-text">{count} reading now</span>
        </div>
    );
}
