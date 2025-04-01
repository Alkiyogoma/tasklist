import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { propertyService, utilityBillService } from '../../services/api';
import { PlusIcon, EyeIcon, ArrowLeftIcon, HomeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import ConsumptionChart from '../../components/ConsumptionChart';

export default function PropertyDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [property, setProperty] = useState(null);
    const [utilityBills, setUtilityBills] = useState([]);
    const [utilityType, setUtilityType] = useState('all');
    const [consumptionData, setConsumptionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        async function fetchPropertyDetails() {
            try {
                setLoading(true);
                const { data: propertyData } = await propertyService.getPropertyById(id);
                setProperty(propertyData);

                const { data: billsData } = await utilityBillService.getBillsByPropertyId(id);
                setUtilityBills(billsData);

                const response = await utilityBillService.getConsumptionHistory(id, 'all');
                console.log('Consumption API response:', response);

                // Extract the consumption array from the response
                const consumptionHistory = response.data?.consumption || [];
                console.log('Extracted consumption data:', consumptionHistory);

                setConsumptionData(consumptionHistory);
            } catch (err) {
                console.log('Failed to fetch property details:', err);
                setError('Failed to load property details. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchPropertyDetails();
    }, [id]);

    const handleUtilityTypeChange = async (type) => {
        try {
            setUtilityType(type);
            const response = await utilityBillService.getConsumptionHistory(id, type);

            // Extract the consumption array from the response
            const consumptionHistory = response.data?.consumption || [];
            setConsumptionData(consumptionHistory);
        } catch (err) {
            console.log('Failed to fetch consumption data:', err);
        }
    };

    const PropertyTypeIcon = property?.type?.toLowerCase() === 'residential' ? HomeIcon : BuildingOffice2Icon;

    // Debug consumption data
    useEffect(() => {
        console.log('Current consumption data state:', consumptionData);
        if (Array.isArray(consumptionData) && consumptionData.length > 0) {
            console.log('First consumption data item:', consumptionData[0]);
        }
    }, [consumptionData]);

    const formatNumberWithCommas = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href="/properties" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Properties
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
            ) : property ? (
                <>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="mr-4 bg-indigo-100 rounded-md p-3">
                                    <PropertyTypeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{property.name}</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{property.address}</p>
                                </div>
                            </div>
                            <span className="inline-flex capitalize items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {property.type}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="sm:flex sm:items-center sm:justify-between mb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Consumption History</h3>
                                <div className="mt-3 sm:mt-0">
                                    <div className="inline-flex rounded-md shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleUtilityTypeChange('all')}
                                            className={`${utilityType === 'all'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            All
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUtilityTypeChange('electricity')}
                                            className={`${utilityType === 'electricity'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            Electricity
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUtilityTypeChange('water')}
                                            className={`${utilityType === 'water'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            Water
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUtilityTypeChange('gas')}
                                            className={`${utilityType === 'gas'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                                        >
                                            Gas
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="h-72">
                                {Array.isArray(consumptionData) && consumptionData.length > 0 ? (
                                    <ConsumptionChart data={consumptionData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-gray-500">No consumption data available for this property.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Utility Bills</h3>
                            <Link
                                href={`/utility-bills/new?propertyId=${property.id}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Add Bill
                            </Link>
                        </div>
                        <div className="border-t border-gray-200">
                            {utilityBills.length > 0 ? (
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
                                            {utilityBills.map((bill, bIndex) => {
                                                const typeColors = {
                                                    electricity: 'bg-yellow-100 text-yellow-800',
                                                    water: 'bg-blue-100 text-blue-800',
                                                    gas: 'bg-green-100 text-green-800',
                                                };

                                                return (
                                                    <tr key={bill.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {bIndex + 1}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 capitalize whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[bill.type.toLowerCase()]}`}>
                                                                {bill.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                TZS {formatNumberWithCommas(bill.amount)}
                                                            </div>
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
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-500">No utility bills found for this property.</p>
                                    <div className="mt-4">
                                        <Link
                                            href={`/utility-bills/new?propertyId=${property.id}`}
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
                </>
            ) : null}
        </DashboardLayout>
    );
}