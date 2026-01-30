import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class APIClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Try to refresh token
                    try {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                            withCredentials: true,
                        });
                        this.setAccessToken(response.data.accessToken);

                        // Retry original request
                        if (error.config) {
                            error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                            return axios(error.config);
                        }
                    } catch (refreshError) {
                        // Refresh failed, clear token and redirect to login
                        this.clearAccessToken();
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    setAccessToken(token: string) {
        this.accessToken = token;
        localStorage.setItem('accessToken', token);
    }

    clearAccessToken() {
        this.accessToken = null;
        localStorage.removeItem('accessToken');
    }

    loadAccessToken() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            this.accessToken = token;
        }
    }

    get<T = any>(url: string, config?: any) {
        return this.client.get<T>(url, config);
    }

    post<T = any>(url: string, data?: any, config?: any) {
        return this.client.post<T>(url, data, config);
    }

    put<T = any>(url: string, data?: any, config?: any) {
        return this.client.put<T>(url, data, config);
    }

    delete<T = any>(url: string, config?: any) {
        return this.client.delete<T>(url, config);
    }
}

export const apiClient = new APIClient();

// Load token on initialization
apiClient.loadAccessToken();
