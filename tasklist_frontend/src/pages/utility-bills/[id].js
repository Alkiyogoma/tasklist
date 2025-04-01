import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { utilityBillService } from '../../services/api';
import { ArrowLeftIcon, PencilIcon, TrashIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function SingleUtilityBill() {
    const router = useRouter();
    const { id } = router.query;

    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        async function fetchUtilityBill() {
            try {
                setLoading(true);
                const { data } = await utilityBillService.getBillsById(id);
                setBill(data);
            } catch (err) {
                console.log('Failed to fetch utility bill:', err);
                setError('Failed to load utility bill details. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchUtilityBill();
    }, [id]);

    const getBillTypeColor = (type) => {
        const typeColors = {
            electricity: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            water: 'bg-blue-100 text-blue-800 border-blue-200',
            gas: 'bg-green-100 text-green-800 border-green-200',
        };
        return typeColors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (error) {
            return `Invalid date ${error}`;
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this utility bill?')) {
            try {
                await utilityBillService.deleteBill(id);
                router.push('/utility-bills');
            } catch (error) {
                console.log('Failed to delete utility bill:', error);
                alert('Failed to delete utility bill. Please try again later.');
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href="/utility-bills" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Utility Bills
                </Link>
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
            ) : bill ? (
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Utility Bill Details</h3>
                        <div className="flex space-x-2 print:hidden">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PrinterIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                                Print
                            </button>
                            <Link
                                href={`/utility-bills/edit/${bill.id}`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200">
                        <div className="max-w-3xl mx-auto px-4 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="col-span-1 md:col-span-2 mb-2">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getBillTypeColor(bill.type)}`}>
                                        {bill.type.charAt(0).toUpperCase() + bill.type.slice(1)} Bill
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Bill ID</h4>
                                    <p className="mt-1 text-sm text-gray-900">{bill.uuid}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                                    <p className="mt-1 text-sm text-gray-900 font-semibold">TZS {parseFloat(bill.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Bill Date</h4>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(bill.bill_date)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Created On</h4>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(bill.created_at)}</p>
                                </div>

                                <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                                    <h4 className="text-sm font-medium text-gray-500">Property Details</h4>
                                    <div className="mt-2 bg-gray-50 p-4 rounded-md">
                                        <h5 className="text-sm font-medium text-gray-900">{bill.property.name}</h5>
                                        <p className="mt-1 text-sm text-gray-500">{bill.property.address}</p>
                                        <p className="mt-1 text-xs text-gray-500 capitalize">Type: {bill.property.type}</p>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-medium text-gray-500">Added By</h4>
                                    <div className="mt-2 flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 font-medium">{bill.user.name.charAt(0)}</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{bill.user.name}</p>
                                            <p className="text-sm text-gray-500">{bill.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-sm text-gray-500">Utility bill not found.</p>
                </div>
            )}
        </DashboardLayout>
    );
}
