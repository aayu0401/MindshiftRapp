import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { achievementService } from '../services/AchievementService';
import { prisma } from '../prismaClient';

const router = express.Router();

/**
 * GET /api/achievements
 * Get all available achievements
 */
router.get('/', requireAuth, async (_req: AuthRequest, res) => {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: { points: 'asc' },
        });
        res.json(achievements);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/achievements/me
 * Get the current user's unlocked achievements
 */
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId: req.user.sub },
            include: { achievement: true },
            orderBy: { unlockedAt: 'desc' },
        });

        // Calculate total points
        const totalPoints = userAchievements.reduce(
            (sum, ua) => sum + (ua.achievement.points || 0), 0
        );

        res.json({
            achievements: userAchievements,
            totalPoints,
            totalUnlocked: userAchievements.length,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/achievements/check
 * Trigger achievement check for an action
 */
router.post('/check', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

        const { actionType } = req.body;
        const validActions = ['STORY_COMPLETED', 'JOURNAL_CREATED', 'STREAK_MILESTONE', 'BREATHING_DONE'];
        if (!validActions.includes(actionType)) {
            return res.status(400).json({ error: 'Invalid action type' });
        }

        await achievementService.checkAchievements(req.user.sub, actionType);
        res.json({ ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/achievements/seed
 * Seed default achievements (admin only)
 */
router.post('/seed', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user || !['SCHOOL_ADMIN'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await achievementService.seedAchievements();
        res.json({ ok: true, message: 'Achievements seeded' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
