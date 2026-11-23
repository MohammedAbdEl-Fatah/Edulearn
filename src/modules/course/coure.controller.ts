import { Router } from "express";
import CourseValidation from "./course.validation";
import { isValidationBody } from "../../middleware/validation.middleware";
import CourseService from "./course.service";
import { authMiddleware } from "../../middleware/auth.middleware";
import enrollmentService from "../enrollment/enrollment.service";
import MulterService from "../../middleware/multer.middleware";


export const courseController = Router();

/**
 * @openapi
 * /course/create-course:
 *   post:
 *     servers:
 *       - url: /api/v2
 *         description: Current server (v2)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Create a new course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - thumbnail
 *               - title
 *               - description
 *               - price
 *               - discount
 *               - category
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Course thumbnail / logo image
 *               title:
 *                 type: string
 *                 example: "Node.js & TypeScript Masterclass"
 *               description:
 *                 type: string
 *                 example: "Comprehensive course on backend web development."
 *               price:
 *                 type: number
 *                 example: 99.99
 *               discount:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: "beginner"
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request / Course already exists / Missing thumbnail
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only teachers can create courses
 *       500:
 *         description: Internal server error
 */
courseController.post(
    "/create-course",
    authMiddleware,
    MulterService.singleFile("thumbnail"),
    isValidationBody(CourseValidation.createCourse),
    CourseService.createCourse
);

/**
 * @openapi
 * /course/edit-course/{id}:
 *   patch:
 *     servers:
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Edit an existing course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: New course thumbnail / logo image
 *               title:
 *                 type: string
 *                 example: "Advanced Node.js & TypeScript"
 *               description:
 *                 type: string
 *                 example: "Updated course description."
 *               discount:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Bad request / Course can be edited only once in 24 hours
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - You do not have permission to edit this course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
courseController.patch(
    "/edit-course/:id",
    authMiddleware,
    MulterService.singleFile("thumbnail"),
    isValidationBody(CourseValidation.editCourse),
    CourseService.editCourse
);

/**
 * @openapi
 * /course/get-course/{id}:
 *   get:
 *     servers:
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Get course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
courseController.get("/get-course/:id", CourseService.getCourse);

/**
 * @openapi
 * /course/get-all-course:
 *   get:
 *     servers:
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       500:
 *         description: Internal server error
 */
courseController.get("/get-all-course", CourseService.getAllCourses);

/**
 * @openapi
 * /course/get-courses-teacher/{id}:
 *   get:
 *     servers:
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Get all courses by teacher ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher / instructor ID
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       400:
 *         description: Invalid teacher ID
 *       500:
 *         description: Internal server error
 */
courseController.get("/get-courses-teacher/:id", CourseService.getCoursesTeacher);

/**
 * @openapi
 * /course/delete-course/{id}:
 *   delete:
 *     servers:
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Delete a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Invalid course ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - You do not have permission to delete this course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
courseController.delete("/delete-course/:id", authMiddleware, CourseService.deleteCourse);

/**
 * @openapi
 * /course/progress/{id}:
 *   get:
 *     servers:
 *       - url: http://localhost:8000/api/v2
 *         description: Local server (v2 - port 8000)
 *       - url: http://localhost:8001/api/v2
 *         description: Local server (v2 - port 8001)
 *       - url: https://edulearn-gray.vercel.app/api/v2
 *         description: Production server (v2)
 *     summary: Get course progress for student (showing percentage up to 100%)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
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
courseController.get(
    "/progress/:id",
    authMiddleware,
    enrollmentService.getCourseProgress
);
