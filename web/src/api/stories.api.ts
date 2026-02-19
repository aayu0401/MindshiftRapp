import { apiClient } from './client';
import { sampleStories } from '../data/sampleStories';

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
    references?: string;
    relationships?: string;
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
    isCorrect?: boolean;
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

const STORAGE_KEY = 'mindshiftr_user_stories';

/**
 * Helper to get local stories
 */
const getLocalStories = (): Story[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

/**
 * Helper to convert sample stories to Story interface
 */
const getMappedStories = (): Story[] => {
    return sampleStories.map(s => ({
        ...s,
        therapeuticGoals: ['Emotional Awareness', 'Resilience'],
        published: true,
        featured: true,
        chapters: s.content ? [{
            id: `chapter-${s.id}`,
            chapterNumber: 1,
            title: 'Beginning',
            sections: s.content.map((sec, i) => ({
                id: `sec-${s.id}-${i}`,
                sectionNumber: i + 1,
                type: sec.type === 'question' ? 'QUESTION' : 'TEXT' as any,
                content: sec.content,
                question: sec.type === 'question' ? {
                    id: `q-${s.id}-${i}`,
                    question: sec.content,
                    type: 'MULTIPLE_CHOICE'
                } : undefined
            }))
        }] : []
    }));
};

/**
 * Fetch all stories with optional filters
 */
export async function fetchStories(filters?: StoryFilters): Promise<Story[]> {
    try {
        const params: Record<string, string> = {};
        if (filters?.category) params.category = filters.category;
        if (filters?.ageGroup) params.ageGroup = filters.ageGroup;
        if (filters?.search) params.search = filters.search;
        if (filters?.published !== undefined) params.published = String(filters.published);

        const response = await apiClient.get<Story[]>('/api/stories', { params });
        return response.data;
    } catch (error) {
        console.warn('Using sample + local stories (backend unreachable)');
        const sample = getMappedStories();
        const local = getLocalStories();
        let allStories = [...local, ...sample];

        if (filters) {
            if (filters.category) allStories = allStories.filter(s => s.category.toLowerCase() === filters.category?.toLowerCase());
            if (filters.ageGroup) allStories = allStories.filter(s => s.ageGroup === filters.ageGroup);
            if (filters.search) {
                const q = filters.search.toLowerCase();
                allStories = allStories.filter(s => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
            }
        }
        return allStories;
    }
}

/**
 * Fetch a single story by ID
 */
export async function fetchStoryById(storyId: string, userId?: string): Promise<Story> {
    try {
        const response = await apiClient.get<Story>(`/api/stories/${storyId}`);
        return response.data;
    } catch (error) {
        // Fallback to local/sample data
        const stories = [...getLocalStories(), ...getMappedStories()];
        const story = stories.find(s => s.id === storyId);
        if (!story) throw new Error('Story not found');
        return story;
    }
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
    try {
        const response = await apiClient.post<StoryProgress>(`/api/stories/${storyId}/progress`, {
            currentChapter,
            currentSection,
            completed,
        });
        return response.data;
    } catch (error) {
        return {
            id: 'local-progress',
            currentChapter,
            currentSection,
            completed,
            lastReadAt: new Date()
        };
    }
}

/**
 * Submit a response to a story question
 */
export async function submitQuestionResponse(
    storyId: string,
    questionId: string,
    response: any
): Promise<any> {
    try {
        const res = await apiClient.post(`/api/stories/${storyId}/responses`, {
            questionId,
            response,
        });
        return res.data;
    } catch (error) {
        return { success: true, mock: true };
    }
}

/**
 * Get user's responses to story questions
 */
export async function fetchUserStoryResponses(storyId: string): Promise<any[]> {
    return [];
}

/**
 * Create a new story (teacher/admin only)
 */
export async function createStory(storyData: any, chapters: any[]): Promise<Story> {
    try {
        // Mock creation logic
        const newStory: Story = {
            ...storyData,
            id: `user-story-${Date.now()}`,
            chapters,
            published: true,
            featured: false,
            author: storyData.author || 'AI Storyteller'
        };

        const localStories = getLocalStories();
        localStories.push(newStory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localStories));

        return newStory;
    } catch (e) {
        throw e;
    }
}

/**
 * Update a story (teacher/admin only)
 */
export async function updateStory(storyId: string, data: Partial<Story>): Promise<Story> {
    const localStories = getLocalStories();
    const index = localStories.findIndex(s => s.id === storyId);
    if (index !== -1) {
        localStories[index] = { ...localStories[index], ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localStories));
        return localStories[index];
    }
    throw new Error('Story not found or cannot be updated locally');
}

/**
 * Delete a story (admin only)
 */
export async function deleteStory(storyId: string): Promise<void> {
    const localStories = getLocalStories();
    const filtered = localStories.filter(s => s.id !== storyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
