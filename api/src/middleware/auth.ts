import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';

export interface AuthRequest extends Request {
  user?: any;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ error: 'Missing authorization header' });
    const parts = (auth as string).split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed authorization header' });
    const token = parts[1];
    const payload: any = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
    if (!payload || !payload.sub) return res.status(401).json({ error: 'Invalid token' });
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
