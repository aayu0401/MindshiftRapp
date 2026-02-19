import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { notificationService } from '../services/NotificationService';

const router = express.Router();

/**
 * GET /api/notifications
 * Get notifications for the authenticated user
 */
router.get('/', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const notifications = await notificationService.getNotifications(req.user.sub);
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put('/:id/read', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const notification = await notificationService.markAsRead(req.params.id);
        res.json(notification);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
router.put('/read-all', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const { prisma } = await import('../prismaClient');
        await prisma.notification.updateMany({
            where: { userId: req.user.sub, read: false },
            data: { read: true },
        });
        res.json({ ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 */
router.get('/unread-count', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const { prisma } = await import('../prismaClient');
        const count = await prisma.notification.count({
            where: { userId: req.user.sub, read: false },
        });
        res.json({ count });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
