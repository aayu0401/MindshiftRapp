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
 * Get the URL for streaming story generation
 */
export function getStoryStreamUrl(request: AIGenerationRequest): string {
    const params = new URLSearchParams({
        ageGroup: request.ageGroup,
        category: request.category,
        therapeuticGoals: request.therapeuticGoals.join(','),
        customPrompt: request.customPrompt || '',
        templateId: request.templateId || ''
    });

    // Get the base API URL (handling Vite proxy vs direct)
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    // Get token from storage (a bit of a hack since we are outside React context/hook)
    const token = localStorage.getItem('accessToken');

    if (token) {
        params.append('token', token);
    }

    return `${baseUrl}/api/ai/stream-story?${params.toString()}`;
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

/**
 * General purpose conversational chat with AI
 */
export async function chatWithAI(message: string, history: any[] = []): Promise<string> {
    const response = await apiClient.post<{ reply: string }>('/api/ai/chat', { message, history });
    return response.data.reply;
}

// Alias for backward compatibility
export const generateAIStory = generateStory;
