import express, { Response, NextFunction } from 'express';
import { journalService } from '../services/journal.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/journal
 * Get user's journal entries
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.sub;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const entries = await journalService.getEntries(userId);
        return res.json(entries);
    } catch (error: any) {
        console.error('Error fetching journal entries:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/journal/stats
 * Get user's journal statistics
 */
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.sub;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const stats = await journalService.getJournalStats(userId);
        return res.json(stats);
    } catch (error: any) {
        console.error('Error fetching journal stats:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/journal
 * Create a new journal entry
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.sub;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const entryData = {
            ...req.body,
            userId: userId,
        };

        const entry = await journalService.createEntry(entryData);
        return res.status(201).json(entry);
    } catch (error: any) {
        console.error('Error creating journal entry:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
