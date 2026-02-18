import { FaExclamationTriangle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './CrisisButton.css';

export default function CrisisButton() {
    const navigate = useNavigate();
    const location = useLocation();

    const isSignup = location.pathname === '/signup';

    return (
        <button
            className={`crisis-button-fixed ${isSignup ? 'on-signup' : ''}`}
            onClick={() => navigate('/crisis-support')}
            aria-label="Get crisis support"
        >
            <FaExclamationTriangle />
            <span>Need Help?</span>
        </button>
    );
}
