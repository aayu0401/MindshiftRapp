import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET || 'secret', { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as any });
}

export async function createRefreshToken(userId: string) {
  const token = uuidv4();
  // set in redis with expiration (30 days default)
  const seconds = 60 * 60 * 24 * 30;
  await redis.set(`refresh:${token}`, userId, 'EX', seconds);
  return token;
}

export async function verifyRefreshToken(token: string) {
  const userId = await redis.get(`refresh:${token}`);
  return userId;
}

export async function revokeRefreshToken(token: string) {
  await redis.del(`refresh:${token}`);
}
