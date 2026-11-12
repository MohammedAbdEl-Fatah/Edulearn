import { IEnrollment } from "../../utils/interface";
import { EnrollmentProgressDto } from "./enrollment.dto";

class EnrollmentResponse {
    public enrollResponse(enrollment: IEnrollment) {
        return {
            id: enrollment.id,
            studentId: enrollment.studentId,
            courseId: enrollment.courseId,
            progress: `${enrollment.progress}%`,
            progressValue: enrollment.progress,
            isCompleted: enrollment.isCompleted,
            completedLessonsCount: enrollment.completedLessons.length,
            createdAt: enrollment.createdAt,
        };
    }

    public progressResponse(data: EnrollmentProgressDto) {
        return {
            courseId: data.courseId,
            courseTitle: data.courseTitle,
            progressPercentage: data.progressPercentage,
            progressValue: data.progress,
            isCompleted: data.isCompleted,
            totalLessons: data.totalLessons,
            completedLessonsCount: data.completedLessonsCount,
            completedLessons: data.completedLessons,
        };
    }

    public myCoursesResponse(courses: any[]) {
        return {
            totalEnrolled: courses.length,
            courses,
        };
    }
}

export default EnrollmentResponse;

