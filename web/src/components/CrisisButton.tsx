import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CrisisButton.css';

export default function CrisisButton() {
    const navigate = useNavigate();

    return (
        <button
            className="crisis-button-fixed"
            onClick={() => navigate('/crisis-support')}
            aria-label="Get crisis support"
        >
            <FaExclamationTriangle />
            <span>Need Help?</span>
        </button>
    );
}
