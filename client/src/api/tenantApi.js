import axiosInstance from './config.js';

export const addTenant = async (formData) => {
    try {
        const response = await axiosInstance.post(
            `/api/v1/tenant/add-tenant`,
            formData,
            {withCredentials: true}
        );
        return response;
    } catch (error) {
        console.error('Error while api request:', error);
        throw error;
    }
};

export const editTenant = async (formData) => {
    try {
        const response = await axiosInstance.put(
            `/api/v1/tenant/edit-tenants`,
            formData,
            {withCredentials: true}
        );
        return response;
    } catch (error) {
        console.error('Error while api request:', error);
        throw error;
    }
};

export const deleteTenant = async (formData) => {
    try {
        const response = await axiosInstance.post(
            `/api/v1/tenant/delete-tenants`,
            formData,
            {withCredentials: true}
        );
        return response;
    } catch (error) {
        console.error('Error while api request:', error);
        throw error;
    }
};

export const sendAlert = async (formData) => {
    try {
        const response = await axiosInstance.post(
            `/api/v1/tenant/send-alert`,
            formData,
            {withCredentials: true}
        );
        return response;
    } catch (error) {
        console.error('Error while api request:', error);
        throw error;
    }
};



