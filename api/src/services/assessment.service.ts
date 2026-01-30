import { prisma } from '../prismaClient';
import { AssessmentType, AgeGroup, RiskLevel, Prisma } from '@prisma/client';

export interface AssessmentFilters {
    type?: AssessmentType;
    ageGroup?: AgeGroup;
    storyId?: string;
    published?: boolean;
}

export interface SubmitAssessmentData {
    userId: string;
    assessmentId: string;
    responses: Record<string, number>; // questionId -> scaleValue or optionIndex
}

export class AssessmentService {
    /**
     * Get all assessments with filters
     */
    async getAssessments(filters: AssessmentFilters = {}) {
        const where: Prisma.AssessmentWhereInput = {};

        if (filters.type) where.type = filters.type;
        if (filters.ageGroup) where.ageGroup = filters.ageGroup;
        if (filters.storyId) where.storyId = filters.storyId;
        if (filters.published !== undefined) where.published = filters.published;

        const assessments = await prisma.assessment.findMany({
            where,
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                questions: {
                    orderBy: { questionNumber: 'asc' },
                    include: {
                        options: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return assessments;
    }

    /**
     * Get a single assessment by ID
     */
    async getAssessmentById(assessmentId: string) {
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                story: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                    },
                },
                questions: {
                    orderBy: { questionNumber: 'asc' },
                    include: {
                        options: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
        });

        if (!assessment) {
            throw new Error('Assessment not found');
        }

        return assessment;
    }

    /**
     * Submit assessment responses and calculate results
     */
    async submitAssessment(data: SubmitAssessmentData) {
        const { userId, assessmentId, responses } = data;

        // Get assessment details
        const assessment = await this.getAssessmentById(assessmentId);

        // Create assessment response
        const assessmentResponse = await prisma.assessmentResponse.create({
            data: {
                userId,
                assessmentId,
                completedAt: new Date(),
            },
        });

        // Save individual question responses
        const questionResponses = [];
        for (const [questionId, value] of Object.entries(responses)) {
            const response = await prisma.assessmentQuestionResponse.create({
                data: {
                    responseId: assessmentResponse.id,
                    questionId,
                    scaleValue: value,
                },
            });
            questionResponses.push(response);
        }

        // Calculate total score
        const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);

        // Determine risk level
        let riskLevel: RiskLevel;
        let recommendations: string[];
        let requiresScreening: boolean;

        if (totalScore >= assessment.highRiskMin && totalScore <= assessment.highRiskMax) {
            riskLevel = RiskLevel.HIGH;
            recommendations = [assessment.highRiskRecommendation];
            requiresScreening = true;
        } else if (totalScore >= assessment.moderateRiskMin && totalScore <= assessment.moderateRiskMax) {
            riskLevel = RiskLevel.MODERATE;
            recommendations = [assessment.moderateRiskRecommendation];
            requiresScreening = false;
        } else {
            riskLevel = RiskLevel.LOW;
            recommendations = [assessment.lowRiskRecommendation];
            requiresScreening = false;
        }

        // Create assessment result
        const result = await prisma.assessmentResult.create({
            data: {
                userId,
                assessmentId,
                responseId: assessmentResponse.id,
                totalScore,
                riskLevel,
                recommendations,
                requiresScreening,
            },
        });

        // Update user analytics
        await this.updateUserAnalytics(userId, riskLevel);

        return {
            result,
            assessment: {
                id: assessment.id,
                title: assessment.title,
                type: assessment.type,
            },
        };
    }

    /**
     * Update user analytics based on assessment result
     */
    private async updateUserAnalytics(userId: string, riskLevel: RiskLevel) {
        const updateData: Prisma.UserAnalyticsUpdateInput = {
            assessmentsCompleted: { increment: 1 },
            lastAssessmentDate: new Date(),
            currentRiskLevel: riskLevel,
            lastActiveDate: new Date(),
        };

        if (riskLevel === RiskLevel.HIGH) {
            updateData.highRiskCount = { increment: 1 };
        } else if (riskLevel === RiskLevel.MODERATE) {
            updateData.moderateRiskCount = { increment: 1 };
        } else {
            updateData.lowRiskCount = { increment: 1 };
        }

        await prisma.userAnalytics.upsert({
            where: { userId },
            update: updateData,
            create: {
                userId,
                assessmentsCompleted: 1,
                lastAssessmentDate: new Date(),
                currentRiskLevel: riskLevel,
                highRiskCount: riskLevel === RiskLevel.HIGH ? 1 : 0,
                moderateRiskCount: riskLevel === RiskLevel.MODERATE ? 1 : 0,
                lowRiskCount: riskLevel === RiskLevel.LOW ? 1 : 0,
                lastActiveDate: new Date(),
            },
        });
    }

    /**
     * Get assessment results for a user
     */
    async getUserResults(userId: string, assessmentId?: string) {
        const where: Prisma.AssessmentResultWhereInput = { userId };
        if (assessmentId) where.assessmentId = assessmentId;

        const results = await prisma.assessmentResult.findMany({
            where,
            include: {
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return results;
    }

    /**
     * Get latest assessment result for a user
     */
    async getLatestResult(userId: string) {
        const result = await prisma.assessmentResult.findFirst({
            where: { userId },
            include: {
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return result;
    }

    /**
     * Get assessment result by ID
     */
    async getResultById(resultId: string) {
        const result = await prisma.assessmentResult.findUnique({
            where: { id: resultId },
            include: {
                assessment: {
                    include: {
                        questions: {
                            orderBy: { questionNumber: 'asc' },
                        },
                    },
                },
                response: {
                    include: {
                        questionResponses: {
                            include: {
                                question: true,
                            },
                        },
                    },
                },
            },
        });

        if (!result) {
            throw new Error('Assessment result not found');
        }

        return result;
    }

    /**
     * Get assessments linked to a specific story
     */
    async getStoryAssessments(storyId: string) {
        const assessments = await prisma.assessment.findMany({
            where: {
                storyId,
                published: true,
            },
            include: {
                questions: {
                    orderBy: { questionNumber: 'asc' },
                    include: {
                        options: {
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                },
            },
        });

        return assessments;
    }

    /**
     * Create a new assessment (teacher/admin only)
     */
    async createAssessment(data: {
        title: string;
        type: AssessmentType;
        description: string;
        ageGroup: AgeGroup;
        storyId?: string;
        scoringGuide: {
            lowRisk: { min: number; max: number; description: string; recommendation: string };
            moderateRisk: { min: number; max: number; description: string; recommendation: string };
            highRisk: { min: number; max: number; description: string; recommendation: string };
        };
        questions: Array<{
            questionNumber: number;
            question: string;
            type: 'SCALE' | 'MULTIPLE_CHOICE';
            scaleMin?: number;
            scaleMax?: number;
            scaleMinLabel?: string;
            scaleMaxLabel?: string;
            options?: Array<{
                optionText: string;
                orderIndex: number;
                scoreValue: number;
            }>;
        }>;
    }) {
        const assessment = await prisma.assessment.create({
            data: {
                title: data.title,
                type: data.type,
                description: data.description,
                ageGroup: data.ageGroup,
                storyId: data.storyId,
                lowRiskMin: data.scoringGuide.lowRisk.min,
                lowRiskMax: data.scoringGuide.lowRisk.max,
                lowRiskDescription: data.scoringGuide.lowRisk.description,
                lowRiskRecommendation: data.scoringGuide.lowRisk.recommendation,
                moderateRiskMin: data.scoringGuide.moderateRisk.min,
                moderateRiskMax: data.scoringGuide.moderateRisk.max,
                moderateRiskDescription: data.scoringGuide.moderateRisk.description,
                moderateRiskRecommendation: data.scoringGuide.moderateRisk.recommendation,
                highRiskMin: data.scoringGuide.highRisk.min,
                highRiskMax: data.scoringGuide.highRisk.max,
                highRiskDescription: data.scoringGuide.highRisk.description,
                highRiskRecommendation: data.scoringGuide.highRisk.recommendation,
                published: false,
                questions: {
                    create: data.questions.map((q) => ({
                        questionNumber: q.questionNumber,
                        question: q.question,
                        type: q.type,
                        scaleMin: q.scaleMin,
                        scaleMax: q.scaleMax,
                        scaleMinLabel: q.scaleMinLabel,
                        scaleMaxLabel: q.scaleMaxLabel,
                        options: q.options
                            ? {
                                create: q.options,
                            }
                            : undefined,
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });

        return assessment;
    }
}

export const assessmentService = new AssessmentService();
