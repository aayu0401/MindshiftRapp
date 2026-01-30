import { apiClient } from './client';

export interface UserAnalytics {
    id: string;
    userId: string;
    storiesStarted: number;
    storiesCompleted: number;
    assessmentsCompleted: number;
    lastAssessmentDate?: Date;
    currentRiskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
    highRiskCount: number;
    moderateRiskCount: number;
    lowRiskCount: number;
    lastActiveDate?: Date;
    totalTimeSpent: number;
    recentResults?: any[];
    storyProgress?: any[];
}

export interface ClassAnalytics {
    totalStudents: number;
    activeStudents: number;
    highRiskStudents: number;
    moderateRiskStudents: number;
    averageCompletionRate: number;
    averageEngagementScore: number;
    highRiskStudentDetails: any[];
    riskDistribution: {
        low: number;
        moderate: number;
        high: number;
    };
    assessmentResults: any[];
}

export interface SchoolAnalytics {
    totalStudents: number;
    totalTeachers: number;
    activeStudents: number;
    totalStoriesCompleted: number;
    totalAssessmentsCompleted: number;
    riskBreakdown: {
        high: number;
        moderate: number;
        low: number;
        notAssessed: number;
    };
    engagementRate: number;
    averageStoriesPerStudent: number;
    averageAssessmentsPerStudent: number;
    recentActivity: any[];
}

export interface StudentReport {
    student: {
        name?: string;
        email: string;
        grade?: string;
        age?: number;
    };
    analytics: UserAnalytics;
    storyProgress: {
        total: number;
        completed: number;
        inProgress: number;
        details: any[];
    };
    assessments: {
        total: number;
        riskLevelTrend: any[];
        currentRiskLevel?: string;
        lastAssessmentDate?: Date;
    };
    recommendations: string[];
}

/**
 * Get analytics for current user
 */
export async function fetchMyAnalytics(): Promise<UserAnalytics> {
    const response = await apiClient.get<UserAnalytics>('/api/analytics/me');
    return response.data;
}

/**
 * Get analytics for a specific user
 */
export async function fetchUserAnalytics(userId: string): Promise<UserAnalytics> {
    const response = await apiClient.get<UserAnalytics>(`/api/analytics/user/${userId}`);
    return response.data;
}

/**
 * Get class-wide analytics (teacher only)
 */
export async function fetchClassAnalytics(classId?: string): Promise<ClassAnalytics> {
    const params = classId ? `?classId=${classId}` : '';
    const response = await apiClient.get<ClassAnalytics>(`/api/analytics/class${params}`);
    return response.data;
}

/**
 * Get school-wide analytics (admin only)
 */
export async function fetchSchoolAnalytics(): Promise<SchoolAnalytics> {
    const response = await apiClient.get<SchoolAnalytics>('/api/analytics/school');
    return response.data;
}

/**
 * Get high-risk students (teacher/admin only)
 */
export async function fetchHighRiskStudents(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/api/analytics/high-risk');
    return response.data;
}

/**
 * Generate comprehensive progress report for a student
 */
export async function generateStudentReport(userId: string): Promise<StudentReport> {
    const response = await apiClient.get<StudentReport>(`/api/analytics/report/${userId}`);
    return response.data;
}

/**
 * Track user engagement
 */
export async function trackEngagement(
    activityType: 'story' | 'assessment',
    durationMinutes: number
): Promise<void> {
    await apiClient.post('/api/analytics/track-engagement', {
        activityType,
        durationMinutes,
    });
}
