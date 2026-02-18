import { prisma } from '../prismaClient';

export interface CreateJournalEntry {
    userId: string;
    mood: number;
    content: string;
    tags: string[];
    gratitudeHighlights: string[];
}

export class JournalService {
    /**
     * Create a new journal entry
     */
    async createEntry(data: CreateJournalEntry) {
        const entry = await prisma.dailyJournal.create({
            data: {
                userId: data.userId,
                mood: data.mood,
                content: data.content,
                tags: data.tags,
                gratitudeHighlights: data.gratitudeHighlights,
            },
        });

        // Update user analytics - increment total time spent or active days
        await prisma.userAnalytics.upsert({
            where: { userId: data.userId },
            update: {
                lastActiveDate: new Date(),
                totalTimeSpent: { increment: 5 }, // Assume 5 mins for journaling
            },
            create: {
                userId: data.userId,
                lastActiveDate: new Date(),
                totalTimeSpent: 5,
            },
        });

        return entry;
    }

    /**
     * Get journal entries for a user
     */
    async getEntries(userId: string, limit: number = 30) {
        const entries = await prisma.dailyJournal.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: limit,
        });

        return entries;
    }

    /**
     * Get journal stats for a user
     */
    async getJournalStats(userId: string) {
        const entries = await prisma.dailyJournal.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });

        const totalEntries = entries.length;
        const moodAverage = totalEntries > 0
            ? entries.reduce((acc: number, curr: any) => acc + curr.mood, 0) / totalEntries
            : 0;

        // Group by mood
        const moodDistribution = {
            1: entries.filter((e: any) => e.mood === 1).length,
            2: entries.filter((e: any) => e.mood === 2).length,
            3: entries.filter((e: any) => e.mood === 3).length,
            4: entries.filter((e: any) => e.mood === 4).length,
            5: entries.filter((e: any) => e.mood === 5).length,
        };

        return {
            totalEntries,
            moodAverage,
            moodDistribution,
            lastEntry: entries[0] || null,
        };
    }
}

export const journalService = new JournalService();
