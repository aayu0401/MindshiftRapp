export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    ageGroup: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    modules: CourseModule[];
    imageUrl?: string;
    enrolled?: number;
    rating?: number;
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    duration: string;
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'activity' | 'quiz';
    content: string;
    duration: string;
    completed?: boolean;
}

export const coursesData: Course[] = [
    {
        id: 'course-1',
        imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800&q=80',
        title: 'Emotional Awareness for Young Learners',
        description: 'Help young students identify and understand their emotions through interactive stories and activities.',
        category: 'Emotional Intelligence',
        ageGroup: '6-8',
        difficulty: 'beginner',
        duration: '4 weeks',
        enrolled: 234,
        rating: 4.8,
        modules: [
            {
                id: 'mod-1',
                title: 'Understanding Feelings',
                description: 'Learn to identify different emotions',
                duration: '1 week',
                lessons: [
                    { id: 'les-1', title: 'What Are Emotions?', type: 'video', content: 'Introduction to emotions', duration: '10 min' },
                    { id: 'les-2', title: 'The Feelings Wheel', type: 'activity', content: 'Interactive emotion identification', duration: '15 min' },
                    { id: 'les-3', title: 'Emotions Quiz', type: 'quiz', content: 'Test your knowledge', duration: '5 min' }
                ]
            },
            {
                id: 'mod-2',
                title: 'Expressing Emotions Safely',
                description: 'Learn healthy ways to express feelings',
                duration: '1 week',
                lessons: [
                    { id: 'les-4', title: 'Talking About Feelings', type: 'reading', content: 'How to communicate emotions', duration: '12 min' },
                    { id: 'les-5', title: 'Emotion Charades', type: 'activity', content: 'Practice expressing emotions', duration: '20 min' }
                ]
            }
        ]
    },
    {
        id: 'course-2',
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
        title: 'Building Resilience and Coping Skills',
        description: 'Develop resilience and learn practical coping strategies for handling challenges and stress.',
        category: 'Resilience',
        ageGroup: '9-11',
        difficulty: 'intermediate',
        duration: '6 weeks',
        enrolled: 189,
        rating: 4.9,
        modules: [
            {
                id: 'mod-3',
                title: 'Understanding Stress',
                description: 'What is stress and how does it affect us?',
                duration: '1 week',
                lessons: [
                    { id: 'les-6', title: 'What Is Stress?', type: 'video', content: 'Introduction to stress', duration: '12 min' },
                    { id: 'les-7', title: 'Stress Signals', type: 'reading', content: 'Recognizing stress in your body', duration: '10 min' }
                ]
            },
            {
                id: 'mod-4',
                title: 'Coping Strategies',
                description: 'Learn practical tools to manage stress',
                duration: '2 weeks',
                lessons: [
                    { id: 'les-8', title: 'Deep Breathing Exercises', type: 'activity', content: 'Practice calming techniques', duration: '15 min' },
                    { id: 'les-9', title: 'Problem-Solving Steps', type: 'reading', content: 'Breaking down challenges', duration: '12 min' },
                    { id: 'les-10', title: 'Coping Skills Quiz', type: 'quiz', content: 'Test your knowledge', duration: '8 min' }
                ]
            }
        ]
    },
    {
        id: 'course-3',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
        title: 'Friendship and Social Skills',
        description: 'Develop healthy friendships and improve communication and empathy skills.',
        category: 'Social Skills',
        ageGroup: '8-10',
        difficulty: 'beginner',
        duration: '5 weeks',
        enrolled: 312,
        rating: 4.7,
        modules: [
            {
                id: 'mod-5',
                title: 'What Makes a Good Friend?',
                description: 'Understanding friendship qualities',
                duration: '1 week',
                lessons: [
                    { id: 'les-11', title: 'Friendship Qualities', type: 'video', content: 'What to look for in friends', duration: '10 min' },
                    { id: 'les-12', title: 'Being a Good Friend', type: 'activity', content: 'Practice friendship skills', duration: '15 min' }
                ]
            },
            {
                id: 'mod-6',
                title: 'Communication Skills',
                description: 'Learn to express yourself clearly',
                duration: '2 weeks',
                lessons: [
                    { id: 'les-13', title: 'Active Listening', type: 'reading', content: 'How to really listen', duration: '12 min' },
                    { id: 'les-14', title: 'Expressing Yourself', type: 'activity', content: 'Practice communication', duration: '18 min' }
                ]
            }
        ]
    },
    {
        id: 'course-4',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        title: 'Self-Esteem and Confidence Building',
        description: 'Build self-confidence and develop a positive self-image through evidence-based activities.',
        category: 'Self-Esteem',
        ageGroup: '12-14',
        difficulty: 'intermediate',
        duration: '6 weeks',
        enrolled: 156,
        rating: 4.9,
        modules: [
            {
                id: 'mod-7',
                title: 'Understanding Self-Esteem',
                description: 'What is self-esteem and why it matters',
                duration: '1 week',
                lessons: [
                    { id: 'les-15', title: 'What Is Self-Esteem?', type: 'video', content: 'Introduction to self-worth', duration: '15 min' },
                    { id: 'les-16', title: 'Self-Talk Awareness', type: 'reading', content: 'Understanding your inner voice', duration: '12 min' }
                ]
            },
            {
                id: 'mod-8',
                title: 'Building Confidence',
                description: 'Practical strategies for self-confidence',
                duration: '2 weeks',
                lessons: [
                    { id: 'les-17', title: 'Positive Affirmations', type: 'activity', content: 'Creating your affirmations', duration: '15 min' },
                    { id: 'les-18', title: 'Celebrating Strengths', type: 'activity', content: 'Identifying your talents', duration: '20 min' }
                ]
            }
        ]
    },
    {
        id: 'course-5',
        imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
        title: 'Managing Anxiety and Worry',
        description: 'Learn to understand and manage anxiety with CBT-based techniques.',
        category: 'Anxiety Management',
        ageGroup: '10-14',
        difficulty: 'intermediate',
        duration: '8 weeks',
        enrolled: 201,
        rating: 4.8,
        modules: [
            {
                id: 'mod-9',
                title: 'Understanding Anxiety',
                description: 'What is anxiety and how it affects us',
                duration: '1 week',
                lessons: [
                    { id: 'les-19', title: 'What Is Anxiety?', type: 'video', content: 'Introduction to anxiety', duration: '12 min' },
                    { id: 'les-20', title: 'Anxiety Triggers', type: 'reading', content: 'Identifying what causes anxiety', duration: '15 min' }
                ]
            },
            {
                id: 'mod-10',
                title: 'CBT Techniques',
                description: 'Cognitive Behavioral Therapy strategies',
                duration: '3 weeks',
                lessons: [
                    { id: 'les-21', title: 'Thought Challenging', type: 'activity', content: 'Questioning anxious thoughts', duration: '20 min' },
                    { id: 'les-22', title: 'Relaxation Techniques', type: 'activity', content: 'Progressive muscle relaxation', duration: '15 min' },
                    { id: 'les-23', title: 'Anxiety Management Quiz', type: 'quiz', content: 'Test your skills', duration: '10 min' }
                ]
            }
        ]
    },
    {
        id: 'course-6',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        title: 'Mental Health Literacy for Teens',
        description: 'Comprehensive mental health education for teenagers covering various topics.',
        category: 'Mental Health Literacy',
        ageGroup: '15-18',
        difficulty: 'advanced',
        duration: '10 weeks',
        enrolled: 143,
        rating: 4.9,
        modules: [
            {
                id: 'mod-11',
                title: 'Introduction to Mental Health',
                description: 'Understanding mental health and wellbeing',
                duration: '2 weeks',
                lessons: [
                    { id: 'les-24', title: 'What Is Mental Health?', type: 'video', content: 'Comprehensive overview', duration: '18 min' },
                    { id: 'les-25', title: 'Common Mental Health Conditions', type: 'reading', content: 'Understanding different conditions', duration: '20 min' }
                ]
            },
            {
                id: 'mod-12',
                title: 'Seeking Help and Support',
                description: 'When and how to get help',
                duration: '2 weeks',
                lessons: [
                    { id: 'les-26', title: 'Recognizing When to Seek Help', type: 'reading', content: 'Warning signs', duration: '15 min' },
                    { id: 'les-27', title: 'Support Resources', type: 'activity', content: 'Finding help in your area', duration: '12 min' }
                ]
            }
        ]
    }
];

export function getCourseById(id: string): Course | undefined {
    return coursesData.find(course => course.id === id);
}

export function getCoursesByAgeGroup(ageGroup: string): Course[] {
    return coursesData.filter(course => course.ageGroup === ageGroup);
}

export function getCoursesByCategory(category: string): Course[] {
    return coursesData.filter(course => course.category === category);
}

export function getRecommendedCourses(userAge?: number): Course[] {
    if (!userAge) return coursesData.slice(0, 3);

    if (userAge <= 8) return coursesData.filter(c => c.ageGroup.includes('6-8') || c.ageGroup.includes('8-10'));
    if (userAge <= 11) return coursesData.filter(c => c.ageGroup.includes('9-11') || c.ageGroup.includes('10-14'));
    if (userAge <= 14) return coursesData.filter(c => c.ageGroup.includes('12-14') || c.ageGroup.includes('10-14'));
    return coursesData.filter(c => c.ageGroup.includes('15-18'));
}
