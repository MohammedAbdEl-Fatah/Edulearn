import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import enrollmentService from "./enrollment.service";

export const enrollmentController = Router();

/**
 * @openapi
 * /enrollment/enroll/{courseId}:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled in the course
 *       400:
 *         description: Already enrolled or invalid course ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only students can enroll
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
enrollmentController.post(
    "/enroll/:courseId",
    authMiddleware,
    enrollmentService.enrollCourse
);

/**
 * @openapi
 * /enrollment/complete-lesson/{courseId}/{lessonId}:
 *   patch:
 *     summary: Mark a lesson (video) as completed and recalculate course progress
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the completed lesson / video
 *     responses:
 *       200:
 *         description: Lesson marked as completed and progress updated (up to 100%)
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only students can mark lessons
 *       404:
 *         description: Not enrolled in course, or course/lesson not found
 *       500:
 *         description: Internal server error
 */
enrollmentController.patch(
    "/complete-lesson/:courseId/:lessonId",
    authMiddleware,
    enrollmentService.completeLesson
);

/**
 * @openapi
 * /enrollment/progress/{courseId}:
 *   get:
 *     summary: Get course progress for student (showing percentage up to 100%)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course progress retrieved successfully
 *       400:
 *         description: Invalid course ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only students can view their course progress
 *       404:
 *         description: Course or enrollment not found
 *       500:
 *         description: Internal server error
 */
enrollmentController.get(
    "/progress/:courseId",
    authMiddleware,
    enrollmentService.getCourseProgress
);

/**
 * @openapi
 * /enrollment/my-courses:
 *   get:
 *     summary: Get all courses the student is enrolled in with progress percentages
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses and progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only students can view their enrolled courses
 *       500:
 *         description: Internal server error
 */
enrollmentController.get(
    "/my-courses",
    authMiddleware,
    enrollmentService.getMyEnrolledCourses
);

