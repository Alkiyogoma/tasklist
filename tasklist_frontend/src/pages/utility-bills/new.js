import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { propertyService, utilityBillService } from '../../services/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

export default function AddUtilityBill() {
    const router = useRouter();
    const { user } = useAuth();

    const { propertyId } = router.query;

    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState({
        user_id: user.id || 0,
        property_id: propertyId || '',
        type: '',
        amount: '',
        bill_date: new Date().toISOString().split('T')[0], // Set default to today's date
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
            try {
                setLoading(true);
                const { data } = await propertyService.getAllProperties();
                setProperties(data);

                // If propertyId was passed in query and it matches an existing property, select it
                if (propertyId && data.some(prop => prop.id.toString() === propertyId)) {
                    setFormData(prev => ({
                        ...prev,
                        property_id: propertyId
                    }));
                }
            } catch (err) {
                console.log('Failed to fetch properties:', err);
                setSubmitError('Failed to load properties. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchProperties();
    }, [propertyId]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Convert amount to number for validation
        const parsedValue = type === 'number' ? parseFloat(value) : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.property_id) {
            newErrors.property_id = 'Please select a property';
        }

        if (!['electricity', 'water', 'gas'].includes(formData.type)) {
            newErrors.type = 'Please select a valid utility type';
        }

        if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount (greater than 0)';
        }

        if (!formData.bill_date) {
            newErrors.bill_date = 'Please select a date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            await utilityBillService.createBill(formData);

            // Redirect back to the property details page
            router.push(`/properties/${formData.property_id}`);
        } catch (err) {
            console.log('Failed to create utility bill:', err);
            setSubmitError(
                err.response?.data?.message || 'Failed to create utility bill. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const backUrl = propertyId
        ? `/properties/${propertyId}`
        : '/utility-bills';

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href={backUrl} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    {propertyId ? 'Back to Property Details' : 'Back to Utilities'}
                </Link>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Utility Bill</h3>
                    <div className="mt-5">
                        {submitError && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{submitError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700">
                                        Property
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="propertyId"
                                            name="property_id"
                                            value={formData.property_id}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.propertyId ? 'border-red-300' : ''
                                                }`}
                                            disabled={Boolean(propertyId)}
                                        >
                                            <option value="">Select a property</option>
                                            {properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.name} ({property.address})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.propertyId && (
                                            <p className="mt-2 text-sm text-red-600">{errors.propertyId}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                        Utility Type
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.type ? 'border-red-300' : ''
                                                }`}
                                        >
                                            <option value="">Select a utility type</option>
                                            <option value="electricity">Electricity</option>
                                            <option value="water">Water</option>
                                            <option value="gas">Gas</option>
                                        </select>
                                        {errors.type && (
                                            <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                        Amount (TZS)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            id="amount"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            step="1"
                                            min="0"
                                            className={`shadow-sm focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.amount ? 'border-red-300' : ''
                                                }`}
                                            placeholder="0.00"
                                        />
                                        {errors.amount && (
                                            <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="date"
                                            id="date"
                                            name="bill_date"
                                            value={formData.bill_date}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.date ? 'border-red-300' : ''
                                                }`}
                                        />
                                        {errors.bill_date && (
                                            <p className="mt-2 text-sm text-red-600">{errors.bill_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Link
                                        href={backUrl}
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Bill'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}