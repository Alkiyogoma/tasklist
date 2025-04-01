import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { propertyService } from '../../services/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AddProperty() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        type: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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

        if (!formData.name.trim()) {
            newErrors.name = 'Property name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Property address is required';
        }

        if (!['residential', 'commercial'].includes(formData.type)) {
            newErrors.type = 'Property type must be either residential or commercial';
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

            await propertyService.createProperty(formData);
            router.push('/properties');
        } catch (err) {
            console.log('Failed to create property:', err);
            setSubmitError(
                err.response?.data?.message || 'Failed to create property. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href="/properties" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Properties
                </Link>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Property</h3>
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Property Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''
                                            }`}
                                        placeholder="e.g., Downtown Office"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`shadow-sm focus:ring-indigo-500 p-3 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.address ? 'border-red-300' : ''
                                            }`}
                                        placeholder="e.g., 123 Kongo St, Msimbazi Center"
                                    />
                                    {errors.address && (
                                        <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Property Type
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
                                        <option value="">Select a property type</option>
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    href="/properties"
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}