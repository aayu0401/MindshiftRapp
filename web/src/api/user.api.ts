import { apiClient } from './client';

export interface Child {
    id: string;
    name: string;
    email: string;
    age?: number;
    grade?: string;
    userAnalytics?: any;
    class?: string;
}

export const fetchChildren = async (): Promise<Child[]> => {
    try {
        const response = await apiClient.get<Child[]>('/user/children');
        return response.data;
    } catch (error) {
        console.warn('Using mock children data (backend unreachable)');
        return [
            {
                id: 'child-1',
                name: 'Emma Johnson',
                email: 'emma@demo.com',
                age: 10,
                grade: 'Year 5',
                class: '5A'
            },
            {
                id: 'child-2',
                name: 'Leo Smith',
                email: 'leo@demo.com',
                age: 8,
                grade: 'Year 3',
                class: '3B'
            }
        ];
    }
};
