import { prisma } from '../prismaClient';
import { RiskLevel, Prisma } from '@prisma/client';

export class AnalyticsService {
    /**
     * Get analytics for a specific user
     */
    async getUserAnalytics(userId: string) {
        const analytics = await prisma.userAnalytics.findUnique({
            where: { userId },
        });

        if (!analytics) {
            // Create default analytics if not exists
            return await prisma.userAnalytics.create({
                data: { userId },
            });
        }

        // Get recent assessment results
        const recentResults = await prisma.assessmentResult.findMany({
            where: { userId },
            include: {
                assessment: {
                    select: {
                        title: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        // Get story progress
        const storyProgress = await prisma.storyProgress.findMany({
            where: { userId },
            include: {
                story: {
                    select: {
                        title: true,
                        category: true,
                    },
                },
            },
            orderBy: { lastReadAt: 'desc' },
            take: 10,
        });

        return {
            ...analytics,
            recentResults,
            storyProgress,
        };
    }

    /**
     * Get class-wide analytics for a teacher
     */
    async getClassAnalytics(teacherId: string, classId?: string) {
        // Get all students in the teacher's school
        const teacher = await prisma.user.findUnique({
            where: { id: teacherId },
            select: { schoolId: true },
        });

        if (!teacher?.schoolId) {
            throw new Error('Teacher not associated with a school');
        }

        // Get all students in the school
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                schoolId: teacher.schoolId,
            },
            include: {
                userAnalytics: true,
            },
        });

        // Calculate metrics
        const totalStudents = students.length;
        const activeStudents = students.filter(
            (s) => s.userAnalytics?.lastActiveDate &&
                new Date().getTime() - s.userAnalytics.lastActiveDate.getTime() < 7 * 24 * 60 * 60 * 1000 // Active in last 7 days
        ).length;

        const highRiskStudents = students.filter(
            (s) => s.userAnalytics?.currentRiskLevel === RiskLevel.HIGH
        ).length;

        const moderateRiskStudents = students.filter(
            (s) => s.userAnalytics?.currentRiskLevel === RiskLevel.MODERATE
        ).length;

        // Calculate average completion rate
        const completionRates = students.map((s) => {
            const started = s.userAnalytics?.storiesStarted || 0;
            const completed = s.userAnalytics?.storiesCompleted || 0;
            return started > 0 ? completed / started : 0;
        });
        const averageCompletionRate = completionRates.reduce((a, b) => a + b, 0) / totalStudents || 0;

        // Get high-risk student details
        const highRiskStudentDetails = await this.getHighRiskStudents(teacher.schoolId);

        // Get assessment distribution
        const assessmentResults = await prisma.assessmentResult.findMany({
            where: {
                user: {
                    schoolId: teacher.schoolId,
                    role: 'STUDENT',
                },
            },
            include: {
                assessment: {
                    select: {
                        title: true,
                        type: true,
                    },
                },
            },
        });

        const riskDistribution = {
            low: assessmentResults.filter((r) => r.riskLevel === RiskLevel.LOW).length,
            moderate: assessmentResults.filter((r) => r.riskLevel === RiskLevel.MODERATE).length,
            high: assessmentResults.filter((r) => r.riskLevel === RiskLevel.HIGH).length,
        };

        return {
            totalStudents,
            activeStudents,
            highRiskStudents,
            moderateRiskStudents,
            averageCompletionRate,
            averageEngagementScore: activeStudents / totalStudents,
            highRiskStudentDetails,
            riskDistribution,
            assessmentResults: assessmentResults.slice(0, 20), // Recent 20
        };
    }

    /**
     * Get high-risk students for intervention
     */
    async getHighRiskStudents(schoolId: string) {
        const highRiskStudents = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                schoolId,
                userAnalytics: {
                    currentRiskLevel: RiskLevel.HIGH,
                },
            },
            include: {
                userAnalytics: true,
                assessmentResults: {
                    where: {
                        riskLevel: RiskLevel.HIGH,
                    },
                    include: {
                        assessment: {
                            select: {
                                title: true,
                                type: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                },
            },
        });

        return highRiskStudents.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            grade: student.grade,
            currentRiskLevel: student.userAnalytics?.currentRiskLevel,
            lastAssessmentDate: student.userAnalytics?.lastAssessmentDate,
            recentHighRiskAssessments: student.assessmentResults,
            requiresImmediateAttention: student.assessmentResults.some(
                (r) => r.requiresScreening
            ),
        }));
    }

    /**
     * Get school-wide analytics (admin only)
     */
    async getSchoolAnalytics(schoolId: string) {
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                schoolId,
            },
            include: {
                userAnalytics: true,
            },
        });

        const teachers = await prisma.user.count({
            where: {
                role: 'TEACHER',
                schoolId,
            },
        });

        // Overall metrics
        const totalStudents = students.length;
        const activeStudents = students.filter(
            (s) => s.userAnalytics?.lastActiveDate &&
                new Date().getTime() - s.userAnalytics.lastActiveDate.getTime() < 7 * 24 * 60 * 60 * 1000
        ).length;

        const totalStoriesCompleted = students.reduce(
            (sum, s) => sum + (s.userAnalytics?.storiesCompleted || 0),
            0
        );

        const totalAssessmentsCompleted = students.reduce(
            (sum, s) => sum + (s.userAnalytics?.assessmentsCompleted || 0),
            0
        );

        // Risk breakdown
        const riskBreakdown = {
            high: students.filter((s) => s.userAnalytics?.currentRiskLevel === RiskLevel.HIGH).length,
            moderate: students.filter((s) => s.userAnalytics?.currentRiskLevel === RiskLevel.MODERATE).length,
            low: students.filter((s) => s.userAnalytics?.currentRiskLevel === RiskLevel.LOW).length,
            notAssessed: students.filter((s) => !s.userAnalytics?.currentRiskLevel).length,
        };

        // Engagement trends (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentActivity = await prisma.assessmentResult.groupBy({
            by: ['createdAt'],
            where: {
                user: {
                    schoolId,
                },
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            _count: true,
        });

        return {
            totalStudents,
            totalTeachers: teachers,
            activeStudents,
            totalStoriesCompleted,
            totalAssessmentsCompleted,
            riskBreakdown,
            engagementRate: activeStudents / totalStudents,
            averageStoriesPerStudent: totalStoriesCompleted / totalStudents,
            averageAssessmentsPerStudent: totalAssessmentsCompleted / totalStudents,
            recentActivity,
        };
    }

    /**
     * Generate progress report for a student
     */
    async generateStudentReport(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                userAnalytics: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const storyProgress = await prisma.storyProgress.findMany({
            where: { userId },
            include: {
                story: {
                    select: {
                        title: true,
                        category: true,
                        therapeuticGoals: true,
                    },
                },
            },
        });

        const assessmentResults = await prisma.assessmentResult.findMany({
            where: { userId },
            include: {
                assessment: {
                    select: {
                        title: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Calculate progress over time
        const riskLevelTrend = assessmentResults.map((r) => ({
            date: r.createdAt,
            riskLevel: r.riskLevel,
            score: r.totalScore,
            assessment: r.assessment.title,
        }));

        return {
            student: {
                name: user.name,
                email: user.email,
                grade: user.grade,
                age: user.age,
            },
            analytics: user.userAnalytics,
            storyProgress: {
                total: storyProgress.length,
                completed: storyProgress.filter((p) => p.completed).length,
                inProgress: storyProgress.filter((p) => !p.completed).length,
                details: storyProgress,
            },
            assessments: {
                total: assessmentResults.length,
                riskLevelTrend,
                currentRiskLevel: user.userAnalytics?.currentRiskLevel,
                lastAssessmentDate: user.userAnalytics?.lastAssessmentDate,
            },
            recommendations: this.generateRecommendations(user.userAnalytics, assessmentResults),
        };
    }

    /**
     * Generate personalized recommendations
     */
    private generateRecommendations(
        analytics: any,
        assessmentResults: any[]
    ): string[] {
        const recommendations: string[] = [];

        if (!analytics) {
            recommendations.push('Complete an initial assessment to establish baseline');
            return recommendations;
        }

        // Based on risk level
        if (analytics.currentRiskLevel === RiskLevel.HIGH) {
            recommendations.push('Immediate consultation with school counselor recommended');
            recommendations.push('Consider professional mental health screening');
        } else if (analytics.currentRiskLevel === RiskLevel.MODERATE) {
            recommendations.push('Regular check-ins with school counselor');
            recommendations.push('Explore anxiety management or mood regulation courses');
        }

        // Based on engagement
        if (analytics.storiesStarted > analytics.storiesCompleted * 2) {
            recommendations.push('Focus on completing started stories for better therapeutic benefit');
        }

        // Based on assessment frequency
        const daysSinceLastAssessment = analytics.lastAssessmentDate
            ? Math.floor((new Date().getTime() - new Date(analytics.lastAssessmentDate).getTime()) / (1000 * 60 * 60 * 24))
            : null;

        if (!daysSinceLastAssessment || daysSinceLastAssessment > 30) {
            recommendations.push('Complete a follow-up assessment to track progress');
        }

        return recommendations;
    }

    /**
     * Track engagement metrics
     */
    async trackEngagement(userId: string, activityType: 'story' | 'assessment', durationMinutes: number) {
        await prisma.userAnalytics.upsert({
            where: { userId },
            update: {
                totalTimeSpent: { increment: durationMinutes },
                lastActiveDate: new Date(),
            },
            create: {
                userId,
                totalTimeSpent: durationMinutes,
                lastActiveDate: new Date(),
            },
        });
    }
}

export const analyticsService = new AnalyticsService();
