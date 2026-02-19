import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient';
import { signAccessToken, createRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/jwt';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role, age, grade, schoolId } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 12);

    // Map role string to enum value (default STUDENT)
    const validRoles = ['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'PARENT'];
    const userRole = validRoles.includes(role) ? role : 'STUDENT';

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name: name || email.split('@')[0],
        role: userRole,
        age: age ? Number(age) : undefined,
        grade,
        schoolId,
      }
    });

    // Create initial analytics record
    try {
      await prisma.userAnalytics.create({
        data: { userId: user.id }
      });
    } catch {
      // Analytics model may not exist yet — non-critical
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
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

    // Include role in the JWT payload
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = await createRefreshToken(user.id);
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies['jid'];
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const userId = await verifyRefreshToken(token);
    if (!userId) return res.status(401).json({ error: 'Invalid refresh token' });

    // Rotate refresh token
    await revokeRefreshToken(token);
    const newToken = await createRefreshToken(userId);
    res.cookie('jid', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    // Fetch user for role in new access token
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const accessToken = signAccessToken({
      sub: userId,
      email: user?.email,
      role: user?.role
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
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
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
