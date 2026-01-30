import { PrismaClient, UserRole, StoryCategory, AgeGroup, TherapeuticGoal, SectionType, QuestionType, AssessmentType, RiskLevel } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.assessmentResult.deleteMany();
    await prisma.assessmentQuestionResponse.deleteMany();
    await prisma.assessmentResponse.deleteMany();
    await prisma.assessmentQuestionOption.deleteMany();
    await prisma.assessmentQuestion.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.storyQuestionResponse.deleteMany();
    await prisma.storyQuestionOption.deleteMany();
    await prisma.storyQuestion.deleteMany();
    await prisma.storySection.deleteMany();
    await prisma.storyChapter.deleteMany();
    await prisma.storyProgress.deleteMany();
    await prisma.story.deleteMany();
    await prisma.userAnalytics.deleteMany();
    await prisma.classAnalytics.deleteMany();
    await prisma.aIGeneratedStory.deleteMany();
    await prisma.aIStoryTemplate.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password', 12);

    const student1 = await prisma.user.create({
        data: {
            email: 'student@demo.com',
            password: hashedPassword,
            name: 'Alex Student',
            role: UserRole.STUDENT,
            age: 12,
            grade: '7th Grade',
            schoolId: 'school-001',
        },
    });

    const teacher1 = await prisma.user.create({
        data: {
            email: 'teacher@demo.com',
            password: hashedPassword,
            name: 'Ms. Johnson',
            role: UserRole.TEACHER,
            schoolId: 'school-001',
        },
    });

    const schoolAdmin = await prisma.user.create({
        data: {
            email: 'school@demo.com',
            password: hashedPassword,
            name: 'Principal Smith',
            role: UserRole.SCHOOL_ADMIN,
            schoolId: 'school-001',
        },
    });

    const parent1 = await prisma.user.create({
        data: {
            email: 'parent@demo.com',
            password: hashedPassword,
            name: 'Parent Garcia',
            role: UserRole.PARENT,
            childrenIds: [student1.id],
        },
    });

    console.log('✅ Users created');

    // Create Story 1: The Courage Tree
    console.log('Creating stories...');
    const story1 = await prisma.story.create({
        data: {
            title: 'The Courage Tree',
            author: 'Mindshiftr Original',
            excerpt: 'A young sapling learns that being different can be a strength, not a weakness...',
            description: 'This therapeutic story helps children understand that differences make us unique and strong. Through the journey of a small tree that grows differently, children learn about resilience, self-acceptance, and courage.',
            category: StoryCategory.SELF_ESTEEM,
            ageGroup: AgeGroup.AGE_8_10,
            therapeuticGoals: [TherapeuticGoal.BOOST_SELF_ESTEEM, TherapeuticGoal.DEVELOP_RESILIENCE],
            estimatedReadingTime: 10,
            published: true,
            featured: true,
        },
    });

    const story1Chapter1 = await prisma.storyChapter.create({
        data: {
            storyId: story1.id,
            chapterNumber: 1,
            title: 'The Different Tree',
        },
    });

    // Create question for story
    const question1 = await prisma.storyQuestion.create({
        data: {
            question: 'Have you ever felt different from others around you? What made you feel that way?',
            type: QuestionType.REFLECTION,
            therapeuticPurpose: 'Helps children identify and normalize feelings of being different',
        },
    });

    await prisma.storySection.createMany({
        data: [
            {
                chapterId: story1Chapter1.id,
                sectionNumber: 1,
                type: SectionType.TEXT,
                content: 'In a forest where all the trees grew tall and straight, there was one small tree that grew differently. While the others reached straight up to the sky, this little tree\'s branches curved and twisted in unusual ways.',
            },
            {
                chapterId: story1Chapter1.id,
                sectionNumber: 2,
                type: SectionType.QUESTION,
                content: 'Reflection Time',
                questionId: question1.id,
            },
            {
                chapterId: story1Chapter1.id,
                sectionNumber: 3,
                type: SectionType.TEXT,
                content: 'The other trees would whisper when the wind blew through their leaves. "Look at that strange tree," they would say. "Why can\'t it grow properly like the rest of us?" The little tree felt sad and wished it could be like everyone else.',
            },
        ],
    });

    const story1Chapter2 = await prisma.storyChapter.create({
        data: {
            storyId: story1.id,
            chapterNumber: 2,
            title: 'The Storm',
        },
    });

    const question2 = await prisma.storyQuestion.create({
        data: {
            question: 'The little tree\'s differences helped it survive the storm. Can you think of a time when something that made you different turned out to be helpful or special?',
            type: QuestionType.REFLECTION,
            therapeuticPurpose: 'Reframes differences as strengths and builds positive self-concept',
        },
    });

    await prisma.storySection.createMany({
        data: [
            {
                chapterId: story1Chapter2.id,
                sectionNumber: 1,
                type: SectionType.TEXT,
                content: 'One day, a terrible storm came to the forest. The wind howled and the rain poured down. The tall, straight trees swayed dangerously in the wind, and some of them even broke. But the little tree, with its curved and flexible branches, bent with the wind and stayed strong.',
            },
            {
                chapterId: story1Chapter2.id,
                sectionNumber: 2,
                type: SectionType.QUESTION,
                content: 'Think About It',
                questionId: question2.id,
            },
            {
                chapterId: story1Chapter2.id,
                sectionNumber: 3,
                type: SectionType.TEXT,
                content: 'After the storm, the other trees looked at the little tree with new respect. "You were brave," they said. "Your different way of growing made you strong." From that day on, the little tree was proud of being unique, and it was known throughout the forest as the Courage Tree.',
            },
        ],
    });

    // Create Story 2: The Friendship Garden
    const story2 = await prisma.story.create({
        data: {
            title: 'The Friendship Garden',
            author: 'Mindshiftr Original',
            excerpt: 'Two very different flowers learn that friendship can bloom in unexpected places...',
            description: 'A heartwarming story about empathy, kindness, and looking beyond first impressions to build meaningful friendships.',
            category: StoryCategory.SOCIAL_SKILLS,
            ageGroup: AgeGroup.AGE_6_8,
            therapeuticGoals: [TherapeuticGoal.BUILD_SOCIAL_SKILLS, TherapeuticGoal.DEVELOP_RESILIENCE],
            estimatedReadingTime: 8,
            published: true,
            featured: true,
        },
    });

    const story2Chapter1 = await prisma.storyChapter.create({
        data: {
            storyId: story2.id,
            chapterNumber: 1,
            title: 'The Rose and the Dandelion',
        },
    });

    const question3 = await prisma.storyQuestion.create({
        data: {
            question: 'Have you ever judged someone before getting to know them? What happened?',
            type: QuestionType.DISCUSSION,
            therapeuticPurpose: 'Encourages self-reflection on judgments and promotes empathy',
        },
    });

    const question4 = await prisma.storyQuestion.create({
        data: {
            question: 'What makes someone a good friend? How can we be better friends to others?',
            type: QuestionType.ACTIVITY,
            therapeuticPurpose: 'Helps identify positive friendship qualities and develop social skills',
        },
    });

    await prisma.storySection.createMany({
        data: [
            {
                chapterId: story2Chapter1.id,
                sectionNumber: 1,
                type: SectionType.TEXT,
                content: 'In a beautiful garden, there grew a bright red rose and a small yellow dandelion. The rose was proud and beautiful, admired by everyone who visited the garden. The dandelion was simple and cheerful, though many people called it a weed.',
            },
            {
                chapterId: story2Chapter1.id,
                sectionNumber: 2,
                type: SectionType.QUESTION,
                content: 'Let\'s Discuss',
                questionId: question3.id,
            },
            {
                chapterId: story2Chapter1.id,
                sectionNumber: 3,
                type: SectionType.TEXT,
                content: 'One hot summer day, the gardener forgot to water the plants. The rose began to wilt in the heat, its petals drooping sadly. The dandelion, used to surviving in tough conditions, stayed strong. When it saw the rose struggling, it shared the morning dew from its leaves.',
            },
            {
                chapterId: story2Chapter1.id,
                sectionNumber: 4,
                type: SectionType.TEXT,
                content: 'The rose was surprised and grateful. "Thank you," it whispered. "I\'m sorry I thought I was better than you. You\'re actually very kind and strong." From that day on, the rose and the dandelion became the best of friends, and the garden was more beautiful because of their friendship.',
            },
            {
                chapterId: story2Chapter1.id,
                sectionNumber: 5,
                type: SectionType.QUESTION,
                content: 'Activity Time',
                questionId: question4.id,
            },
        ],
    });

    console.log('✅ Stories created');

    // Create CBT Anxiety Assessment
    console.log('Creating assessments...');
    const anxietyAssessment = await prisma.assessment.create({
        data: {
            title: 'Anxiety Screening - Story Based',
            type: AssessmentType.CBT,
            description: 'Assess anxiety levels through story-based scenarios using CBT principles',
            ageGroup: AgeGroup.AGE_8_10,
            storyId: story1.id,
            lowRiskMin: 0,
            lowRiskMax: 10,
            moderateRiskMin: 11,
            moderateRiskMax: 20,
            highRiskMin: 21,
            highRiskMax: 32,
            lowRiskDescription: 'Low anxiety levels - typical developmental worries',
            moderateRiskDescription: 'Moderate anxiety - may benefit from additional support',
            highRiskDescription: 'High anxiety levels - requires professional assessment',
            lowRiskRecommendation: 'Continue with regular mental health literacy activities',
            moderateRiskRecommendation: 'Recommend school counselor check-in and anxiety management course',
            highRiskRecommendation: 'URGENT: Refer to school psychologist or mental health professional for screening',
            published: true,
        },
    });

    const anxQ1 = await prisma.assessmentQuestion.create({
        data: {
            assessmentId: anxietyAssessment.id,
            questionNumber: 1,
            question: 'In the story, when the character faced a new situation, how often do you feel similar worries?',
            type: QuestionType.SCALE,
            scaleMin: 0,
            scaleMax: 4,
            scaleMinLabel: 'Never',
            scaleMaxLabel: 'Always',
        },
    });

    const anxQ2 = await prisma.assessmentQuestion.create({
        data: {
            assessmentId: anxietyAssessment.id,
            questionNumber: 2,
            question: 'Like the character, do you ever feel your heart beating fast or feel shaky when worried?',
            type: QuestionType.SCALE,
            scaleMin: 0,
            scaleMax: 4,
            scaleMinLabel: 'Never',
            scaleMaxLabel: 'Very Often',
        },
    });

    const anxQ3 = await prisma.assessmentQuestion.create({
        data: {
            assessmentId: anxietyAssessment.id,
            questionNumber: 3,
            question: 'The character had worried thoughts. How often do worried thoughts stop you from doing things you want to do?',
            type: QuestionType.SCALE,
            scaleMin: 0,
            scaleMax: 4,
            scaleMinLabel: 'Never',
            scaleMaxLabel: 'Always',
        },
    });

    const anxQ4 = await prisma.assessmentQuestion.create({
        data: {
            assessmentId: anxietyAssessment.id,
            questionNumber: 4,
            question: 'Do you worry about things before they happen, like the character did?',
            type: QuestionType.SCALE,
            scaleMin: 0,
            scaleMax: 4,
            scaleMinLabel: 'Never',
            scaleMaxLabel: 'Always',
        },
    });

    // Create PBCT Social Skills Assessment
    const socialAssessment = await prisma.assessment.create({
        data: {
            title: 'Social Skills and Peer Relationships',
            type: AssessmentType.PBCT,
            description: 'Assess social functioning and peer relationship challenges',
            ageGroup: AgeGroup.AGE_8_10,
            storyId: story2.id,
            lowRiskMin: 0,
            lowRiskMax: 7,
            moderateRiskMin: 8,
            moderateRiskMax: 14,
            highRiskMin: 15,
            highRiskMax: 20,
            lowRiskDescription: 'Good social functioning',
            moderateRiskDescription: 'Some social difficulties',
            highRiskDescription: 'Significant social challenges',
            lowRiskRecommendation: 'Continue social skills development activities',
            moderateRiskRecommendation: 'Recommend social skills group or friendship course',
            highRiskRecommendation: 'Refer to counselor for social skills assessment and support',
            published: true,
        },
    });

    await prisma.assessmentQuestion.createMany({
        data: [
            {
                assessmentId: socialAssessment.id,
                questionNumber: 1,
                question: 'How easy is it for you to make new friends?',
                type: QuestionType.SCALE,
                scaleMin: 0,
                scaleMax: 4,
                scaleMinLabel: 'Very easy',
                scaleMaxLabel: 'Very difficult',
            },
            {
                assessmentId: socialAssessment.id,
                questionNumber: 2,
                question: 'Do you feel left out or excluded by other students?',
                type: QuestionType.SCALE,
                scaleMin: 0,
                scaleMax: 4,
                scaleMinLabel: 'Never',
                scaleMaxLabel: 'Very often',
            },
            {
                assessmentId: socialAssessment.id,
                questionNumber: 3,
                question: 'How comfortable do you feel talking to classmates?',
                type: QuestionType.SCALE,
                scaleMin: 0,
                scaleMax: 4,
                scaleMinLabel: 'Very comfortable',
                scaleMaxLabel: 'Very uncomfortable',
            },
        ],
    });

    console.log('✅ Assessments created');

    // Create user analytics
    await prisma.userAnalytics.create({
        data: {
            userId: student1.id,
            storiesStarted: 2,
            storiesCompleted: 1,
            assessmentsCompleted: 1,
            currentRiskLevel: RiskLevel.LOW,
            lowRiskCount: 1,
            lastActiveDate: new Date(),
            totalTimeSpent: 45,
        },
    });

    // Create class analytics
    await prisma.classAnalytics.create({
        data: {
            teacherId: teacher1.id,
            className: '7th Grade Mental Health',
            schoolId: 'school-001',
            totalStudents: 25,
            activeStudents: 20,
            highRiskStudents: 2,
            moderateRiskStudents: 5,
            averageCompletionRate: 0.75,
            averageEngagementScore: 0.82,
        },
    });

    // Create AI Story Template
    await prisma.aIStoryTemplate.create({
        data: {
            name: 'Anxiety Management for Ages 8-10',
            description: 'Template for generating anxiety management stories for elementary school students',
            ageGroup: AgeGroup.AGE_8_10,
            category: StoryCategory.ANXIETY_MANAGEMENT,
            therapeuticGoals: [TherapeuticGoal.REDUCE_ANXIETY, TherapeuticGoal.DEVELOP_COPING_SKILLS],
            systemPrompt: 'You are a child psychologist and therapeutic storyteller specializing in CBT-based mental health stories for children.',
            userPromptTemplate: 'Create a therapeutic story about {theme} for children aged {ageGroup}. Include CBT principles and embed 3-4 reflection questions.',
            targetChapters: 2,
            targetSectionsPerChapter: 4,
            targetQuestionsPerChapter: 2,
            active: true,
        },
    });

    console.log('✅ Analytics and templates created');
    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
