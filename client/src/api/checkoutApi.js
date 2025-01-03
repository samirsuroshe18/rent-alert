import axiosInstance from './config.js';

export const addCheckout = async (formData) => {
    try {
        const response = await axiosInstance.post(
            `/api/v1/checkout/submit`,
            formData,
            {withCredentials: true}
        );
        return response;
    } catch (error) {
        console.error('Error while api request:', error);
        throw error;
    }
};