import { Router } from "express";
import CourseValidation from "./course.validation";
import { isValidationBody } from "../../middleware/validation.middleware";
import CourseService from "./course.service";
import { authMiddleware } from "../../middleware/auth.middleware";


export const courseController = Router();

courseController.post(
    "/create-course",
    isValidationBody(CourseValidation.createCourse),
    authMiddleware,
    CourseService.createCourse
);

courseController.patch(
    "/edit-course/:id",
    authMiddleware,
    isValidationBody(CourseValidation.editCourse),
    CourseService.editCourse
);