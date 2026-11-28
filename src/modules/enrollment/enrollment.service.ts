import { Request, Response } from "express";
import { Types } from "mongoose";
import { EnrollmentRepository } from "../../DB/enrollment/enrollment.repository";
import { CourseRepository } from "../../DB/course/course.repository";
import { SessionRepository } from "../../DB/session/session.repository";
import { VideoRepository } from "../../DB/video/video.repository";
import EnrollmentResponse from "./enrollment.response";
import { asyncHandleError } from "../../error/async.handle";
import { AppError } from "../../error/app.error";
import { RoleUSER } from "../../utils/enum";
import enrollmentValidation from "./enrollment.validation";

class EnrollmentService {
    constructor(
        private readonly enrollmentRepository: EnrollmentRepository,
        private readonly courseRepository: CourseRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly videoRepository: VideoRepository,
        private readonly enrollmentResponse: EnrollmentResponse,
    ) { }

    private checkStudent(user: any) {
        if (!user || user.role !== RoleUSER.STUDENT) {
            throw new AppError("Forbidden: Only students can perform this action", 403);
        }
    }

    private async getCourseVideos(courseId: string | Types.ObjectId) {
        const sessions = await this.sessionRepository.getAll({ filter: { courseId } });
        if (!sessions || sessions.length === 0) {
            return [];
        }
        const sessionIds = sessions.map((s: any) => s._id || s.id);
        return await this.videoRepository.getAll({
            filter: { sessionId: { $in: sessionIds } },
        });
    }

    // 1. Enroll in a course
    public enrollCourse = asyncHandleError(
        async (req: Request, res: Response) => {
            this.checkStudent(req.user);

            const parsedParams = enrollmentValidation.courseIdParams.safeParse(req.params);
            if (!parsedParams.success) {
                throw new AppError("Invalid course ID", 400);
            }

            const { courseId } = parsedParams.data;
            const studentId = req.user!.id;

            // Check if course exists
            const course = await this.courseRepository.getOne({ filter: { _id: courseId } });
            if (!course) {
                throw new AppError("Course not found", 404);
            }

            // Check if already enrolled
            const existingEnrollment = await this.enrollmentRepository.getOne({
                filter: { studentId, courseId: new Types.ObjectId(courseId) },
            });
            if (existingEnrollment) {
                throw new AppError("You are already enrolled in this course", 400);
            }

            // Create new enrollment
            const newEnrollment = await this.enrollmentRepository.create({
                studentId: new Types.ObjectId(studentId),
                courseId: new Types.ObjectId(courseId),
                completedLessons: [],
                progress: 0,
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return res.status(201).json({
                message: "Enrolled in course successfully",
                data: this.enrollmentResponse.enrollResponse(newEnrollment),
            });
        }
    );

    // 2. Mark lesson as completed and recalculate progress (up to 100%)
    public completeLesson = asyncHandleError(
        async (req: Request, res: Response) => {
            this.checkStudent(req.user);

            const parsedParams = enrollmentValidation.completeLessonParams.safeParse(req.params);
            if (!parsedParams.success) {
                throw new AppError("Invalid course or lesson ID", 400);
            }

            const { courseId, lessonId } = parsedParams.data;
            const studentId = req.user!.id;

            // Verify enrollment
            const enrollment = await this.enrollmentRepository.getOne({
                filter: { studentId, courseId: new Types.ObjectId(courseId) },
            });
            if (!enrollment) {
                throw new AppError("You are not enrolled in this course", 404);
            }

            // Verify course and lesson
            const course = await this.courseRepository.getOne({ filter: { _id: courseId } });
            if (!course) {
                throw new AppError("Course not found", 404);
            }

            const courseVideos = await this.getCourseVideos(courseId);
            const totalLessons = courseVideos.length;

            const lessonExists = courseVideos.some(
                (v: any) => (v._id || v.id).toString() === lessonId
            );
            if (!lessonExists) {
                throw new AppError("Lesson not found in this course", 404);
            }

            // Add lesson if not already completed
            const completedLessonSet = new Set(
                enrollment.completedLessons.map((id) => id.toString())
            );
            completedLessonSet.add(lessonId);

            const updatedCompletedLessons = Array.from(completedLessonSet).map(
                (id) => new Types.ObjectId(id)
            );

            const progress = totalLessons > 0
                ? Math.min(100, Math.round((updatedCompletedLessons.length / totalLessons) * 100))
                : 100;
            const isCompleted = progress >= 100;

            await this.enrollmentRepository.updateOne({
                filter: { _id: (enrollment as any)._id || enrollment.id },
                projection: {
                    $set: {
                        completedLessons: updatedCompletedLessons,
                        progress,
                        isCompleted,
                        updatedAt: new Date(),
                    },
                },
            });

            return res.status(200).json({
                message: isCompleted
                    ? "Congratulations! You have completed 100% of this course!"
                    : "Lesson marked as completed successfully",
                data: this.enrollmentResponse.progressResponse({
                    courseId,
                    courseTitle: course.title,
                    totalLessons,
                    completedLessonsCount: updatedCompletedLessons.length,
                    progress,
                    progressPercentage: `${progress}%`,
                    isCompleted,
                    completedLessons: updatedCompletedLessons.map((id) => id.toString()),
                }),
            });
        }
    );

    // 3. Get course progress for student (showing up to 100%)
    public getCourseProgress = asyncHandleError(
        async (req: Request, res: Response) => {
            this.checkStudent(req.user);

            const courseIdParam = req.params.courseId || req.params.id;
            const parsedParams = enrollmentValidation.courseIdParams.safeParse({ courseId: courseIdParam });
            if (!parsedParams.success) {
                throw new AppError("Invalid course ID", 400);
            }

            const { courseId } = parsedParams.data;
            const studentId = req.user!.id;

            const course = await this.courseRepository.getOne({ filter: { _id: courseId } });
            if (!course) {
                throw new AppError("Course not found", 404);
            }

            const enrollment = await this.enrollmentRepository.getOne({
                filter: { studentId, courseId: new Types.ObjectId(courseId) },
            });
            if (!enrollment) {
                throw new AppError("You are not enrolled in this course", 404);
            }

            const courseVideos = await this.getCourseVideos(courseId);
            const totalLessons = courseVideos.length;
            const completedCount = enrollment.completedLessons.length;
            const progress = totalLessons > 0
                ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
                : (enrollment.progress || 0);
            const isCompleted = progress >= 100;

            return res.status(200).json({
                message: "Course progress retrieved successfully",
                data: this.enrollmentResponse.progressResponse({
                    courseId,
                    courseTitle: course.title,
                    totalLessons,
                    completedLessonsCount: completedCount,
                    progress,
                    progressPercentage: `${progress}%`,
                    isCompleted,
                    completedLessons: enrollment.completedLessons.map((id) => id.toString()),
                }),
            });
        }
    );

    // 4. Get all enrolled courses for the student with progress
    public getMyEnrolledCourses = asyncHandleError(
        async (req: Request, res: Response) => {
            this.checkStudent(req.user);
            const studentId = req.user!.id;

            const enrollments = await this.enrollmentRepository.getAll({
                filter: { studentId },
            });

            const coursesWithProgress = await Promise.all(
                enrollments.map(async (enrollment) => {
                    const course = await this.courseRepository.getOne({
                        filter: { _id: enrollment.courseId },
                    });
                    const courseVideos = await this.getCourseVideos(enrollment.courseId);
                    const totalLessons = courseVideos.length;
                    const completedCount = enrollment.completedLessons.length;
                    const progress = totalLessons > 0
                        ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
                        : (enrollment.progress || 0);

                    return {
                        enrollmentId: (enrollment as any)._id || enrollment.id,
                        courseId: enrollment.courseId,
                        courseTitle: course ? course.title : "Unknown Course",
                        category: course ? course.category : "",
                        price: course ? course.price : 0,
                        discount: course ? course.discount : 0,
                        totalPrice: course ? (course.totalPrice ?? course.price) : 0,
                        totalLessons,
                        completedLessonsCount: completedCount,
                        progressPercentage: `${progress}%`,
                        progressValue: progress,
                        isCompleted: progress >= 100,
                        enrolledAt: enrollment.createdAt,
                    };
                })
            );

            return res.status(200).json({
                message: "Enrolled courses retrieved successfully",
                data: this.enrollmentResponse.myCoursesResponse(coursesWithProgress),
            });
        }
    );
}

export default new EnrollmentService(
    new EnrollmentRepository(),
    new CourseRepository(),
    new SessionRepository(),
    new VideoRepository(),
    new EnrollmentResponse(),
);

