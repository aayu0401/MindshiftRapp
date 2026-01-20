import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
