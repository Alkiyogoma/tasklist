import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { utilityBillService } from '../../services/api';
import { EyeIcon, FireIcon, PlusIcon } from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

export default function UtilityBillsData() {
    const router = useRouter();
    const currentTypeKey = router.query.type || '';
    const seachKey = router.query.type || '';
    const currentPage = Number(router.query.page) || 1;

    const [utilityBills, setUtilityBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Add a state for the search term
    // const [searchTerm, setSearchTerm] = useState(seachKey);

    // Filtering and sorting state
    const [formData, setFormData] = useState({
        search: seachKey,
        type: currentTypeKey,
    });
    useEffect(() => {
        async function fetchUtilityBillsData() {
            try {
                setLoading(true);
                const { data: billsData } = await utilityBillService.getAllBills(currentPage);

                setUtilityBills(billsData.data);
                setTotalItems(billsData.total);
                setItemsPerPage(billsData.per_page);
            } catch (err) {
                console.log('Failed to fetch utility bills:', err);
                setError('Failed to load utility bills. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchUtilityBillsData();
    }, [currentPage]); // Added currentPage as dependency to refetch when page changes

    const formatNumberWithCommas = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Create a debounce function if not using lodash
    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Create the fetchData function that will be debounced
    const fetchData = async (newFormData) => {
        try {
            setLoading(true);
            const { data: billsData } = await utilityBillService.getAllBills(
                currentPage,
                newFormData.type,
                newFormData.search
            );

            setUtilityBills(billsData.data);
            setTotalItems(billsData.total);
            setItemsPerPage(billsData.per_page);
        } catch (err) {
            console.log('Failed to fetch utility bills:', err);
            setError('Failed to load utility bills. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Create a debounced version of fetchData
    const debouncedFetchData = debounce(fetchData, 1500);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        const newFormData = {
            ...formData,
            [name]: value,
        };

        setFormData(newFormData);

        // For search field, use debounced fetch
        if (name === 'search') {
            debouncedFetchData(newFormData);
        } else {
            // For other fields like 'type', fetch immediately
            fetchData(newFormData);
        }
    };

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
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Utility Bills</h3>
                        <Link
                            href="/utility-bills/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Add Bill
                        </Link>
                    </div>

                    {/* Filter and Search Controls */}
                    <div className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center">
                            <label htmlFor="filterType" className="mr-2 text-gray-700">Filter by bill type:</label>
                            <select
                                id="filterType"
                                name="type"
                                value={formData.type}
                                onChange={handleFilterChange}
                                className="p-2 border rounded bg-white"
                            >
                                <option value="">All</option>
                                <option value="water">Water</option>
                                <option value="electricity">Electricity</option>
                                <option value="gas">Gas</option>
                            </select>
                        </div>

                        <div className="flex items-center relative flex-1">
                            <FireIcon className="absolute left-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search utility bills..."
                                name="search"
                                value={formData.search}
                                onChange={handleFilterChange}
                                className="pl-10 p-2 border rounded w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        {utilityBills.length > 0 ? (
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
                                                    Type
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Amount
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Property
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Added By
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Date
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
                                            {utilityBills.map((bill, index) => {
                                                const typeColors = {
                                                    electricity: 'bg-yellow-100 text-yellow-800',
                                                    water: 'bg-blue-100 text-blue-800',
                                                    gas: 'bg-green-100 text-green-800',
                                                };

                                                // Calculate the index based on current page
                                                const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;

                                                return (
                                                    <tr key={bill.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {itemNumber}
                                                        </td>
                                                        <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[bill.type.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                                                                {bill.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm whitespace-nowrap text-gray-900">
                                                                TZS {formatNumberWithCommas(bill.amount)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                            {bill.property?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                            {bill.user?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(bill.bill_date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link href={`/utility-bills/${bill.uuid}`} className="inline-flex items-center text-sm text-gray-900 hover:text-gray-700">
                                                                <EyeIcon className="h-4 w-4 mr-1" /> View Bill
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
                                <p className="text-sm text-gray-500">No utility bills found.</p>
                                <div className="mt-4">
                                    <Link
                                        href="/utility-bills/new"
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