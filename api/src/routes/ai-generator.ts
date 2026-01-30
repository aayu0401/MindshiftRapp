import express from 'express';
import { aiGeneratorService } from '../services/ai-generator.service';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/ai/generate-story
 * Generate a new story using AI (teacher/admin only)
 */
router.post('/generate-story', authMiddleware, async (req, res) => {
    try {
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
 * GET /api/ai/templates
 * Get all AI story templates
 */
router.get('/templates', authMiddleware, async (req, res) => {
    try {
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
router.post('/templates', authMiddleware, async (req, res) => {
    try {
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
router.get('/pending-approval', authMiddleware, async (req, res) => {
    try {
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
router.post('/approve/:storyId', authMiddleware, async (req, res) => {
    try {
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
router.post('/reject/:storyId', authMiddleware, async (req, res) => {
    try {
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
 * POST /api/ai/regenerate/:storyId
 * Regenerate a story with modifications
 */
router.post('/regenerate/:storyId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Teacher or admin access required' });
        }

        // This would involve getting the original generation, modifying the prompt, and regenerating
        // For now, return a placeholder
        return res.json({
            message: 'Regeneration feature coming soon',
        });
    } catch (error: any) {
        console.error('Error regenerating story:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
