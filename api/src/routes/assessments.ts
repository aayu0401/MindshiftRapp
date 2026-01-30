import express from 'express';
import { assessmentService } from '../services/assessment.service';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/assessments
 * Get all assessments with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const filters = {
            type: req.query.type as any,
            ageGroup: req.query.ageGroup as any,
            storyId: req.query.storyId as string,
            published: req.query.published === 'true',
        };

        const assessments = await assessmentService.getAssessments(filters);
        return res.json(assessments);
    } catch (error: any) {
        console.error('Error fetching assessments:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/assessments/:id
 * Get a single assessment by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const assessment = await assessmentService.getAssessmentById(id);
        return res.json(assessment);
    } catch (error: any) {
        console.error('Error fetching assessment:', error);
        return res.status(404).json({ error: error.message });
    }
});

/**
 * POST /api/assessments/:id/submit
 * Submit assessment responses
 */
router.post('/:id/submit', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { responses } = req.body;

        const result = await assessmentService.submitAssessment({
            userId: req.user.sub,
            assessmentId: id,
            responses,
        });

        return res.json(result);
    } catch (error: any) {
        console.error('Error submitting assessment:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/assessments/:id/results
 * Get assessment results for current user
 */
router.get('/:id/results', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const results = await assessmentService.getUserResults(req.user.sub, id);
        return res.json(results);
    } catch (error: any) {
        console.error('Error fetching results:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/assessments/results/latest
 * Get latest assessment result for current user
 */
router.get('/results/latest', authMiddleware, async (req, res) => {
    try {
        const result = await assessmentService.getLatestResult(req.user.sub);
        return res.json(result);
    } catch (error: any) {
        console.error('Error fetching latest result:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/assessments/story/:storyId
 * Get assessments linked to a specific story
 */
router.get('/story/:storyId', async (req, res) => {
    try {
        const { storyId } = req.params;
        const assessments = await assessmentService.getStoryAssessments(storyId);
        return res.json(assessments);
    } catch (error: any) {
        console.error('Error fetching story assessments:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/assessments
 * Create a new assessment (teacher/admin only)
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'TEACHER' && req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const assessment = await assessmentService.createAssessment(req.body);
        return res.status(201).json(assessment);
    } catch (error: any) {
        console.error('Error creating assessment:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/assessments/result/:resultId
 * Get detailed assessment result by ID
 */
router.get('/result/:resultId', authMiddleware, async (req, res) => {
    try {
        const { resultId } = req.params;
        const result = await assessmentService.getResultById(resultId);

        // Check if user has permission to view this result
        if (
            result.userId !== req.user.sub &&
            req.user.role !== 'TEACHER' &&
            req.user.role !== 'SCHOOL_ADMIN' &&
            req.user.role !== 'PARENT'
        ) {
            return res.status(403).json({ error: 'Access denied' });
        }

        return res.json(result);
    } catch (error: any) {
        console.error('Error fetching result:', error);
        return res.status(404).json({ error: error.message });
    }
});

export default router;
