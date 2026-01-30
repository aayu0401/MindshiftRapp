import { apiClient } from './client';

export interface Assessment {
    id: string;
    title: string;
    type: 'CBT' | 'PBCT' | 'SCREENING' | 'POST_STORY';
    description: string;
    ageGroup: string;
    storyId?: string;
    questions: AssessmentQuestion[];
    published: boolean;
}

export interface AssessmentQuestion {
    id: string;
    questionNumber: number;
    question: string;
    type: 'SCALE' | 'MULTIPLE_CHOICE';
    scaleMin?: number;
    scaleMax?: number;
    scaleMinLabel?: string;
    scaleMaxLabel?: string;
    options?: AssessmentQuestionOption[];
}

export interface AssessmentQuestionOption {
    id: string;
    optionText: string;
    orderIndex: number;
    scoreValue: number;
}

export interface AssessmentResult {
    id: string;
    userId: string;
    assessmentId: string;
    totalScore: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
    recommendations: string[];
    requiresScreening: boolean;
    createdAt: Date;
    assessment?: {
        id: string;
        title: string;
        type: string;
    };
}

export interface AssessmentFilters {
    type?: string;
    ageGroup?: string;
    storyId?: string;
    published?: boolean;
}

/**
 * Fetch all assessments with optional filters
 */
export async function fetchAssessments(filters?: AssessmentFilters): Promise<Assessment[]> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });
    }

    const response = await apiClient.get<Assessment[]>(`/api/assessments?${params.toString()}`);
    return response.data;
}

/**
 * Fetch a single assessment by ID
 */
export async function fetchAssessmentById(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.get<Assessment>(`/api/assessments/${assessmentId}`);
    return response.data;
}

/**
 * Submit assessment responses
 */
export async function submitAssessment(
    assessmentId: string,
    responses: Record<string, number>
): Promise<{ result: AssessmentResult; assessment: any }> {
    const response = await apiClient.post(`/api/assessments/${assessmentId}/submit`, {
        responses,
    });
    return response.data;
}

/**
 * Get assessment results for current user
 */
export async function fetchUserResults(assessmentId?: string): Promise<AssessmentResult[]> {
    const url = assessmentId
        ? `/api/assessments/${assessmentId}/results`
        : '/api/assessments/results/latest';
    const response = await apiClient.get<AssessmentResult[]>(url);
    return response.data;
}

/**
 * Get latest assessment result
 */
export async function fetchLatestResult(): Promise<AssessmentResult | null> {
    const response = await apiClient.get<AssessmentResult>('/api/assessments/results/latest');
    return response.data;
}

/**
 * Get assessments linked to a specific story
 */
export async function fetchStoryAssessments(storyId: string): Promise<Assessment[]> {
    const response = await apiClient.get<Assessment[]>(`/api/assessments/story/${storyId}`);
    return response.data;
}

/**
 * Get detailed assessment result by ID
 */
export async function fetchResultById(resultId: string): Promise<AssessmentResult> {
    const response = await apiClient.get<AssessmentResult>(`/api/assessments/result/${resultId}`);
    return response.data;
}

/**
 * Create a new assessment (teacher/admin only)
 */
export async function createAssessment(data: any): Promise<Assessment> {
    const response = await apiClient.post<Assessment>('/api/assessments', data);
    return response.data;
}
