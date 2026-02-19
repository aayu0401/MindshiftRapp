import { apiClient } from './client';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    points: number;
    criteria: any;
}

export interface UserAchievement {
    id: string;
    userId: string;
    achievementId: string;
    unlockedAt: string;
    achievement: Achievement;
}

export interface UserAchievementsResponse {
    achievements: UserAchievement[];
    totalPoints: number;
    totalUnlocked: number;
}

/**
 * Fetch all available achievements
 */
export async function fetchAllAchievements(): Promise<Achievement[]> {
    try {
        const response = await apiClient.get<Achievement[]>('/api/achievements');
        return response.data;
    } catch (error) {
        console.warn('Achievements unavailable (backend unreachable)');
        return [
            { id: '1', name: 'Early Bird Reflector', description: 'Write your first journal entry.', category: 'JOURNALING', icon: '✍️', points: 50, criteria: {} },
            { id: '2', name: 'Story Explorer', description: 'Complete your first therapeutic story.', category: 'STORIES', icon: '📖', points: 100, criteria: {} },
            { id: '3', name: 'Mindfulness Master', description: 'Complete 5 breathing exercises.', category: 'MINDFULNESS', icon: '🧘', points: 250, criteria: {} },
            { id: '4', name: 'Deep Thinker', description: 'Complete 5 journal entries.', category: 'JOURNALING', icon: '🧠', points: 200, criteria: {} },
        ];
    }
}

/**
 * Fetch the current user's unlocked achievements
 */
export async function fetchMyAchievements(): Promise<UserAchievementsResponse> {
    try {
        const response = await apiClient.get<UserAchievementsResponse>('/api/achievements/me');
        return response.data;
    } catch (error) {
        return { achievements: [], totalPoints: 0, totalUnlocked: 0 };
    }
}

/**
 * Trigger an achievement check after completing an action
 */
export async function checkAchievement(
    actionType: 'STORY_COMPLETED' | 'JOURNAL_CREATED' | 'STREAK_MILESTONE' | 'BREATHING_DONE'
): Promise<void> {
    try {
        await apiClient.post('/api/achievements/check', { actionType });
    } catch (error) {
        console.warn('Achievement check failed');
    }
}

/**
 * Seed default achievements (admin only)
 */
export async function seedAchievements(): Promise<void> {
    try {
        await apiClient.post('/api/achievements/seed');
    } catch (error) {
        console.warn('Achievement seed failed');
    }
}
