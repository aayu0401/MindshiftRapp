import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient';
import { signAccessToken, createRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/jwt';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hash, name } });
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('jid', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('jid', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies['jid'];
    if (!token) return res.status(401).json({ error: 'No refresh token' });
    const userId = await verifyRefreshToken(token);
    if (!userId) return res.status(401).json({ error: 'Invalid refresh token' });
    // rotate
    await revokeRefreshToken(token);
    const newToken = await createRefreshToken(userId);
    res.cookie('jid', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    const accessToken = signAccessToken({ sub: userId });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies['jid'];
    if (token) await revokeRefreshToken(token);
    res.clearCookie('jid', { path: '/' });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
