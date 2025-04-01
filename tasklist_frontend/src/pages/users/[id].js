// pages/profile/[uuid].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import DashboardLayout from '../../components/layout/DashboardLayout';
import { userService } from '../../services/api';

export default function UserProfile() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUserData() {
            try {
                setLoading(true);
                const { data: userData } = await userService.getUserById(id);
                setUser(userData);
            } catch (err) {
                console.log('Failed to fetch  users:', err);
                setError('Failed to load  users. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [id]);

    // Format date to be more readable
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-red-500 text-xl mb-4">{error}</h1>
                <Link href="/dashboard" className="text-blue-500 hover:underline">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    if (!user) return null;
    return (
        <DashboardLayout>
            <Head>
                <title>{user.name} | User Profile</title>
            </Head>
            <div className="max-w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">User Profile</h1>
                </div>

                <div className="p-6">
                    <div className="mb-8 flex items-center">
                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div className="ml-6">
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-gray-500">User ID: {user.id}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <dl className="divide-y divide-gray-200">
                            <div className="py-3 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{user.email}</dd>
                            </div>
                            <div className="py-3 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                    {user.email_verified_at ? (
                                        <span className="text-green-600">Verified on {formatDate(user.email_verified_at)}</span>
                                    ) : (
                                        <span className="text-red-600">Not verified</span>
                                    )}
                                </dd>
                            </div>
                            <div className="py-3 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">UUID</dt>
                                <dd className="text-sm text-gray-900 col-span-2 break-all">{user.uuid}</dd>
                            </div>
                            <div className="py-3 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{formatDate(user.created_at)}</dd>
                            </div>
                            <div className="py-3 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{formatDate(user.updated_at)}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-6 flex space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() => router.push(`/profile/edit/${user.uuid}`)}
                        >
                            Edit Profile
                        </button>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}