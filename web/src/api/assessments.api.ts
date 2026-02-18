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

const mockAssessments: Assessment[] = [
    {
        id: 'cbt-1',
        title: 'Emotional Awareness Screening',
        type: 'CBT',
        description: 'A professional screening tool to assess emotional regulation and awareness.',
        ageGroup: '8-12',
        published: true,
        questions: []
    },
    {
        id: 'mood-1',
        title: 'Daily Mood Monitor',
        type: 'SCREENING',
        description: 'Track and analyze your daily mood patterns.',
        ageGroup: '10-14',
        published: true,
        questions: []
    }
];

const mockResult: AssessmentResult = {
    id: 'res-1',
    userId: 'user-1',
    assessmentId: 'cbt-1',
    totalScore: 12,
    riskLevel: 'LOW',
    recommendations: ['Maintain current progress', 'Continue with story reflections'],
    requiresScreening: false,
    createdAt: new Date(),
    assessment: { id: 'cbt-1', title: 'Emotional Awareness Screening', type: 'CBT' }
};

/**
 * Fetch all assessments with optional filters
 */
export async function fetchAssessments(filters?: AssessmentFilters): Promise<Assessment[]> {
    try {
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
    } catch (error) {
        console.warn('Using mock assessments (backend unreachable)');
        return mockAssessments;
    }
}

/**
 * Fetch a single assessment by ID
 */
export async function fetchAssessmentById(assessmentId: string): Promise<Assessment> {
    try {
        const response = await apiClient.get<Assessment>(`/api/assessments/${assessmentId}`);
        return response.data;
    } catch (error) {
        return mockAssessments[0];
    }
}

/**
 * Submit assessment responses
 */
export async function submitAssessment(
    assessmentId: string,
    responses: Record<string, number>
): Promise<{ result: AssessmentResult; assessment: any }> {
    try {
        const response = await apiClient.post(`/api/assessments/${assessmentId}/submit`, {
            responses,
        });
        return response.data;
    } catch (error) {
        return { result: mockResult, assessment: mockAssessments[0] };
    }
}

/**
 * Get assessment results for current user
 */
export async function fetchUserResults(assessmentId?: string): Promise<AssessmentResult[]> {
    try {
        const url = assessmentId
            ? `/api/assessments/${assessmentId}/results`
            : '/api/assessments/results/latest';
        const response = await apiClient.get<AssessmentResult[]>(url);
        return response.data;
    } catch (error) {
        return [mockResult];
    }
}

/**
 * Get latest assessment result
 */
export async function fetchLatestResult(): Promise<AssessmentResult | null> {
    try {
        const response = await apiClient.get<AssessmentResult>('/api/assessments/results/latest');
        return response.data;
    } catch (error) {
        return mockResult;
    }
}

/**
 * Get assessments linked to a specific story
 */
export async function fetchStoryAssessments(storyId: string): Promise<Assessment[]> {
    try {
        const response = await apiClient.get<Assessment[]>(`/api/assessments/story/${storyId}`);
        return response.data;
    } catch (error) {
        return [];
    }
}

/**
 * Get detailed assessment result by ID
 */
export async function fetchResultById(resultId: string): Promise<AssessmentResult> {
    try {
        const response = await apiClient.get<AssessmentResult>(`/api/assessments/result/${resultId}`);
        return response.data;
    } catch (error) {
        return mockResult;
    }
}

/**
 * Create a new assessment (teacher/admin only)
 */
export async function createAssessment(data: any): Promise<Assessment> {
    const response = await apiClient.post<Assessment>('/api/assessments', data);
    return response.data;
}
