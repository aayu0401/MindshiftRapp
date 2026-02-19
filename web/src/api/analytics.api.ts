import { apiClient } from './client';

export interface UserAnalytics {
    id: string;
    userId: string;
    totalTimeSpent: number;
    storiesStarted: number;
    storiesCompleted: number;
    assessmentsCompleted: number;
    currentRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | null;
    lastAssessmentDate: string | null;
    lastActiveDate: string | null;
    streakDays: number;
    points: number;
}

const mockAnalytics: UserAnalytics = {
    id: 'mock-analytics-1',
    userId: 'demo-user-id',
    totalTimeSpent: 145,
    storiesStarted: 8,
    storiesCompleted: 5,
    assessmentsCompleted: 3,
    currentRiskLevel: 'LOW',
    lastAssessmentDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastActiveDate: new Date().toISOString(),
    streakDays: 5,
    points: 750
};

export const fetchMyAnalytics = async (): Promise<UserAnalytics> => {
    try {
        const response = await apiClient.get<UserAnalytics>('/api/analytics/me');
        return response.data;
    } catch (error) {
        console.warn('Using mock analytics data (backend unreachable)');
        return mockAnalytics;
    }
};

export const fetchUserAnalytics = async (userId: string): Promise<UserAnalytics> => {
    try {
        const response = await apiClient.get<UserAnalytics>(`/api/analytics/user/${userId}`);
        return response.data;
    } catch (error) {
        return mockAnalytics;
    }
};

export const fetchStudentReport = async (userId: string): Promise<any> => {
    try {
        const response = await apiClient.get<any>(`/api/analytics/report/${userId}`);
        return response.data;
    } catch (error) {
        return {
            analytics: mockAnalytics,
            recommendations: [
                'Continue exploring emotional awareness stories',
                'Practice the breathing exercise daily',
                'Share reflections with a trusted adult'
            ],
            storyProgress: {
                total: 8,
                completed: 5,
                details: []
            }
        };
    }
};

export const trackEngagement = async (activityType: 'story' | 'assessment', durationMinutes: number) => {
    try {
        const response = await apiClient.post('/api/analytics/track-engagement', {
            activityType,
            durationMinutes
        });
        return response.data;
    } catch (error) {
        return { success: true, message: 'Activity tracked (mock)' };
    }
};

export const fetchClassAnalytics = async (classId?: string): Promise<any> => {
    try {
        const params = classId ? { classId } : {};
        const response = await apiClient.get<any>('/api/analytics/class', { params });
        return response.data;
    } catch (error) {
        return {
            averageEngagement: 85,
            completionRate: 72,
            riskDistribution: { LOW: 18, MODERATE: 4, HIGH: 1 }
        };
    }
};

export const fetchHighRiskStudents = async (): Promise<any[]> => {
    try {
        const response = await apiClient.get<any[]>('/api/analytics/high-risk');
        return response.data;
    } catch (error) {
        return [];
    }
};
