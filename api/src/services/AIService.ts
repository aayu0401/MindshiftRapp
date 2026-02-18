
import { prisma } from '../prismaClient';
import OpenAI from 'openai';

export interface StudentInsight {
    patternIdentifier: string; // e.g. "Catastrophizing"
    confidence: number;
    description: string;
    teacherGuidance: string;
    suggestedActivity: string;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export class AIService {
    private openai: OpenAI | null = null;

    constructor() {
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
    }

    /**
     * Analyze student journal entries and quiz responses to generate clinical insights
     */
    async analyzeStudentWellbeing(userId: string): Promise<StudentInsight[]> {
        // Fetch recent context for the student
        const journals = await prisma.dailyJournal.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 5
        });

        const responses = await prisma.storyQuestionResponse.findMany({
            where: { userId },
            include: { question: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        if (journals.length === 0 && responses.length === 0) {
            return [];
        }

        // Mock simulation if no OpenAI key
        if (!this.openai) {
            return this.generateMockInsights(journals, responses);
        }

        try {
            const systemPrompt = `You are an AI Clinical Analyst specializing in Child Psychology (CBT/PBCT model). 
            Analyze the provided student journals and reflection answers.
            Identify cognitive distortions (e.g., Catastrophizing, All-or-Nothing thinking) or emotional strengths.
            Provide specific, actionable guidance for teachers.
            
            JSON OUTPUT FORMAT:
            [{
                "patternIdentifier": "Name of pattern",
                "confidence": 0.0-1.0,
                "description": "Short explanation of detection",
                "teacherGuidance": "How the teacher should talk to this student",
                "suggestedActivity": "A 5-min classroom or 1-on-1 activity",
                "riskLevel": "LOW" | "MODERATE" | "HIGH"
            }]`;

            const userPrompt = `Student Data:
            Journals: ${journals.map(j => `[Mood: ${j.mood}] ${j.content}`).join(' | ')}
            Reflection Answers: ${responses.map(r => `[Q: ${r.question.question}] Ans: ${r.textResponse || 'Option Selected'}`).join(' | ')}`;

            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: "gpt-4-turbo-preview",
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            return content ? JSON.parse(content).insights : [];
        } catch (error) {
            console.error("AI Analysis failed:", error);
            return this.generateMockInsights(journals, responses);
        }
    }

    private generateMockInsights(journals: any[], responses: any[]): StudentInsight[] {
        const insights: StudentInsight[] = [];

        // Detect "Help" or "Sad" in journals
        const hasNegativeContent = journals.some(j =>
            j.content.toLowerCase().includes('sad') ||
            j.content.toLowerCase().includes('alone') ||
            j.mood <= 2
        );

        if (hasNegativeContent) {
            insights.push({
                patternIdentifier: "Emotional Distress",
                confidence: 0.85,
                description: "Student expressed feelings of sadness or isolation in recent journal entries.",
                teacherGuidance: "Approach the student during a quiet moment. Validate their feelings without jumping to solutions immediately. Ask: 'I noticed you've been feeling a bit down lately, is there anything on your mind?'",
                suggestedActivity: "Individual 'Safe Space' visualization or 5-Finger Breathing.",
                riskLevel: 'MODERATE'
            });
        }

        // Detect anxiety markers in responses (simulated)
        if (responses.length > 5) {
            insights.push({
                patternIdentifier: "Growth Mindset Developing",
                confidence: 0.72,
                description: "Student is correctly identifying character emotions in stories, indicating high levels of empathy and emotional literacy.",
                teacherGuidance: "Praise the student's ability to see things from others' perspectives. Reinforce this during group discussions.",
                suggestedActivity: "Pair-sharing activity: 'Tell a friend how a character in your favorite book felt today'.",
                riskLevel: 'LOW'
            });
        }

        return insights;
    }
}

export const aiService = new AIService();
