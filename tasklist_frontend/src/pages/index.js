import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard on load
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <Head>
                <title>Property Management Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <h1 className="text-2xl font-semibold">Loading Dashboard...</h1>
                <div className="mt-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            </main>
        </div>
    );
}