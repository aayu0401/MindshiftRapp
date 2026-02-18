import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const useNavigation = () => {
    const navigate = useNavigate();
    const [isNavigating, setIsNavigating] = useState(false);

    const navigateTo = async (path: string, message?: string) => {
        setIsNavigating(true);
        if (message) {
            toast.loading(message, { id: 'nav-loading', duration: 1500 });
        }

        // Artificial delay for smooth transition and visual feedback
        await new Promise(resolve => setTimeout(resolve, 800));

        navigate(path);
        setIsNavigating(false);
        toast.dismiss('nav-loading');
    };

    return { navigateTo, isNavigating };
};
