import { apiClient } from './client';

export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    ageGroup: string;
    duration: string;
    lessonsCount: number;
    imageUrl: string;
    difficulty: string;
    tags: string[];
    published: boolean;
}

interface CourseFilters {
    category?: string;
    ageGroup?: string;
    search?: string;
    difficulty?: string;
}

/**
 * Fetch all courses with optional filters
 */
export async function fetchCourses(filters?: CourseFilters): Promise<Course[]> {
    try {
        const response = await apiClient.get<Course[]>('/api/courses', { params: filters });
        return response.data;
    } catch (error) {
        console.warn('Courses API unreachable — using fallback data');
        return [
            {
                id: 'course-1',
                title: 'Understanding Emotions',
                description: 'A foundational course helping children identify and understand their emotions.',
                category: 'Emotional Literacy',
                ageGroup: '6-10',
                duration: '4 weeks',
                lessonsCount: 12,
                imageUrl: '',
                difficulty: 'Beginner',
                tags: ['emotions', 'self-awareness'],
                published: true,
            },
            {
                id: 'course-2',
                title: 'Building Resilience',
                description: 'Learn coping strategies and build mental resilience through guided exercises.',
                category: 'Resilience',
                ageGroup: '8-12',
                duration: '6 weeks',
                lessonsCount: 18,
                imageUrl: '',
                difficulty: 'Intermediate',
                tags: ['resilience', 'coping'],
                published: true,
            },
            {
                id: 'course-3',
                title: 'Mindful Communication',
                description: 'Develop healthy communication skills and empathy through role-play scenarios.',
                category: 'Social Skills',
                ageGroup: '10-14',
                duration: '5 weeks',
                lessonsCount: 15,
                imageUrl: '',
                difficulty: 'Intermediate',
                tags: ['communication', 'empathy'],
                published: true,
            },
        ];
    }
}

/**
 * Fetch a single course by ID
 */
export async function fetchCourseById(courseId: string): Promise<Course | null> {
    try {
        const response = await apiClient.get<Course>(`/api/courses/${courseId}`);
        return response.data;
    } catch (error) {
        return null;
    }
}

/**
 * Enroll in a course
 */
export async function enrollInCourse(courseId: string): Promise<any> {
    try {
        const response = await apiClient.post(`/api/courses/${courseId}/enroll`);
        return response.data;
    } catch (error) {
        return { ok: true, mock: true, message: 'Enrolled (demo mode)' };
    }
}

/**
 * Get course categories
 */
export async function fetchCourseCategories(): Promise<string[]> {
    try {
        const response = await apiClient.get<string[]>('/api/courses/categories/list');
        return response.data;
    } catch (error) {
        return ['Emotional Literacy', 'Resilience', 'Social Skills', 'Anxiety Management', 'Self-Esteem'];
    }
}
