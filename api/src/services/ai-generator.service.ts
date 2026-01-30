import { prisma } from '../prismaClient';
import { AgeGroup, StoryCategory, TherapeuticGoal, GenerationStatus } from '@prisma/client';

export interface GenerateStoryRequest {
    userId: string;
    ageGroup: AgeGroup;
    category: StoryCategory;
    therapeuticGoals: TherapeuticGoal[];
    customPrompt?: string;
    templateId?: string;
}

export interface GeneratedStoryContent {
    title: string;
    author: string;
    excerpt: string;
    description: string;
    chapters: Array<{
        chapterNumber: number;
        title: string;
        sections: Array<{
            sectionNumber: number;
            type: 'TEXT' | 'QUESTION';
            content: string;
            question?: {
                question: string;
                type: 'REFLECTION' | 'DISCUSSION' | 'ACTIVITY';
                therapeuticPurpose: string;
            };
        }>;
    }>;
}

export class AIGeneratorService {
    /**
     * Generate a therapeutic story using AI
     * Note: This is a placeholder implementation. In production, integrate with OpenAI or similar API
     */
    async generateStory(request: GenerateStoryRequest): Promise<string> {
        // Create pending generation record
        const generation = await prisma.aIGeneratedStory.create({
            data: {
                generatedBy: request.userId,
                templateId: request.templateId,
                ageGroup: request.ageGroup,
                category: request.category,
                therapeuticGoals: request.therapeuticGoals,
                customPrompt: request.customPrompt,
                status: GenerationStatus.GENERATING,
            },
        });

        try {
            // Get template if provided
            let template = null;
            if (request.templateId) {
                template = await prisma.aIStoryTemplate.findUnique({
                    where: { id: request.templateId },
                });
            }

            // Build AI prompt
            const prompt = this.buildPrompt(request, template);

            // TODO: Call OpenAI API here
            // For now, generate a sample story structure
            const generatedContent = this.generateSampleStory(request);

            // Update generation record with content
            await prisma.aIGeneratedStory.update({
                where: { id: generation.id },
                data: {
                    title: generatedContent.title,
                    content: generatedContent as any,
                    status: GenerationStatus.COMPLETED,
                },
            });

            return generation.id;
        } catch (error) {
            // Mark as failed
            await prisma.aIGeneratedStory.update({
                where: { id: generation.id },
                data: {
                    status: GenerationStatus.FAILED,
                },
            });
            throw error;
        }
    }

    /**
     * Build AI prompt based on criteria
     */
    private buildPrompt(request: GenerateStoryRequest, template: any): string {
        const ageGroupText = this.getAgeGroupText(request.ageGroup);
        const categoryText = this.getCategoryText(request.category);
        const goalsText = request.therapeuticGoals.map((g) => this.getGoalText(g)).join(', ');

        let prompt = template?.systemPrompt || 'You are a child psychologist and therapeutic storyteller specializing in CBT-based mental health stories for children.';

        prompt += `\n\nCreate a therapeutic story with the following criteria:
- Age Group: ${ageGroupText}
- Category: ${categoryText}
- Therapeutic Goals: ${goalsText}
- Story should include 2-3 chapters
- Each chapter should have 4-5 sections alternating between narrative text and reflection questions
- Questions should be based on CBT/PBCT principles
- Language should be age-appropriate and engaging
- Include a positive, hopeful resolution`;

        if (request.customPrompt) {
            prompt += `\n\nAdditional requirements: ${request.customPrompt}`;
        }

        return prompt;
    }

    /**
     * Generate sample story (placeholder for AI generation)
     */
    private generateSampleStory(request: GenerateStoryRequest): GeneratedStoryContent {
        const ageGroupText = this.getAgeGroupText(request.ageGroup);
        const categoryText = this.getCategoryText(request.category);

        return {
            title: `The Journey of Discovery`,
            author: 'AI Generated',
            excerpt: `A therapeutic story about ${categoryText.toLowerCase()} for children aged ${ageGroupText}`,
            description: `This AI-generated story helps children understand and manage ${categoryText.toLowerCase()} through engaging narrative and therapeutic questions.`,
            chapters: [
                {
                    chapterNumber: 1,
                    title: 'The Beginning',
                    sections: [
                        {
                            sectionNumber: 1,
                            type: 'TEXT',
                            content: 'Once upon a time, in a peaceful village, there lived a young child who was about to discover something important about themselves...',
                        },
                        {
                            sectionNumber: 2,
                            type: 'QUESTION',
                            content: 'Reflection Time',
                            question: {
                                question: 'Have you ever discovered something new about yourself? How did it make you feel?',
                                type: 'REFLECTION',
                                therapeuticPurpose: 'Encourages self-awareness and emotional recognition',
                            },
                        },
                        {
                            sectionNumber: 3,
                            type: 'TEXT',
                            content: 'The child noticed that sometimes they felt different from others, and that was okay...',
                        },
                    ],
                },
                {
                    chapterNumber: 2,
                    title: 'The Challenge',
                    sections: [
                        {
                            sectionNumber: 1,
                            type: 'TEXT',
                            content: 'One day, the child faced a situation that made them feel uncomfortable. But they remembered what they had learned...',
                        },
                        {
                            sectionNumber: 2,
                            type: 'QUESTION',
                            content: 'Think About It',
                            question: {
                                question: 'What strategies do you use when you face a difficult situation?',
                                type: 'DISCUSSION',
                                therapeuticPurpose: 'Identifies coping mechanisms and problem-solving skills',
                            },
                        },
                        {
                            sectionNumber: 3,
                            type: 'TEXT',
                            content: 'With courage and the support of friends, the child found a way through the challenge and grew stronger.',
                        },
                    ],
                },
            ],
        };
    }

    /**
     * Get pending stories for approval
     */
    async getPendingApproval(userId?: string) {
        const where: any = {
            status: GenerationStatus.COMPLETED,
        };

        if (userId) {
            where.generatedBy = userId;
        }

        const stories = await prisma.aIGeneratedStory.findMany({
            where,
            include: {
                generator: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                template: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return stories;
    }

    /**
     * Approve and publish AI-generated story
     */
    async approveStory(generationId: string, reviewerId: string, reviewNotes?: string) {
        const generation = await prisma.aIGeneratedStory.findUnique({
            where: { id: generationId },
        });

        if (!generation || !generation.content) {
            throw new Error('Generation not found or incomplete');
        }

        const content = generation.content as any as GeneratedStoryContent;

        // Create actual story from generated content
        const story = await prisma.story.create({
            data: {
                title: generation.title || content.title,
                author: content.author,
                excerpt: content.excerpt,
                description: content.description,
                category: generation.category,
                ageGroup: generation.ageGroup,
                therapeuticGoals: generation.therapeuticGoals,
                published: true,
                chapters: {
                    create: content.chapters.map((chapter) => ({
                        chapterNumber: chapter.chapterNumber,
                        title: chapter.title,
                        sections: {
                            create: chapter.sections.map((section) => {
                                const sectionData: any = {
                                    sectionNumber: section.sectionNumber,
                                    type: section.type,
                                    content: section.content,
                                };

                                // Create question if present
                                if (section.question) {
                                    // This would need to be handled separately in a real implementation
                                    // For now, we'll just include the question text in content
                                }

                                return sectionData;
                            }),
                        },
                    })),
                },
            },
        });

        // Update generation record
        await prisma.aIGeneratedStory.update({
            where: { id: generationId },
            data: {
                status: GenerationStatus.APPROVED,
                reviewedBy: reviewerId,
                reviewNotes,
                approvedAt: new Date(),
                publishedStoryId: story.id,
            },
        });

        return story;
    }

    /**
     * Reject AI-generated story
     */
    async rejectStory(generationId: string, reviewerId: string, reviewNotes: string) {
        await prisma.aIGeneratedStory.update({
            where: { id: generationId },
            data: {
                status: GenerationStatus.REJECTED,
                reviewedBy: reviewerId,
                reviewNotes,
            },
        });
    }

    /**
     * Get all AI story templates
     */
    async getTemplates() {
        const templates = await prisma.aIStoryTemplate.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        });

        return templates;
    }

    /**
     * Create a new template (admin only)
     */
    async createTemplate(data: {
        name: string;
        description: string;
        ageGroup: AgeGroup;
        category: StoryCategory;
        therapeuticGoals: TherapeuticGoal[];
        systemPrompt: string;
        userPromptTemplate: string;
        targetChapters?: number;
        targetSectionsPerChapter?: number;
        targetQuestionsPerChapter?: number;
    }) {
        const template = await prisma.aIStoryTemplate.create({
            data,
        });

        return template;
    }

    /**
     * Helper methods for text conversion
     */
    private getAgeGroupText(ageGroup: AgeGroup): string {
        const map: Record<AgeGroup, string> = {
            AGE_6_8: '6-8 years',
            AGE_8_10: '8-10 years',
            AGE_10_12: '10-12 years',
            AGE_12_14: '12-14 years',
            AGE_14_16: '14-16 years',
            AGE_16_18: '16-18 years',
        };
        return map[ageGroup];
    }

    private getCategoryText(category: StoryCategory): string {
        return category.replace(/_/g, ' ').toLowerCase();
    }

    private getGoalText(goal: TherapeuticGoal): string {
        return goal.replace(/_/g, ' ').toLowerCase();
    }
}

export const aiGeneratorService = new AIGeneratorService();
