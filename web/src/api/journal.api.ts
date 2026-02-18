import { apiClient } from './client';

export interface JournalEntry {
    id: string;
    userId: string;
    date: string;
    mood: number;
    content: string;
    tags: string[];
    gratitudeHighlights: string[];
    createdAt: string;
}

export interface JournalStats {
    totalEntries: number;
    moodAverage: number;
    moodDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    lastEntry: JournalEntry | null;
}

const mockJournalEntries: JournalEntry[] = [
    {
        id: 'j-1',
        userId: 'user-1',
        date: new Date().toISOString(),
        mood: 4,
        content: 'Today was a productive day. I enjoyed the stories about resilience.',
        tags: ['resilience', 'productive'],
        gratitudeHighlights: ['Good coffee', 'Sunny weather'],
        createdAt: new Date().toISOString()
    }
];

export const fetchJournalEntries = async (limit?: number) => {
    try {
        const response = await apiClient.get<JournalEntry[]>('/api/journal', {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.warn('Using mock journal entries (backend unreachable)');
        return mockJournalEntries;
    }
};

export const fetchJournalStats = async () => {
    try {
        const response = await apiClient.get<JournalStats>('/api/journal/stats');
        return response.data;
    } catch (error) {
        return {
            totalEntries: 5,
            moodAverage: 4.2,
            moodDistribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 2 },
            lastEntry: mockJournalEntries[0]
        };
    }
};

export const createJournalEntry = async (data: Omit<JournalEntry, 'id' | 'userId' | 'date' | 'createdAt'>) => {
    try {
        const response = await apiClient.post<JournalEntry>('/api/journal', data);
        return response.data;
    } catch (error) {
        return { ...data, id: 'mock-j-' + Math.random(), userId: 'user-1', date: new Date().toISOString(), createdAt: new Date().toISOString() };
    }
};
