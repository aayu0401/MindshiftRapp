import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = req.user;
  res.json({ user });
});

/**
 * GET /user/children
 * Get children for a parent
 */
router.get('/children', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== 'PARENT') return res.status(403).json({ error: 'Parent access required' });

    const { prisma } = await import('../prismaClient');
    const parent = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { childrenIds: true }
    });

    if (!parent || !parent.childrenIds.length) {
      return res.json([]);
    }

    const children = await prisma.user.findMany({
      where: { id: { in: parent.childrenIds } },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        grade: true,
        userAnalytics: true
      }
    });

    res.json(children);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
