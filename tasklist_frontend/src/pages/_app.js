import axios from 'axios';
import { useEffect } from 'react';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import '../styles/globals.css';

function MyApp({ Component, pageProps, router }) {
    // Set up axios to include credentials with every request
    useEffect(() => {
        // Configure axios for cross-domain CSRF requests
        const setupAxios = async () => {
            axios.defaults.withCredentials = true;
        };
        setupAxios();
    }, []);

    // Check if the current page needs protection
    const isPublicPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(
        router.pathname
    );

    return (
        <AuthProvider>
            <Head>
                <title>Property Management Dashboard</title>
                <meta name="description" content="Manage your properties and utility bills" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
            </Head>

            {isPublicPage ? (
                <Component {...pageProps} />
            ) : (
                <ProtectedRoute>
                    <Component {...pageProps} />
                </ProtectedRoute>
            )}
        </AuthProvider>
    );
}

export default MyApp;