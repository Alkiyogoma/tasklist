'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, EyeIcon, PlusIcon, ArrowRightIcon, FireIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { propertyService } from '../../services/api';

export default function PropertiesPage() {
    const router = useRouter();
    const currentType = router.query.type || 'all';

    // State for properties data
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Filtering and sorting state
    const [filterType, setFilterType] = useState(currentType);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    // Fetch properties data from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const { data } = await propertyService.getAllProperties();
                setProperties(data);
            } catch (err) {
                setError('Failed to load properties');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Apply filters and sorting to the data
    const filteredProperties = properties.filter(property => {
        const matchesType = filterType === 'all' || property.type === filterType;
        const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Sort the filtered properties
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortDirection === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        return sortDirection === 'asc'
            ? (valueA > valueB ? 1 : -1)
            : (valueA < valueB ? 1 : -1);
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProperties = sortedProperties.slice(startIndex, startIndex + itemsPerPage);

    // Handle sort toggle
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };


    return (
        <DashboardLayout>

            {loading ? (
                <div className="flex justify-center py-4">
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
                <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto  py-4">
                        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h1 className="text-2xl font-bold text-gray-800">Properties List</h1>

                                <Link
                                    href="/properties/new"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                    Add Property
                                </Link>
                            </div>

                            {/* Filter and Search Controls */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center">
                                    <label htmlFor="filterType" className="mr-2 text-gray-700">Filter by type:</label>
                                    <select
                                        id="filterType"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="p-2 border rounded bg-white"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>

                                <div className="flex items-center relative flex-1">
                                    <FireIcon className="absolute left-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search properties..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 p-2 border rounded w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('id')}
                                            >
                                                <div className="flex items-center">
                                                    ID
                                                    <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center">
                                                    Name
                                                    <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('address')}
                                            >
                                                <div className="flex items-center">
                                                    Address
                                                    <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('type')}
                                            >
                                                <div className="flex items-center">
                                                    Type
                                                    <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                <div className="flex items-center">
                                                    Created
                                                    <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedProperties.length > 0 ? (
                                            paginatedProperties.map((property) => (
                                                <tr key={property.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {property.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {property.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {property.address}
                                                    </td>
                                                    <td className="px-6 py-4 capitalize whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.type === 'residential' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {property.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(property.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={`/properties/${property.id}`} className="inline-flex items-center text-sm text-gray-900 hover:text-gray-700">
                                                            <EyeIcon className="h-4 w-4 mr-1" /> View
                                                        </Link>

                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <p className="mb-2">No properties found</p>
                                                        {searchQuery || filterType !== 'all' ? (
                                                            <button
                                                                onClick={() => {
                                                                    setSearchQuery('');
                                                                    setFilterType('all');
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                Clear filters
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <div className="flex items-center">
                                        <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">Show:</label>
                                        <select
                                            id="itemsPerPage"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1); // Reset to first page when changing items per page
                                            }}
                                            className="p-2 border rounded"
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                        </select>
                                    </div>

                                    <span className="text-sm text-gray-500">
                                        Showing {sortedProperties.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, sortedProperties.length)} of {sortedProperties.length} properties
                                    </span>
                                </div>

                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeftIcon className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        // Show pages around current page
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    } rounded border flex items-center justify-center`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowRightIcon className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}