import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with proper configuration for Sanctum
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',  // Required for Sanctum
    },
    withCredentials: true,  // Required for Sanctum to send cookies with requests
});

// Fetch token to automatically include the CSRF token
apiClient.interceptors.request.use(config => {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

// Property services
export const propertyService = {
    // Get  dashboard summary
    getDashboard: async () => {
        const response = await apiClient.get('/properties/dashboard');
        return response.data;
    },
    // Get all properties
    getAllProperties: async () => {
        const response = await apiClient.get('/properties');
        return response.data;
    },

    // Get a single property by ID
    getPropertyById: async (id) => {
        const response = await apiClient.get(`/properties/${id}`);
        return response.data;
    },

    // Create a new property
    createProperty: async (propertyData) => {
        const response = await apiClient.post('/properties', propertyData);
        return response.data;
    },

    // Update a property
    updateProperty: async (id, propertyData) => {
        const response = await apiClient.put(`/properties/${id}`, propertyData);
        return response.data;
    },

    // Delete a property
    deleteProperty: async (id) => {
        const response = await apiClient.delete(`/properties/${id}`);
        return response.data;
    }
};

// Utility Bill services
export const utilityBillService = {
    // Get all utility bills
    getAllBills: async (pageNumber, keyType = '', seachKey = '') => {
        const response = await apiClient.get(`/utility-bills?page=${pageNumber}&type=${keyType}&search=${seachKey}`);
        return response.data;
    },

    // Get utility bills for a specific property
    getBillsByPropertyId: async (propertyId) => {
        const response = await apiClient.get(`/properties/${propertyId}/utility-bills`);
        return response.data;
    },

    // Get utility bills for a specific Id
    getBillsById: async (billId) => {
        const response = await apiClient.get(`/utility-bills/${billId}`);
        return response.data;
    },

    // Create a new utility bill
    createBill: async (billData) => {
        const response = await apiClient.post('/utility-bills', billData);
        return response.data;
    },

    // Update a utility bill
    updateBill: async (id, billData) => {
        const response = await apiClient.put(`/utility-bills/${id}`, billData);
        return response.data;
    },

    // Delete a utility bill
    deleteBill: async (id) => {
        const response = await apiClient.delete(`/utility-bills/${id}`);
        return response.data;
    },

    async getConsumptionHistory(propertyId, utilityType = 'all', period = 'monthly') {
        try {

            const { data: response } = await apiClient.get(`/properties/${propertyId}/consumption-history`, {
                params: { utilityType, period }
            });
            console.log('API consumption response:', response);

            // Return the full response in a format
            return {
                data: response?.data,
                stats: response?.stats || {},
                meta: response?.meta || {}
            };

        } catch (error) {
            console.log('Error fetching consumption data:', error);
            throw error;
        }
    }
};


// User services
export const userService = {

    // Get all users
    getAllUsers: async () => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    // Get a single user by ID
    getUserById: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    // Create a new user
    createUser: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },

    // Update a user
    updateUser: async (id, userData) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },

    // Delete a user
    deleteUser: async (id) => {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    }
};


export default apiClient;