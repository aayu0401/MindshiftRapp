import { apiClient } from './client';

export interface Story {
    id: string;
    title: string;
    author: string;
    excerpt: string;
    description?: string;
    category: string;
    ageGroup: string;
    therapeuticGoals: string[];
    imageUrl?: string;
    estimatedReadingTime?: number;
    published: boolean;
    featured: boolean;
    chapters?: StoryChapter[];
    assessments?: any[];
    userProgress?: StoryProgress | null;
}

export interface StoryChapter {
    id: string;
    chapterNumber: number;
    title: string;
    sections: StorySection[];
}

export interface StorySection {
    id: string;
    sectionNumber: number;
    type: 'TEXT' | 'QUESTION' | 'REFLECTION' | 'ACTIVITY';
    content: string;
    question?: StoryQuestion;
}

export interface StoryQuestion {
    id: string;
    question: string;
    type: string;
    therapeuticPurpose?: string;
    options?: StoryQuestionOption[];
}

export interface StoryQuestionOption {
    id: string;
    optionText: string;
    orderIndex: number;
}

export interface StoryProgress {
    id: string;
    currentChapter: number;
    currentSection: number;
    completed: boolean;
    completedAt?: Date;
    lastReadAt: Date;
}

export interface StoryFilters {
    category?: string;
    ageGroup?: string;
    therapeuticGoal?: string;
    published?: boolean;
    featured?: boolean;
    search?: string;
}

/**
 * Fetch all stories with optional filters
 */
export async function fetchStories(filters?: StoryFilters): Promise<Story[]> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });
    }

    const response = await apiClient.get<Story[]>(`/api/stories?${params.toString()}`);
    return response.data;
}

/**
 * Fetch a single story by ID
 */
export async function fetchStoryById(storyId: string, userId?: string): Promise<Story> {
    const params = userId ? `?userId=${userId}` : '';
    const response = await apiClient.get<Story>(`/api/stories/${storyId}${params}`);
    return response.data;
}

/**
 * Update reading progress for a story
 */
export async function updateStoryProgress(
    storyId: string,
    currentChapter: number,
    currentSection: number,
    completed: boolean = false
): Promise<StoryProgress> {
    const response = await apiClient.post<StoryProgress>(`/api/stories/${storyId}/progress`, {
        currentChapter,
        currentSection,
        completed,
    });
    return response.data;
}

/**
 * Submit a response to a story question
 */
export async function submitQuestionResponse(
    storyId: string,
    questionId: string,
    response: {
        selectedOptionId?: string;
        scaleValue?: number;
        textResponse?: string;
    }
): Promise<any> {
    const result = await apiClient.post(
        `/api/stories/${storyId}/questions/${questionId}/response`,
        response
    );
    return result.data;
}

/**
 * Get user's responses to story questions
 */
export async function fetchUserStoryResponses(storyId: string): Promise<any[]> {
    const response = await apiClient.get(`/api/stories/${storyId}/responses`);
    return response.data;
}

/**
 * Create a new story (teacher/admin only)
 */
export async function createStory(storyData: any, chapters: any[]): Promise<Story> {
    const response = await apiClient.post<Story>('/api/stories', {
        storyData,
        chapters,
    });
    return response.data;
}

/**
 * Update a story (teacher/admin only)
 */
export async function updateStory(storyId: string, data: Partial<Story>): Promise<Story> {
    const response = await apiClient.put<Story>(`/api/stories/${storyId}`, data);
    return response.data;
}

/**
 * Delete a story (admin only)
 */
export async function deleteStory(storyId: string): Promise<void> {
    await apiClient.delete(`/api/stories/${storyId}`);
}
