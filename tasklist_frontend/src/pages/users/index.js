import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userService } from '../../services/api';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

export default function UsersData() {
    const router = useRouter();
    const currentPage = Number(router.query.page) || 1;

    const [staffUsers, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        async function fetchUsersData() {
            try {
                setLoading(true);
                const { data: usersData } = await userService.getAllUsers(currentPage);

                setUsers(usersData.data);
                setTotalItems(usersData.total);
                setItemsPerPage(usersData.per_page);
            } catch (err) {
                console.log('Failed to fetch utility users:', err);
                setError('Failed to load utility users. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchUsersData();
    }, [currentPage]); // Added currentPage as dependency to refetch when page changes

    return (
        <DashboardLayout>
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
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900"> Users</h3>
                        <Link
                            disabled="true"
                            href="/users/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Add User
                        </Link>
                    </div>
                    <div className="border-t border-gray-200">
                        {staffUsers.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    S/N
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Email
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Added date
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {staffUsers.map((bill, index) => {
                                                // Calculate the index based on current page
                                                const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;

                                                return (
                                                    <tr key={bill.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {itemNumber}
                                                        </td>
                                                        <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                            {bill.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {bill.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(bill.created_at).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link href={`/users/${bill.uuid}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                                                                <EyeIcon className="h-4 w-4 mr-1" /> View User
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-6 py-4">
                                    <Pagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        showPageNumbers={true}
                                        maxPageNumbers={5}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">No utility users found.</p>
                                <div className="mt-4">
                                    <Link
                                        href="/utility-users/new"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                        Add First Bill
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}