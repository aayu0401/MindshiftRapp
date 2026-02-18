import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token
        const token = useAppStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Set loading state
        useAppStore.getState().setLoading(true);

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
    },
    (error) => {
        useAppStore.getState().setLoading(false);
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Clear loading state
        useAppStore.getState().setLoading(false);

        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.config.url}`, response.data);
        }

        return response;
    },
    async (error: AxiosError) => {
        // Clear loading state
        useAppStore.getState().setLoading(false);

        // Handle different error types
        if (error.response) {
            const status = error.response.status;
            const message = (error.response.data as any)?.message || 'An error occurred';

            switch (status) {
                case 401:
                    // Unauthorized
                    console.warn('Session expired or unauthorized. Using fallback if available.');
                    break;

                case 403:
                    toast.error('You don\'t have permission to perform this action.');
                    break;

                case 404:
                    toast.error('Resource not found.');
                    break;

                case 422:
                    toast.error(message || 'Validation error. Please check your input.');
                    break;

                case 429:
                    toast.error('Too many requests. Please try again later.');
                    break;

                case 500:
                    toast.error('Server error. Please try again later.');
                    break;

                default:
                    toast.error(message);
            }

            // Log error in development
            if (import.meta.env.DEV) {
                console.error(`❌ API Error: ${status}`, error.response.data);
            }
        } else if (error.request) {
            // Network error
            toast.error('Network error. Please check your connection.');
            console.error('❌ Network Error:', error.request);
        } else {
            // Other errors
            toast.error('An unexpected error occurred.');
            console.error('❌ Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API Methods with TypeScript support
export const api = {
    // GET request
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.get<T>(url, config);
    },

    // POST request
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.post<T>(url, data, config);
    },

    // PUT request
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.put<T>(url, data, config);
    },

    // PATCH request
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.patch<T>(url, data, config);
    },

    // DELETE request
    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return apiClient.delete<T>(url, config);
    },

    // Upload file
    upload: <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        });
    },
};

// Export the axios instance for advanced use cases
export { apiClient };
export default api;
