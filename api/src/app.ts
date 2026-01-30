import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import storiesRoutes from './routes/stories';
import assessmentsRoutes from './routes/assessments';
import analyticsRoutes from './routes/analytics';
import aiGeneratorRoutes from './routes/ai-generator';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiGeneratorRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
