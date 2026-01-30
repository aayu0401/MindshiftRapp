import { prisma } from '../prismaClient';
import { StoryCategory, AgeGroup, TherapeuticGoal, Prisma } from '@prisma/client';

export interface StoryFilters {
    category?: StoryCategory;
    ageGroup?: AgeGroup;
    therapeuticGoal?: TherapeuticGoal;
    published?: boolean;
    featured?: boolean;
    search?: string;
}

export interface CreateStoryData {
    title: string;
    author: string;
    excerpt: string;
    description?: string;
    category: StoryCategory;
    ageGroup: AgeGroup;
    therapeuticGoals: TherapeuticGoal[];
    imageUrl?: string;
    estimatedReadingTime?: number;
    published?: boolean;
    featured?: boolean;
}

export interface CreateChapterData {
    chapterNumber: number;
    title: string;
    sections: CreateSectionData[];
}

export interface CreateSectionData {
    sectionNumber: number;
    type: 'TEXT' | 'QUESTION' | 'REFLECTION' | 'ACTIVITY';
    content: string;
    questionId?: string;
}

export class StoryService {
    /**
     * Get all stories with optional filters
     */
    async getStories(filters: StoryFilters = {}) {
        const where: Prisma.StoryWhereInput = {};

        if (filters.category) where.category = filters.category;
        if (filters.ageGroup) where.ageGroup = filters.ageGroup;
        if (filters.published !== undefined) where.published = filters.published;
        if (filters.featured !== undefined) where.featured = filters.featured;

        if (filters.therapeuticGoal) {
            where.therapeuticGoals = {
                has: filters.therapeuticGoal,
            };
        }

        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { author: { contains: filters.search, mode: 'insensitive' } },
                { excerpt: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        const stories = await prisma.story.findMany({
            where,
            include: {
                chapters: {
                    orderBy: { chapterNumber: 'asc' },
                    select: {
                        id: true,
                        chapterNumber: true,
                        title: true,
                    },
                },
                assessments: {
                    where: { published: true },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                    },
                },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        return stories;
    }

    /**
     * Get a single story by ID with full details
     */
    async getStoryById(storyId: string, userId?: string) {
        const story = await prisma.story.findUnique({
            where: { id: storyId },
            include: {
                chapters: {
                    orderBy: { chapterNumber: 'asc' },
                    include: {
                        sections: {
                            orderBy: { sectionNumber: 'asc' },
                            include: {
                                question: {
                                    include: {
                                        options: {
                                            orderBy: { orderIndex: 'asc' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                assessments: {
                    where: { published: true },
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
                },
            },
        });

        if (!story) {
            throw new Error('Story not found');
        }

        // If userId provided, include progress
        let progress = null;
        if (userId) {
            progress = await prisma.storyProgress.findUnique({
                where: {
                    userId_storyId: {
                        userId,
                        storyId,
                    },
                },
            });
        }

        return { ...story, userProgress: progress };
    }

    /**
     * Create a new story with chapters and sections
     */
    async createStory(data: CreateStoryData, chapters: CreateChapterData[]) {
        const story = await prisma.story.create({
            data: {
                ...data,
                chapters: {
                    create: chapters.map((chapter) => ({
                        chapterNumber: chapter.chapterNumber,
                        title: chapter.title,
                        sections: {
                            create: chapter.sections.map((section) => ({
                                sectionNumber: section.sectionNumber,
                                type: section.type,
                                content: section.content,
                                questionId: section.questionId,
                            })),
                        },
                    })),
                },
            },
            include: {
                chapters: {
                    include: {
                        sections: true,
                    },
                },
            },
        });

        return story;
    }

    /**
     * Update story progress for a user
     */
    async updateProgress(
        userId: string,
        storyId: string,
        currentChapter: number,
        currentSection: number,
        completed: boolean = false
    ) {
        const progress = await prisma.storyProgress.upsert({
            where: {
                userId_storyId: {
                    userId,
                    storyId,
                },
            },
            update: {
                currentChapter,
                currentSection,
                completed,
                completedAt: completed ? new Date() : null,
                lastReadAt: new Date(),
            },
            create: {
                userId,
                storyId,
                currentChapter,
                currentSection,
                completed,
                completedAt: completed ? new Date() : null,
                lastReadAt: new Date(),
            },
        });

        // Update user analytics
        if (completed) {
            await prisma.userAnalytics.upsert({
                where: { userId },
                update: {
                    storiesCompleted: { increment: 1 },
                    lastActiveDate: new Date(),
                },
                create: {
                    userId,
                    storiesCompleted: 1,
                    lastActiveDate: new Date(),
                },
            });
        } else {
            // Just started
            const existingProgress = await prisma.storyProgress.count({
                where: { userId, storyId },
            });

            if (existingProgress === 1) {
                await prisma.userAnalytics.upsert({
                    where: { userId },
                    update: {
                        storiesStarted: { increment: 1 },
                        lastActiveDate: new Date(),
                    },
                    create: {
                        userId,
                        storiesStarted: 1,
                        lastActiveDate: new Date(),
                    },
                });
            }
        }

        return progress;
    }

    /**
     * Submit a response to a story question
     */
    async submitQuestionResponse(
        userId: string,
        questionId: string,
        response: {
            selectedOptionId?: string;
            scaleValue?: number;
            textResponse?: string;
        }
    ) {
        const questionResponse = await prisma.storyQuestionResponse.upsert({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
            update: {
                selectedOptionId: response.selectedOptionId,
                scaleValue: response.scaleValue,
                textResponse: response.textResponse,
            },
            create: {
                userId,
                questionId,
                selectedOptionId: response.selectedOptionId,
                scaleValue: response.scaleValue,
                textResponse: response.textResponse,
            },
        });

        return questionResponse;
    }

    /**
     * Get user's responses to story questions
     */
    async getUserStoryResponses(userId: string, storyId: string) {
        // Get all question IDs for this story
        const story = await prisma.story.findUnique({
            where: { id: storyId },
            include: {
                chapters: {
                    include: {
                        sections: {
                            where: {
                                questionId: { not: null },
                            },
                            select: {
                                questionId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!story) {
            throw new Error('Story not found');
        }

        const questionIds = story.chapters
            .flatMap((chapter) => chapter.sections)
            .map((section) => section.questionId)
            .filter((id): id is string => id !== null);

        const responses = await prisma.storyQuestionResponse.findMany({
            where: {
                userId,
                questionId: { in: questionIds },
            },
            include: {
                question: true,
            },
        });

        return responses;
    }

    /**
     * Delete a story (admin only)
     */
    async deleteStory(storyId: string) {
        await prisma.story.delete({
            where: { id: storyId },
        });
    }

    /**
     * Update story details
     */
    async updateStory(storyId: string, data: Partial<CreateStoryData>) {
        const story = await prisma.story.update({
            where: { id: storyId },
            data,
        });

        return story;
    }
}

export const storyService = new StoryService();
