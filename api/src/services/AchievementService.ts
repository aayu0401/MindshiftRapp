
import { prisma } from '../prismaClient';

export class AchievementService {
    /**
     * Check and award achievements for a student based on an action
     */
    async checkAchievements(userId: string, actionType: 'STORY_COMPLETED' | 'JOURNAL_CREATED' | 'STREAK_MILESTONE' | 'BREATHING_DONE') {
        const achievements = await prisma.achievement.findMany();
        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId }
        });

        const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

        for (const achievement of achievements) {
            if (unlockedIds.has(achievement.id)) continue;

            const criteria = achievement.criteria as any;
            let shouldUnlock = false;

            if (actionType === 'STORY_COMPLETED' && criteria.action === 'STORY_COUNT') {
                const count = await prisma.storyProgress.count({
                    where: { userId, completed: true }
                });
                if (count >= criteria.count) shouldUnlock = true;
            }

            if (actionType === 'JOURNAL_CREATED' && criteria.action === 'JOURNAL_COUNT') {
                const count = await prisma.dailyJournal.count({
                    where: { userId }
                });
                if (count >= criteria.count) shouldUnlock = true;
            }

            if (shouldUnlock) {
                await prisma.userAchievement.create({
                    data: {
                        userId,
                        achievementId: achievement.id
                    }
                });

                // Create a notification
                await prisma.notification.create({
                    data: {
                        userId,
                        type: 'ACHIEVEMENT_UNLOCKED',
                        title: 'Achievement Unlocked! 🏆',
                        message: `Congratulations! You've earned the "${achievement.name}" badge.`,
                        data: { achievementId: achievement.id, icon: achievement.icon }
                    }
                });

                console.log(`🏆 Achievement unlocked for ${userId}: ${achievement.name}`);
            }
        }
    }

    /**
     * Seed initial achievements
     */
    async seedAchievements() {
        const count = await prisma.achievement.count();
        if (count > 0) return;

        await prisma.achievement.createMany({
            data: [
                {
                    name: "Early Bird Reflector",
                    description: "Write your first journal entry.",
                    category: "JOURNALING",
                    icon: "✍️",
                    points: 50,
                    criteria: { action: "JOURNAL_COUNT", count: 1 }
                },
                {
                    name: "Story Explorer",
                    description: "Complete your first therapeutic story.",
                    category: "STORIES",
                    icon: "📖",
                    points: 100,
                    criteria: { action: "STORY_COUNT", count: 1 }
                },
                {
                    name: "Mindfulness Master",
                    description: "Complete 5 breathing exercises.",
                    category: "MINDFULNESS",
                    icon: "🧘",
                    points: 250,
                    criteria: { action: "BREATHING_COUNT", count: 5 }
                },
                {
                    name: "Deep Thinker",
                    description: "Complete 5 journal entries.",
                    category: "JOURNALING",
                    icon: "🧠",
                    points: 200,
                    criteria: { action: "JOURNAL_COUNT", count: 5 }
                }
            ]
        });
    }
}

export const achievementService = new AchievementService();
