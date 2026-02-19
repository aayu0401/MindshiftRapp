import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { prisma } from '../prismaClient';

const router = express.Router();

// In-memory course data (will be replaced by Prisma model once migration is run)
const courses = [
    {
        id: 'course-1',
        title: 'Understanding Emotions',
        description: 'A foundational course helping children identify and understand their emotions through interactive stories and activities.',
        category: 'Emotional Literacy',
        ageGroup: '6-10',
        duration: '4 weeks',
        lessonsCount: 12,
        imageUrl: '/images/courses/emotions.jpg',
        difficulty: 'Beginner',
        tags: ['emotions', 'self-awareness', 'foundational'],
        published: true,
    },
    {
        id: 'course-2',
        title: 'Building Resilience',
        description: 'Learn coping strategies and build mental resilience through guided exercises and therapeutic narratives.',
        category: 'Resilience',
        ageGroup: '8-12',
        duration: '6 weeks',
        lessonsCount: 18,
        imageUrl: '/images/courses/resilience.jpg',
        difficulty: 'Intermediate',
        tags: ['resilience', 'coping', 'strength'],
        published: true,
    },
    {
        id: 'course-3',
        title: 'Mindful Communication',
        description: 'Develop healthy communication skills, empathy, and conflict resolution abilities through role-play scenarios.',
        category: 'Social Skills',
        ageGroup: '10-14',
        duration: '5 weeks',
        lessonsCount: 15,
        imageUrl: '/images/courses/communication.jpg',
        difficulty: 'Intermediate',
        tags: ['communication', 'empathy', 'social-skills'],
        published: true,
    },
    {
        id: 'course-4',
        title: 'Anxiety Management Toolkit',
        description: 'Evidence-based techniques for managing anxiety, including breathing exercises, grounding, and cognitive reframing.',
        category: 'Anxiety Management',
        ageGroup: '8-14',
        duration: '4 weeks',
        lessonsCount: 12,
        imageUrl: '/images/courses/anxiety.jpg',
        difficulty: 'Beginner',
        tags: ['anxiety', 'breathing', 'cbt'],
        published: true,
    },
    {
        id: 'course-5',
        title: 'Self-Esteem Builders',
        description: 'Activities and stories designed to help children develop a positive self-image and build confidence.',
        category: 'Self-Esteem',
        ageGroup: '6-12',
        duration: '3 weeks',
        lessonsCount: 9,
        imageUrl: '/images/courses/self-esteem.jpg',
        difficulty: 'Beginner',
        tags: ['self-esteem', 'confidence', 'identity'],
        published: true,
    },
    {
        id: 'course-6',
        title: 'Grief & Loss Support',
        description: 'A sensitive, guided course helping children process grief and loss through therapeutic storytelling.',
        category: 'Grief Support',
        ageGroup: '8-14',
        duration: '6 weeks',
        lessonsCount: 12,
        imageUrl: '/images/courses/grief.jpg',
        difficulty: 'Advanced',
        tags: ['grief', 'loss', 'healing'],
        published: true,
    },
];

/**
 * GET /api/courses
 * List all courses with optional filters
 */
router.get('/', async (req, res) => {
    try {
        let result = [...courses];

        const { category, ageGroup, search, difficulty } = req.query;

        if (category) {
            result = result.filter(c =>
                c.category.toLowerCase() === (category as string).toLowerCase()
            );
        }

        if (ageGroup) {
            result = result.filter(c => c.ageGroup === ageGroup);
        }

        if (difficulty) {
            result = result.filter(c =>
                c.difficulty.toLowerCase() === (difficulty as string).toLowerCase()
            );
        }

        if (search) {
            const q = (search as string).toLowerCase();
            result = result.filter(c =>
                c.title.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.tags.some(t => t.includes(q))
            );
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/courses/:id
 * Get a single course by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const course = courses.find(c => c.id === req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/courses/:id/enroll
 * Enroll in a course
 */
router.post('/:id/enroll', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        const course = courses.find(c => c.id === req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // In production: Create enrollment record in DB
        res.json({
            ok: true,
            courseId: req.params.id,
            userId: req.user.sub,
            enrolledAt: new Date(),
            message: `Enrolled in "${course.title}"`,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/courses/categories/list
 * Get unique course categories
 */
router.get('/categories/list', async (_req, res) => {
    const categories = [...new Set(courses.map(c => c.category))];
    res.json(categories);
});

export default router;
