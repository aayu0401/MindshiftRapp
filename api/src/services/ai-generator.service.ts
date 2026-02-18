import { prisma } from '../prismaClient';
import { AgeGroup, StoryCategory, TherapeuticGoal, GenerationStatus } from '@prisma/client';
import OpenAI from 'openai';
import { Response } from 'express';

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
    /**
     * Generate a therapeutic story using AI
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

            let generatedContent: GeneratedStoryContent;

            // Check if OpenAI API key is available
            if (process.env.OPENAI_API_KEY) {
                try {
                    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

                    const systemPrompt = this.buildSystemPrompt(template);
                    const userPrompt = this.buildUserPrompt(request);

                    console.log(`Generating story for ${request.category} (${request.ageGroup})...`);

                    const completion = await openai.chat.completions.create({
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        model: "gpt-4-1106-preview", // Uses JSON mode reliable model
                        response_format: { type: "json_object" },
                        temperature: 0.7,
                    });

                    const contentStr = completion.choices[0].message.content;
                    if (!contentStr) {
                        throw new Error("Empty response from AI");
                    }

                    generatedContent = JSON.parse(contentStr) as GeneratedStoryContent;

                    // Basic validation
                    if (!generatedContent.chapters || !Array.isArray(generatedContent.chapters)) {
                        throw new Error("Invalid format: missing chapters array");
                    }
                } catch (apiError: any) {
                    console.error("OpenAI API Failed:", apiError.message);
                    console.warn("Falling back to mock generation...");
                    generatedContent = this.generateSampleStory(request);
                }
            } else {
                console.warn("OPENAI_API_KEY not set. Using mock generation.");
                generatedContent = this.generateSampleStory(request);
            }

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
            console.error("Story generation failed completely:", error);
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
     * Generate a therapeutic story using AI with Streaming (SSE)
     */
    async generateStoryStream(request: GenerateStoryRequest, res: Response): Promise<void> {
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

        // Send initial event with ID
        res.write(`event: start\ndata: ${JSON.stringify({ generationId: generation.id })}\n\n`);

        let fullContent = '';

        try {
            // Get template if provided
            let template = null;
            if (request.templateId) {
                template = await prisma.aIStoryTemplate.findUnique({
                    where: { id: request.templateId },
                });
            }

            if (!process.env.OPENAI_API_KEY) {
                // Mock streaming for demo
                const sample = this.generateSampleStory(request);
                const sampleStr = JSON.stringify(sample);
                const chunks = sampleStr.match(/.{1,20}/g) || [];

                for (const chunk of chunks) {
                    await new Promise(r => setTimeout(r, 100)); // Simulate network delay
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                    fullContent += chunk;
                }

                res.write(`event: done\ndata: {}\n\n`);
                res.end();
            } else {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const systemPrompt = this.buildSystemPrompt(template);
                const userPrompt = this.buildUserPrompt(request);

                const stream = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    model: "gpt-4-1106-preview",
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                    stream: true,
                });

                for await (const part of stream) {
                    const chunk = part.choices[0]?.delta?.content || '';
                    if (chunk) {
                        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                        fullContent += chunk;
                    }
                }

                res.write(`event: done\ndata: {}\n\n`);
                res.end();
            }

            // Save completed content
            try {
                const validJson = JSON.parse(fullContent) as GeneratedStoryContent;
                await prisma.aIGeneratedStory.update({
                    where: { id: generation.id },
                    data: {
                        title: validJson.title,
                        content: validJson as any,
                        status: GenerationStatus.COMPLETED,
                    },
                });
            } catch (jsonError) {
                console.error("Failed to parse streamed JSON:", jsonError);
                await prisma.aIGeneratedStory.update({
                    where: { id: generation.id },
                    data: {
                        status: GenerationStatus.FAILED,
                    },
                });
            }

        } catch (error: any) {
            console.error("Stream generation failed:", error);
            res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
            res.end();

            await prisma.aIGeneratedStory.update({
                where: { id: generation.id },
                data: { status: GenerationStatus.FAILED },
            });
        }
    }

    /**
     * Build System Prompt to enforce structure and clinical depth
     */
    private buildSystemPrompt(template: any): string {
        const baseSystem = template?.systemPrompt ||
            'You are an expert Child Psychologist and Narrative Therapist specializing in Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT) for children.';

        return `${baseSystem}

You must create a highly realistic, therapeutically grounded story that helps children process emotions and learn specific coping strategies.
        
OUTPUT FORMAT:
You must output a valid JSON object exactly matching this structure:
{
    "title": "Story Title",
    "author": "AI Generated",
    "excerpt": "A 1-2 sentence summary",
    "description": "A full paragraph description including the specific therapeutic technique used.",
    "chapters": [
        {
            "chapterNumber": 1,
            "title": "The Situation (Validation)",
            "sections": [
                {
                    "sectionNumber": 1,
                    "type": "TEXT",
                    "content": "Introduce the character and their specific emotional struggle. Validate the feeling. Do not fix it yet."
                },
                {
                    "sectionNumber": 2,
                    "type": "QUESTION",
                    "content": "Pause for reflection",
                    "question": {
                        "question": "A question to help the child identify this feeling in themselves.",
                        "type": "REFLECTION",
                        "therapeuticPurpose": "Emotion Identification"
                    }
                }
            ]
        },
        {
            "chapterNumber": 2,
            "title": "The Challenge & Tool",
            "sections": [
                {
                    "sectionNumber": 1,
                    "type": "TEXT",
                    "content": "The character faces a trigger. They try to cope but struggle. Then, a guide or inner voice introduces a SPECIFIC technique (e.g., Box Breathing, Reframing, Grounding)."
                },
                {
                    "sectionNumber": 2,
                    "type": "QUESTION",
                    "content": "Practice the tool",
                    "question": {
                        "question": "A question asking the child to try the technique with the character.",
                        "type": "ACTIVITY",
                        "therapeuticPurpose": "Skill Acquisition"
                    }
                }
            ]
        },
        {
            "chapterNumber": 3,
            "title": "Resolution (Growth)",
            "sections": [
                {
                    "sectionNumber": 1,
                    "type": "TEXT",
                    "content": "The character applies the tool. The outcome is positive but realistic (not magic). They feel 'better' or 'capable', not necessarily 'perfect'."
                },
                {
                    "sectionNumber": 2,
                    "type": "QUESTION",
                    "content": "Application",
                    "question": {
                        "question": "How can you use this tool in your life?",
                        "type": "DISCUSSION",
                        "therapeuticPurpose": "Generalization of Skill"
                    }
                }
            ]
        }
    ]
}

THERAPEUTIC GUIDELINES:
1. **Realism**: The struggle must feel real, not trivial. The character should not "snap out of it" instantly.
2. **Technique-Focused**: You MUST teach a specific, nameable coping mechanism (e.g. "The Worry Jar", "5-Finger Breathing").
3. **Show, Don't Tell**: Describe the physical sensation of the emotion (e.g., "butterflies in the tummy", "hot face").
4. **Age Appropriateness**: Use language suitable for the target age group.
5. **JSON Only**: The output must be pure, valid JSON.`;
    }

    /**
     * Build User Prompt based on criteria and therapeutic principles
     */
    private buildUserPrompt(request: GenerateStoryRequest): string {
        const ageGroupText = this.getAgeGroupText(request.ageGroup);
        const categoryText = this.getCategoryText(request.category);
        const goalsText = request.therapeuticGoals.map((g) => this.getGoalText(g)).join(', ');

        let prompt = `Create a realistic therapeutic story tailored for:
- Child Age: ${ageGroupText}
- Core Issue: ${categoryText}
- Therapeutic Goals: ${goalsText}

REQUIREMENTS:
1. Character: Create a relatable protagonist who struggles with ${categoryText} in a way that feels authentic to a ${ageGroupText} old.
2. The Struggle: Describe the physical and emotional symptoms of ${categoryText} clearly.
3. The Tool: Introduce a concrete, actionable tool relative to ${goalsText} (e.g. mindfulness, cognitive reframing, graduated exposure).
4. The Outcome: The character should succeed through effort and using the tool, building resilience.

Tone: Compassionate, validating, empowering.`;

        if (request.customPrompt) {
            prompt += `\n\nSpecific User Scenario/Details: ${request.customPrompt}`;
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
                            create: chapter.sections.map((section) => ({
                                sectionNumber: section.sectionNumber,
                                type: section.type,
                                content: section.content,
                                question: section.question ? {
                                    create: {
                                        question: section.question.question,
                                        type: section.question.type,
                                        therapeuticPurpose: section.question.therapeuticPurpose
                                    }
                                } : undefined
                            })),
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

    /**
     * General purpose therapeutic chat
     */
    async chat(message: string, userRole: string, history: any[] = []): Promise<string> {
        if (!process.env.OPENAI_API_KEY) {
            return "I'm in offline mode right now, but I'm here to support you! How can I help?";
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const systemPrompts: Record<string, string> = {
            'STUDENT': 'You are ZenBot, a friendly learning companion for children. You are kind, patient, and use simple language. Your goal is to support emotional wellbeing and encourage curiosity. Keep responses short and engaging.',
            'TEACHER': 'You are Mindshiftr-AI, a professional assistant for educators. You behave like ChatGPT - highly capable, analytical, and professional. You provide evidence-based insights on student wellbeing and classroom management.',
            'SCHOOL_ADMIN': 'You are Mindshiftr-AI, a strategic advisor for school leaders. You behave like ChatGPT - professional, data-driven, and institutional. You help with school-wide wellbeing strategies and administrative efficiency.',
            'PARENT': 'You are Mindshiftr-AI, a supportive companion for parents. You are compassionate, trust-worthy, and provide calm, evidence-based guidance on child development and emotional support.',
        };

        const systemPrompt = systemPrompts[userRole] || systemPrompts['STUDENT'];

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...history.slice(-5), // Keep last 5 messages for context
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            messages,
            model: "gpt-4-1106-preview",
            temperature: 0.7,
            max_tokens: 500,
        });

        return completion.choices[0].message.content || "I'm having trouble thinking of a response. Can you try again?";
    }

    private getGoalText(goal: TherapeuticGoal): string {
        return goal.replace(/_/g, ' ').toLowerCase();
    }
}

export const aiGeneratorService = new AIGeneratorService();
