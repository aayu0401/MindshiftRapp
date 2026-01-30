import { apiClient } from './client';

export interface AIGenerationRequest {
    ageGroup: string;
    category: string;
    therapeuticGoals: string[];
    customPrompt?: string;
    templateId?: string;
}

export interface AIGeneratedStory {
    id: string;
    title?: string;
    author: string;
    ageGroup: string;
    category: string;
    therapeuticGoals: string[];
    content?: any;
    status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'APPROVED' | 'REJECTED';
    reviewNotes?: string;
    createdAt: Date;
    generator: {
        name?: string;
        email: string;
    };
    template?: {
        name: string;
    };
}

export interface AIStoryTemplate {
    id: string;
    name: string;
    description: string;
    ageGroup: string;
    category: string;
    therapeuticGoals: string[];
    active: boolean;
}

/**
 * Generate a new story using AI
 */
export async function generateStory(request: AIGenerationRequest): Promise<{ generationId: string; message: string }> {
    const response = await apiClient.post('/api/ai/generate-story', request);
    return response.data;
}

/**
 * Get all AI story templates
 */
export async function fetchTemplates(): Promise<AIStoryTemplate[]> {
    const response = await apiClient.get<AIStoryTemplate[]>('/api/ai/templates');
    return response.data;
}

/**
 * Create a new AI story template (admin only)
 */
export async function createTemplate(data: any): Promise<AIStoryTemplate> {
    const response = await apiClient.post<AIStoryTemplate>('/api/ai/templates', data);
    return response.data;
}

/**
 * Get stories pending approval
 */
export async function fetchPendingApproval(): Promise<AIGeneratedStory[]> {
    const response = await apiClient.get<AIGeneratedStory[]>('/api/ai/pending-approval');
    return response.data;
}

/**
 * Approve and publish an AI-generated story
 */
export async function approveStory(storyId: string, reviewNotes?: string): Promise<{ message: string; story: any }> {
    const response = await apiClient.post(`/api/ai/approve/${storyId}`, { reviewNotes });
    return response.data;
}

/**
 * Reject an AI-generated story
 */
export async function rejectStory(storyId: string, reviewNotes: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/api/ai/reject/${storyId}`, { reviewNotes });
    return response.data;
}

// Alias for backward compatibility
export const generateAIStory = generateStory;
