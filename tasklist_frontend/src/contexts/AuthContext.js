// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/auth';

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Initialize auth state on app load
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check if user is in localStorage
                const storedUser = authService.getCurrentUser();
                if (storedUser) {
                    setUser(storedUser);

                    // Optionally validate token with backend
                    try {
                        const freshUserData = await authService.getUserProfile();
                        // Update stored user data with fresh data
                        authService.updateStoredUserData(freshUserData);
                        setUser(freshUserData);
                    } catch (err) {
                        // If backend validation fails, log the user out
                        console.log('Token validation failed:', err);
                        await authService.logout();
                        setUser(null);
                    }
                }
            } catch (err) {
                console.log('Auth initialization error:', err);
                setError('Failed to initialize authentication');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        setError(null);
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Register function
    const register = async (userData) => {
        setError(null);
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.log('Logout error:', err);
            // Even if API logout fails, clear local state
            setUser(null);
            router.push('/login');
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        setError(null);
        try {
            // Call API to update profile (to be implemented in your API service)
            const updatedUser = await apiClient.put('/user', userData);

            // Update local state and storage
            setUser(updatedUser.data);
            authService.updateStoredUserData(updatedUser.data);

            return updatedUser.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}