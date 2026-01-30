import express from 'express';
import { storyService } from '../services/story.service';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/stories
 * Get all stories with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const filters = {
            category: req.query.category as any,
            ageGroup: req.query.ageGroup as any,
            therapeuticGoal: req.query.therapeuticGoal as any,
            published: req.query.published === 'true',
            featured: req.query.featured === 'true',
            search: req.query.search as string,
        };

        const stories = await storyService.getStories(filters);
        return res.json(stories);
    } catch (error: any) {
        console.error('Error fetching stories:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/stories/:id
 * Get a single story by ID with full details
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId as string;

        const story = await storyService.getStoryById(id, userId);
        return res.json(story);
    } catch (error: any) {
        console.error('Error fetching story:', error);
        return res.status(404).json({ error: error.message });
    }
});

/**
 * POST /api/stories
 * Create a new story (teacher/admin only)
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { storyData, chapters } = req.body;

        // Check if user has permission (teacher or admin)
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const story = await storyService.createStory(storyData, chapters);
        return res.status(201).json(story);
    } catch (error: any) {
        console.error('Error creating story:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/stories/:id
 * Update a story (teacher/admin only)
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const story = await storyService.updateStory(id, req.body);
        return res.json(story);
    } catch (error: any) {
        console.error('Error updating story:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/stories/:id
 * Delete a story (admin only)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await storyService.deleteStory(id);
        return res.json({ message: 'Story deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting story:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/stories/:id/progress
 * Update reading progress for a story
 */
router.post('/:id/progress', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { currentChapter, currentSection, completed } = req.body;

        const progress = await storyService.updateProgress(
            req.user.sub,
            id,
            currentChapter,
            currentSection,
            completed
        );

        return res.json(progress);
    } catch (error: any) {
        console.error('Error updating progress:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/stories/:storyId/questions/:questionId/response
 * Submit a response to a story question
 */
router.post('/:storyId/questions/:questionId/response', authMiddleware, async (req, res) => {
    try {
        const { questionId } = req.params;
        const response = req.body;

        const questionResponse = await storyService.submitQuestionResponse(
            req.user.sub,
            questionId,
            response
        );

        return res.json(questionResponse);
    } catch (error: any) {
        console.error('Error submitting question response:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/stories/:id/responses
 * Get user's responses to story questions
 */
router.get('/:id/responses', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const responses = await storyService.getUserStoryResponses(req.user.sub, id);
        return res.json(responses);
    } catch (error: any) {
        console.error('Error fetching responses:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
