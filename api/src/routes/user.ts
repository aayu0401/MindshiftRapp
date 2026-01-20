import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = req.user;
  res.json({ user });
});

export default router;
