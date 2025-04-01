import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { propertyService } from '../../services/api';
import { PlusIcon, HomeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function PropertiesList() {
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProperties() {
            try {
                setLoading(true);
                const { data } = await propertyService.getAllProperties();
                setProperties(data);
            } catch (err) {
                console.log('Failed to fetch properties:', err);
                setError('Failed to load properties. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchProperties();
    }, []);

    const getPropertyIcon = (type) => {
        return type.toLowerCase() === 'residential' ? HomeIcon : BuildingOffice2Icon;
    };

    return (
        <DashboardLayout>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                    <p className="mt-1 text-sm text-gray-500">A list of all the properties in your account</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/properties/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Property
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => {
                        const PropertyTypeIcon = getPropertyIcon(property.type);
                        return (
                            <div
                                key={property.id}
                                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-pointer transition-all hover:shadow-md"
                                onClick={() => router.push(`/properties/${property.id}`)}
                            >
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center whitespace-normal">
                                        <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                            <PropertyTypeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5">
                                            <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap">
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <span className="truncate">{property.address}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {property.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && properties.length === 0 && !error && (
                <div className="text-center py-12">
                    <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new property.</p>
                    <div className="mt-6">
                        <Link
                            href="/properties/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Add Property
                        </Link>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
