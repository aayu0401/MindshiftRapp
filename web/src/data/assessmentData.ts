export interface Assessment {
    id: string;
    title: string;
    type: 'CBT' | 'PBCT' | 'Screening';
    description: string;
    ageGroup: string;
    questions: AssessmentQuestion[];
    scoringGuide: ScoringGuide;
}

export interface AssessmentQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'scale' | 'yes-no';
    options?: string[];
    scaleRange?: { min: number; max: number; minLabel: string; maxLabel: string };
}

export interface ScoringGuide {
    lowRisk: { min: number; max: number; description: string; recommendation: string };
    moderateRisk: { min: number; max: number; description: string; recommendation: string };
    highRisk: { min: number; max: number; description: string; recommendation: string };
}

export interface AssessmentResult {
    assessmentId: string;
    studentId: string;
    studentName: string;
    score: number;
    riskLevel: 'low' | 'moderate' | 'high';
    completedAt: Date;
    responses: Record<string, any>;
    recommendations: string[];
    requiresScreening: boolean;
}

// CBT-Based Assessments
export const cbtAssessments: Assessment[] = [
    {
        id: 'cbt-anxiety-1',
        title: 'Anxiety Screening - Story Based',
        type: 'CBT',
        description: 'Assess anxiety levels through story-based scenarios using CBT principles',
        ageGroup: '8-14',
        questions: [
            {
                id: 'q1',
                question: 'In the story, when the character faced a new situation, how often do you feel similar worries?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Always' }
            },
            {
                id: 'q2',
                question: 'Like the character, do you ever feel your heart beating fast or feel shaky when worried?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Very Often' }
            },
            {
                id: 'q3',
                question: 'The character had worried thoughts. How often do worried thoughts stop you from doing things you want to do?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Always' }
            },
            {
                id: 'q4',
                question: 'Do you worry about things before they happen, like the character did?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Always' }
            },
            {
                id: 'q5',
                question: 'When you feel worried, can you calm yourself down using strategies (like deep breathing)?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Always', maxLabel: 'Never' }
            },
            {
                id: 'q6',
                question: 'Do you avoid situations because they make you feel anxious?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Always' }
            },
            {
                id: 'q7',
                question: 'How often do you have trouble sleeping because of worries?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Very Often' }
            },
            {
                id: 'q8',
                question: 'Can you talk to someone when you feel worried?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Always', maxLabel: 'Never' }
            }
        ],
        scoringGuide: {
            lowRisk: {
                min: 0,
                max: 10,
                description: 'Low anxiety levels - typical developmental worries',
                recommendation: 'Continue with regular mental health literacy activities'
            },
            moderateRisk: {
                min: 11,
                max: 20,
                description: 'Moderate anxiety - may benefit from additional support',
                recommendation: 'Recommend school counselor check-in and anxiety management course'
            },
            highRisk: {
                min: 21,
                max: 32,
                description: 'High anxiety levels - requires professional assessment',
                recommendation: 'URGENT: Refer to school psychologist or mental health professional for screening'
            }
        }
    },
    {
        id: 'cbt-mood-1',
        title: 'Mood and Depression Screening',
        type: 'CBT',
        description: 'Assess mood patterns and potential depression indicators',
        ageGroup: '10-18',
        questions: [
            {
                id: 'q1',
                question: 'In the past two weeks, how often have you felt sad or down?',
                type: 'scale',
                scaleRange: { min: 0, max: 3, minLabel: 'Not at all', maxLabel: 'Nearly every day' }
            },
            {
                id: 'q2',
                question: 'Have you lost interest in activities you used to enjoy?',
                type: 'scale',
                scaleRange: { min: 0, max: 3, minLabel: 'Not at all', maxLabel: 'Very much' }
            },
            {
                id: 'q3',
                question: 'Do you feel tired or have little energy most days?',
                type: 'scale',
                scaleRange: { min: 0, max: 3, minLabel: 'Not at all', maxLabel: 'Nearly every day' }
            },
            {
                id: 'q4',
                question: 'Have you had trouble concentrating on schoolwork or other activities?',
                type: 'scale',
                scaleRange: { min: 0, max: 3, minLabel: 'Not at all', maxLabel: 'Very much' }
            },
            {
                id: 'q5',
                question: 'Do you feel bad about yourself or that you have let others down?',
                type: 'scale',
                scaleRange: { min: 0, max: 3, minLabel: 'Not at all', maxLabel: 'Very much' }
            },
            {
                id: 'q6',
                question: 'Have you had changes in your appetite or sleep patterns?',
                type: 'scale',
                scaleRange: { min: 0, max: 3, minLabel: 'Not at all', maxLabel: 'Very much' }
            }
        ],
        scoringGuide: {
            lowRisk: {
                min: 0,
                max: 6,
                description: 'Minimal mood concerns',
                recommendation: 'Continue regular wellbeing activities'
            },
            moderateRisk: {
                min: 7,
                max: 12,
                description: 'Mild to moderate mood concerns',
                recommendation: 'Recommend counselor consultation and mood management resources'
            },
            highRisk: {
                min: 13,
                max: 18,
                description: 'Significant mood concerns - possible depression',
                recommendation: 'URGENT: Immediate referral to mental health professional required'
            }
        }
    }
];

// PBCT (Problem-Based Cognitive Therapy) Assessments
export const pbctAssessments: Assessment[] = [
    {
        id: 'pbct-social-1',
        title: 'Social Skills and Peer Relationships',
        type: 'PBCT',
        description: 'Assess social functioning and peer relationship challenges',
        ageGroup: '8-14',
        questions: [
            {
                id: 'q1',
                question: 'How easy is it for you to make new friends?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Very easy', maxLabel: 'Very difficult' }
            },
            {
                id: 'q2',
                question: 'Do you feel left out or excluded by other students?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Very often' }
            },
            {
                id: 'q3',
                question: 'How comfortable do you feel talking to classmates?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Very comfortable', maxLabel: 'Very uncomfortable' }
            },
            {
                id: 'q4',
                question: 'Do you have conflicts or arguments with friends?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Rarely', maxLabel: 'Very often' }
            },
            {
                id: 'q5',
                question: 'Can you understand how others are feeling?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Always', maxLabel: 'Never' }
            }
        ],
        scoringGuide: {
            lowRisk: {
                min: 0,
                max: 7,
                description: 'Good social functioning',
                recommendation: 'Continue social skills development activities'
            },
            moderateRisk: {
                min: 8,
                max: 14,
                description: 'Some social difficulties',
                recommendation: 'Recommend social skills group or friendship course'
            },
            highRisk: {
                min: 15,
                max: 20,
                description: 'Significant social challenges',
                recommendation: 'Refer to counselor for social skills assessment and support'
            }
        }
    },
    {
        id: 'pbct-behavior-1',
        title: 'Behavioral and Emotional Regulation',
        type: 'PBCT',
        description: 'Assess self-regulation and behavioral concerns',
        ageGroup: '6-12',
        questions: [
            {
                id: 'q1',
                question: 'How often do you feel angry or frustrated?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Rarely', maxLabel: 'Very often' }
            },
            {
                id: 'q2',
                question: 'Can you calm down when you are upset?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Always', maxLabel: 'Never' }
            },
            {
                id: 'q3',
                question: 'Do you have trouble following rules or instructions?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Never', maxLabel: 'Very often' }
            },
            {
                id: 'q4',
                question: 'How often do you act without thinking?',
                type: 'scale',
                scaleRange: { min: 0, max: 4, minLabel: 'Rarely', maxLabel: 'Very often' }
            }
        ],
        scoringGuide: {
            lowRisk: {
                min: 0,
                max: 5,
                description: 'Good emotional regulation',
                recommendation: 'Continue regular activities'
            },
            moderateRisk: {
                min: 6,
                max: 11,
                description: 'Some regulation difficulties',
                recommendation: 'Recommend emotion regulation course and monitoring'
            },
            highRisk: {
                min: 12,
                max: 16,
                description: 'Significant behavioral concerns',
                recommendation: 'Refer to behavioral specialist for assessment'
            }
        }
    }
];

export const allAssessments = [...cbtAssessments, ...pbctAssessments];

export function getAssessmentById(id: string): Assessment | undefined {
    return allAssessments.find(a => a.id === id);
}

export function calculateAssessmentScore(assessment: Assessment, responses: Record<string, number>): AssessmentResult {
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);

    let riskLevel: 'low' | 'moderate' | 'high';
    let recommendations: string[];
    let requiresScreening: boolean;

    if (totalScore >= assessment.scoringGuide.highRisk.min) {
        riskLevel = 'high';
        recommendations = [assessment.scoringGuide.highRisk.recommendation];
        requiresScreening = true;
    } else if (totalScore >= assessment.scoringGuide.moderateRisk.min) {
        riskLevel = 'moderate';
        recommendations = [assessment.scoringGuide.moderateRisk.recommendation];
        requiresScreening = false;
    } else {
        riskLevel = 'low';
        recommendations = [assessment.scoringGuide.lowRisk.recommendation];
        requiresScreening = false;
    }

    return {
        assessmentId: assessment.id,
        studentId: 'mock-student-id',
        studentName: 'Mock Student',
        score: totalScore,
        riskLevel,
        completedAt: new Date(),
        responses,
        recommendations,
        requiresScreening
    };
}
