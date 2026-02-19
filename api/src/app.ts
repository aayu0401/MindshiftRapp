import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import storiesRoutes from './routes/stories';
import assessmentsRoutes from './routes/assessments';
import analyticsRoutes from './routes/analytics';
import aiGeneratorRoutes from './routes/ai-generator';
import journalRoutes from './routes/journal';
import notificationRoutes from './routes/notifications';
import achievementRoutes from './routes/achievements';
import invitationRoutes from './routes/invitations';
import courseRoutes from './routes/courses';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiGeneratorRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/courses', courseRoutes);

// Health check
app.get('/health', (_req, res) => res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
        auth: 'active',
        stories: 'active',
        assessments: 'active',
        analytics: 'active',
        ai: 'active',
        journal: 'active',
        notifications: 'active',
        achievements: 'active',
        invitations: 'active',
        courses: 'active',
    }
}));

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

export default app;
