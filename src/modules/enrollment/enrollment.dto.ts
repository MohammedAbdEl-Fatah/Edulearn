export interface CompleteLessonDto {
    courseId: string;
    lessonId: string;
}

export interface EnrollmentProgressDto {
    courseId: string;
    courseTitle: string;
    totalLessons: number;
    completedLessonsCount: number;
    progress: number;
    progressPercentage: string;
    isCompleted: boolean;
    completedLessons: string[];
}
