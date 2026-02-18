import express, { Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/analytics/user/:userId
 * Get analytics for a specific user
 */
router.get('/user/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUser = req.user;

        if (!currentUser) return res.status(401).json({ error: 'Not authenticated' });

        // Check permissions: user can view own data, teachers/admins can view student data, parents can view children
        if (
            currentUser.sub !== userId &&
            currentUser.role !== 'TEACHER' &&
            currentUser.role !== 'SCHOOL_ADMIN' &&
            currentUser.role !== 'PARENT'
        ) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const analytics = await analyticsService.getUserAnalytics(userId);
        return res.json(analytics);
    } catch (error: any) {
        console.error('Error fetching user analytics:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/analytics/me
 * Get analytics for current user
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const analytics = await analyticsService.getUserAnalytics(req.user.sub);
        return res.json(analytics);
    } catch (error: any) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/analytics/class
 * Get class-wide analytics (teacher only)
 */
router.get('/class', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        const classId = req.query.classId as string;
        const analytics = await analyticsService.getClassAnalytics(req.user.sub, classId);
        return res.json(analytics);
    } catch (error: any) {
        console.error('Error fetching class analytics:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/analytics/school
 * Get school-wide analytics (admin only)
 */
router.get('/school', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Get school ID from user
        const { prisma } = await import('../prismaClient');
        const user = await prisma.user.findUnique({
            where: { id: req.user.sub },
            select: { schoolId: true },
        });

        if (!user?.schoolId) {
            return res.status(400).json({ error: 'School ID not found' });
        }

        const analytics = await analyticsService.getSchoolAnalytics(user.schoolId);
        return res.json(analytics);
    } catch (error: any) {
        console.error('Error fetching school analytics:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/analytics/high-risk
 * Get high-risk students (teacher/admin only)
 */
router.get('/high-risk', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        const { prisma } = await import('../prismaClient');
        const user = await prisma.user.findUnique({
            where: { id: req.user.sub },
            select: { schoolId: true },
        });

        if (!user?.schoolId) {
            return res.status(400).json({ error: 'School ID not found' });
        }

        const highRiskStudents = await analyticsService.getHighRiskStudents(user.schoolId);
        return res.json(highRiskStudents);
    } catch (error: any) {
        console.error('Error fetching high-risk students:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/analytics/report/:userId
 * Generate comprehensive progress report for a student
 */
router.get('/report/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUser = req.user;

        if (!currentUser) return res.status(401).json({ error: 'Not authenticated' });

        // Check permissions
        if (
            currentUser.sub !== userId &&
            currentUser.role !== 'TEACHER' &&
            currentUser.role !== 'SCHOOL_ADMIN' &&
            currentUser.role !== 'PARENT'
        ) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const report = await analyticsService.generateStudentReport(userId);
        return res.json(report);
    } catch (error: any) {
        console.error('Error generating report:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/analytics/track-engagement
 * Track user engagement
 */
router.post('/track-engagement', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const { activityType, durationMinutes } = req.body;

        await analyticsService.trackEngagement(
            req.user.sub,
            activityType,
            durationMinutes
        );

        return res.json({ success: true });
    } catch (error: any) {
        console.error('Error tracking engagement:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
