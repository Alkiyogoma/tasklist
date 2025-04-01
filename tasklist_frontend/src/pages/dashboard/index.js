
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
// import { propertyService, utilityBillService } from '../../services/api';
import { propertyService } from '../../services/api';
import {
    HomeIcon,
    BuildingOffice2Icon,
    BuildingLibraryIcon,
    CloudIcon,
    FireIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function Dashboard() {
    const [statistics, setStatistics] = useState({
        totalProperties: 0,
        residentialCount: 0,
        commercialCount: 0,
    });
    const [propertyData, setPropertyData] = useState([]);
    const [utilityCosts, setUtilityCosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true);

                // Fetch properties and utility bills
                const { data: dashboardData } = await propertyService.getDashboard();
                // Mock data processing that would typically happen server-side
                const properties = dashboardData.properties;
                const residentialCount = properties ? properties.filter(p => p.type === 'residential').length : 0;
                const commercialCount = properties ? properties.filter(p => p.type === 'commercial').length : 0;

                // fetching utility totals from API

                // const mockUtilityTotals = {
                //     electricityTotal: 1250.75,
                //     waterTotal: 750.20,
                //     gasTotal: 420.50,
                // };
                setUtilityCosts(dashboardData.costs);

                setStatistics({
                    totalProperties: dashboardData.properties.length,
                    residentialCount,
                    commercialCount,
                });

                // Data for property type pie chart
                setPropertyData([
                    { name: 'Residential', value: residentialCount },
                    { name: 'Commercial', value: commercialCount },
                ]);

            } catch (err) {
                console.log('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

    // Custom pie chart tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
                    <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };


    // Custom pie chart tooltip
    const getBillIcon = (name) => {
        if (name === 'gas') {
            return (
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <FireIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
            );
        } else if (name === 'water') {
            return (
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <CloudIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
            );
        }
        return (
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <LightBulbIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
            </div>
        );
    };

    const getPropertyIcon = (type) => {
        return type.toLowerCase() === 'residential' ? HomeIcon : BuildingLibraryIcon;
    };

    const formatNumberWithCommas = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Overview of your properties and utility bills</p>
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
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Total Properties */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                        <BuildingOffice2Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">{statistics.totalProperties}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link href="/properties" className="font-medium text-blue-600 hover:text-blue-500">
                                        View All Properties
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {propertyData.map((property) => {
                            const PropertyTypeIcon = getPropertyIcon(property.name);
                            return (
                                <div key={property.name} className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                                <PropertyTypeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">{property.name}</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">{property.value}</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <div className="text-sm">
                                            <Link href={`/properties?type=${property.name.toLowerCase()}`}
                                                className="font-medium text-blue-600 hover:text-blue-500">
                                                View {property.name}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Utility Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Electricity Total */}
                        {utilityCosts.map((cost) => {
                            return (
                                <div key={cost.name} className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            {getBillIcon(cost.name)}
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm capitalize font-bold text-gray-500  truncate">{cost.name} Bills</dt>
                                                    <dd>
                                                        <div className="text-md whitespace-nowrap font-medium text-gray-900">
                                                            TZS {formatNumberWithCommas(cost.value)}
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Utility Expenses Chart */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Utility Expenses</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={utilityCosts}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" className="capitalize" />
                                        <YAxis tickFormatter={(value) => `${value}`} />
                                        <Tooltip formatter={(value) => [`${value}`, 'Amount']} />
                                        <Legend />
                                        <Bar dataKey="value" name="Total Amount" className="capitalize" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Property Types Chart */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Types</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={propertyData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {propertyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}