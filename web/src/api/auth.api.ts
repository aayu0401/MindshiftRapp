import { apiClient } from './client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name?: string;
    role?: 'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN' | 'PARENT';
    age?: number;
    grade?: string;
    schoolId?: string;
}

export interface AuthResponse {
    accessToken: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN' | 'PARENT';
    age?: number;
    grade?: string;
    schoolId?: string;
}

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    apiClient.setAccessToken(response.data.accessToken);
    return response.data;
}

/**
 * Signup new user
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    apiClient.setAccessToken(response.data.accessToken);
    return response.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearAccessToken();
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    apiClient.setAccessToken(response.data.accessToken);
    return response.data;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/user/me');
    return response.data;
}
