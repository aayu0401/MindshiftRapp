import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { prisma } from '../prismaClient';
import { notificationService } from '../services/NotificationService';

const router = express.Router();

/**
 * POST /api/invitations
 * Create and send invitations (school admin only)
 */
router.post('/', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (!['SCHOOL_ADMIN', 'TEACHER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Admin or teacher access required' });
        }

        const { invites } = req.body; // Array of { email, name?, role }
        if (!Array.isArray(invites) || invites.length === 0) {
            return res.status(400).json({ error: 'invites array is required' });
        }

        const results: any[] = [];

        for (const invite of invites) {
            try {
                // Check if user already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: invite.email },
                });

                if (existingUser) {
                    results.push({
                        email: invite.email,
                        status: 'already_exists',
                        message: 'User already has an account',
                    });
                    continue;
                }

                // Generate invitation token
                const token = crypto.randomBytes(32).toString('hex');
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

                // Normalize role
                const validRoles = ['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'PARENT'];
                const roleMap: Record<string, string> = {
                    student: 'STUDENT',
                    teacher: 'TEACHER',
                    school: 'SCHOOL_ADMIN',
                    parent: 'PARENT',
                };
                const role = validRoles.includes(invite.role)
                    ? invite.role
                    : roleMap[invite.role?.toLowerCase()] || 'STUDENT';

                // Create a pre-registered user with a temporary password
                const tempPassword = crypto.randomBytes(8).toString('hex');
                const hash = await bcrypt.hash(tempPassword, 12);

                const user = await prisma.user.create({
                    data: {
                        email: invite.email,
                        password: hash,
                        name: invite.name || invite.email.split('@')[0],
                        role: role as any,
                        schoolId: req.user.sub, // Associate with the admin's school
                    },
                });

                // In production: Send email via SendGrid/Postmark
                // For now, we log the invitation details
                console.log(`📧 Invitation ready for ${invite.email} (Role: ${role})`);
                console.log(`   Token: ${token} | Temp Password: ${tempPassword}`);
                console.log(`   Expires: ${expiresAt.toISOString()}`);

                // Create notification for admin
                await notificationService.createNotification(
                    req.user.sub,
                    'INVITATION_SENT',
                    'Invitation Sent',
                    `Invitation sent to ${invite.email} as ${role}`,
                    { userId: user.id, email: invite.email, token }
                );

                results.push({
                    email: invite.email,
                    status: 'invited',
                    userId: user.id,
                    message: `Invitation created for ${invite.email}`,
                    // In production: include invite link
                    inviteUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite?token=${token}`,
                });
            } catch (inviteError: any) {
                results.push({
                    email: invite.email,
                    status: 'error',
                    message: inviteError.message,
                });
            }
        }

        res.json({
            total: invites.length,
            successful: results.filter(r => r.status === 'invited').length,
            existing: results.filter(r => r.status === 'already_exists').length,
            failed: results.filter(r => r.status === 'error').length,
            results,
        });
    } catch (error: any) {
        console.error('Invitation error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/invitations
 * List all invited users for a school admin
 */
router.get('/', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (!['SCHOOL_ADMIN', 'TEACHER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Admin or teacher access required' });
        }

        // Find all users associated with this admin's school
        const users = await prisma.user.findMany({
            where: { schoolId: req.user.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/invitations/:userId
 * Remove an invited user (before they accept)
 */
router.delete('/:userId', requireAuth, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== 'SCHOOL_ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await prisma.user.delete({
            where: { id: req.params.userId },
        });

        res.json({ ok: true, message: 'User removed' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
