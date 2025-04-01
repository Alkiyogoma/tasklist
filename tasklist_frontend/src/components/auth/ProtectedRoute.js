// components/auth/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

// Pages that can be accessed without authentication
const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check if route requires authentication
        const isPublicPage = publicPages.includes(router.pathname);

        if (!loading) {
            if (!isAuthenticated && !isPublicPage) {
                // If not authenticated and not on a public page, redirect to login
                router.push({
                    pathname: '/login',
                    query: { returnUrl: router.asPath }
                });
            } else if (isAuthenticated && isPublicPage) {
                // If authenticated and on a public page (like login), redirect to dashboard
                router.push('/dashboard');
            } else {
                // Otherwise, route is authorized
                setAuthorized(true);
            }
        }
    }, [isAuthenticated, loading, router]);

    // Show loading indicator while checking authentication status
    if (loading || !authorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // If authorized, render children
    return children;
}

export default ProtectedRoute;