import express, { Response } from 'express';
import { aiGeneratorService } from '../services/ai-generator.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/ai/generate-story
 * Generate a new story using AI (teacher/admin only)
 */
router.post('/generate-story', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        const { ageGroup, category, therapeuticGoals, customPrompt, templateId } = req.body;

        const generationId = await aiGeneratorService.generateStory({
            userId: req.user.sub,
            ageGroup,
            category,
            therapeuticGoals,
            customPrompt,
            templateId,
        });

        return res.json({
            generationId,
            message: 'Story generation started. Check pending approval for results.',
        });
    } catch (error: any) {
        console.error('Error generating story:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/ai/stream-story
 * Generate a new story using AI with real-time streaming (SSE)
 */
router.get('/stream-story', async (req: AuthRequest | any, res: Response) => {
    try {
        // Validation for SSE (custom auth handling since headers are different)
        const token = req.query.token as string;
        if (!token) return res.status(401).json({ error: 'Missing token' });

        // We need to manually verify because SSE uses EventSource which doesn't support custom headers easily without polyfills
        // For simplicity in this MVP, we pass token in query param
        // In production, use a cookie or a proper EventSource polyfill
        const jwt = require('jsonwebtoken'); // Lazy load
        let userId, userRole;
        try {
            const payload: any = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
            userId = payload.sub;
            // Fetch user role briefly to ensure permission
            const { prisma } = require('../prismaClient');
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
            if (!user) throw new Error("User not found");
            userRole = user.role;
        } catch (e) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (userRole !== 'TEACHER' && userRole !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        // Set Headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Prevent timeout
        res.flushHeaders();

        const { ageGroup, category, therapeuticGoals, customPrompt, templateId } = req.query;

        // Convert query params to expected format
        const requestData = {
            userId,
            ageGroup: ageGroup as any,
            category: category as any,
            therapeuticGoals: (therapeuticGoals as string || '').split(',') as any[],
            customPrompt: customPrompt as string,
            templateId: templateId as string
        };

        // Trigger Streaming
        await aiGeneratorService.generateStoryStream(requestData, res);

        // Connection closes when service finishes and calls res.end()
    } catch (error: any) {
        console.error('Error generating story stream:', error);
        // If headers sent, we can't send JSON error, write event instead
        res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
        res.end();
    }
});

/**
 * GET /api/ai/templates
 * Get all AI story templates
 */
router.get('/templates', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        const templates = await aiGeneratorService.getTemplates();
        return res.json(templates);
    } catch (error: any) {
        console.error('Error fetching templates:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/ai/templates
 * Create a new AI story template (admin only)
 */
router.post('/templates', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const template = await aiGeneratorService.createTemplate(req.body);
        return res.status(201).json(template);
    } catch (error: any) {
        console.error('Error creating template:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/ai/pending-approval
 * Get stories pending approval
 */
router.get('/pending-approval', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        // Admins can see all, teachers can see only their own
        const userId = req.user.role === 'SCHOOL_ADMIN' ? undefined : req.user.sub;

        const stories = await aiGeneratorService.getPendingApproval(userId);
        return res.json(stories);
    } catch (error: any) {
        console.error('Error fetching pending stories:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/ai/approve/:storyId
 * Approve and publish an AI-generated story
 */
router.post('/approve/:storyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        const { storyId } = req.params;
        const { reviewNotes } = req.body;

        const story = await aiGeneratorService.approveStory(
            storyId,
            req.user.sub,
            reviewNotes
        );

        return res.json({
            message: 'Story approved and published successfully',
            story,
        });
    } catch (error: any) {
        console.error('Error approving story:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/ai/reject/:storyId
 * Reject an AI-generated story
 */
router.post('/reject/:storyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        const { storyId } = req.params;
        const { reviewNotes } = req.body;

        if (!reviewNotes) {
            return res.status(400).json({ error: 'Review notes required for rejection' });
        }

        await aiGeneratorService.rejectStory(storyId, req.user.sub, reviewNotes);

        return res.json({
            message: 'Story rejected successfully',
        });
    } catch (error: any) {
        console.error('Error rejecting story:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/ai/chat
 * General purpose conversational chat
 */
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const reply = await aiGeneratorService.chat(
            message,
            req.user.role,
            history || []
        );

        return res.json({ reply });
    } catch (error: any) {
        console.error('Error in AI chat:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
