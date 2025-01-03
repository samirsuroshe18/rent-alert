import axiosInstance from './config.js';

export const loginUser = async (formData) => {
    try {
        const response = await axiosInstance.post(
            `/api/v1/tenant/login`,
            formData,
            {withCredentials: true}
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching customer files:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axiosInstance.get(`/api/v1/tenant/logout`, {
            withCredentials: true, // Include credentials for the request
        });
        return response.data;
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error; // Re-throw the error for higher-level handling
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get(`/api/v1/tenant/current-user`, {
            withCredentials: true, // Include credentials for the request
        });
        return response.data;
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error; // Re-throw the error for higher-level handling
    }
};



