
import { Server, Socket } from 'socket.io';
import { aiService } from './AIService';
import { achievementService } from './AchievementService';
import { prisma } from '../prismaClient';

class SocketService {
    private io: Server | null = null;
    private onlineUsers: Map<string, { userId: string, name: string, role: string }> = new Map();

    init(server: any) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('⚡ New Connection:', socket.id);

            // Handle User Identification
            socket.on('identify', (userData) => {
                this.onlineUsers.set(socket.id, userData);
                if (userData.role === 'teacher') {
                    socket.join('teachers');
                }
                this.broadcastOnlineCount();
                console.log(`👤 User identified: ${userData.name} (${userData.role})`);
            });

            // Story Progress Updates
            socket.on('story-interaction', (data) => {
                // Broadcast to teachers for live feed
                this.io?.to('teachers').emit('live-activity', {
                    ...data,
                    timestamp: new Date(),
                    type: 'STORY_PROGRESS'
                });
            });

            // Quiz & Journal (Re-integrated from server.ts)
            socket.on('quiz-completed', (data) => {
                this.handleQuizAnalysis(socket, data);
            });

            socket.on('journal-entry-created', (data) => {
                this.handleJournalAnalysis(socket, data);
            });

            socket.on('disconnect', () => {
                this.onlineUsers.delete(socket.id);
                this.broadcastOnlineCount();
                console.log('❌ Client disconnected:', socket.id);
            });
        });
    }

    private broadcastOnlineCount() {
        const counts = {
            total: this.onlineUsers.size,
            teachers: Array.from(this.onlineUsers.values()).filter(u => u.role === 'teacher').length,
            students: Array.from(this.onlineUsers.values()).filter(u => u.role === 'student').length
        };
        this.io?.emit('presence-update', counts);
    }

    private async handleQuizAnalysis(socket: Socket, data: any) {
        const riskScore = 100 - (data.score * 30);
        const userId = data.userId || this.onlineUsers.get(socket.id)?.userId;

        if (riskScore > 70) {
            this.io?.to('teachers').emit('high-risk-alert', {
                studentName: data.studentName,
                className: 'Grade 5A',
                assessmentType: 'Story Reflection',
                score: riskScore,
                riskType: riskScore > 85 ? 'Critical Concern' : 'Moderate Anxiety',
                timestamp: new Date()
            });
        }

        // Trigger AI Deep Insight Analysis
        if (userId) {
            const insights = await aiService.analyzeStudentWellbeing(userId);
            if (insights.length > 0) {
                this.io?.to('teachers').emit('deep-insights', {
                    studentName: data.studentName,
                    insights
                });
            }

            // Check for Achievements
            await achievementService.checkAchievements(userId, 'STORY_COMPLETED');
        }
    }

    private async handleJournalAnalysis(socket: Socket, data: any) {
        const userId = data.userId || this.onlineUsers.get(socket.id)?.userId;
        const isCritical = data.content.toLowerCase().includes('sad') ||
            data.content.toLowerCase().includes('help') ||
            data.mood <= 2;

        if (isCritical) {
            this.io?.to('teachers').emit('high-risk-alert', {
                studentName: data.studentName,
                assessmentType: 'Journal Entry',
                score: data.mood * 20,
                riskType: data.mood === 1 ? 'Urgent Alert' : 'Distress Detected',
                timestamp: new Date()
            });
        }

        if (userId) {
            await achievementService.checkAchievements(userId, 'JOURNAL_CREATED');
        }
    }

    public getIO() {
        return this.io;
    }
}

export const socketService = new SocketService();
