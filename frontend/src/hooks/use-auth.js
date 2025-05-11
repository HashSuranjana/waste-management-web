import { useState, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config.js';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogout = useCallback(async () => {
        setError('');
        setLoading(true);

        try {
            await signOut(auth);

            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');

            navigate('/', { replace: true });

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            setError('Failed to log out. Please try again.');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { handleLogout, loading, error };
};

export default useAuth;