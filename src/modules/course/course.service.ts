


import { Request, Response } from "express";
import { CreateCourseDto, editCourseDto as editCourseDto } from "./course.dto";
import { CourseRepository } from "../../DB/course/course.repository";
import CourseFactory from "./course.factory";
import CourseResponse from "./course.reponse";
import { RoleUSER } from "../../utils/enum";
import { asyncHandleError } from "../../error/async.handle";
import { AppError } from "../../error/app.error";
import courseValidation from "./course.validation";

class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
        private readonly courseFactory: CourseFactory,
        private readonly responseCourse: CourseResponse
    ) { }

    //private
    private checkTeacher = (user: any) => {
        if (user?.role !== RoleUSER.TEACHER) {
            throw new AppError("forbidden you dont have permission to create course", 403);
        }
    }
    //create course
    public createCourse = asyncHandleError(async (req: Request, res: Response) => {
        //check role user is teacher
        this.checkTeacher(req.user);
        //get data from req
        const createCourseDTO: CreateCourseDto = req.body;
        //search course by title and instructorId
        const course = await this.courseRepository.getOne(
            { filter: { title: createCourseDTO.title, instructorId: req.user!.id } });
        //check caourse it exist for user 
        if (course) {
            throw new AppError("Course already exists", 400);
        }
        //factory course
        const courseData = this.courseFactory.createCourse(createCourseDTO, req.user!.id);
        //create course to db
        const courseDB = await this.courseRepository.create(courseData);
        //return response
        const responseCreateCourse = this.responseCourse.createCourseResponse(courseDB);
        return res.status(201).json(responseCreateCourse);
    });
    //edit course
    public editCourse = asyncHandleError(

        //teacher can edit name course and price or discount 
        //!add field hostiry for discount
        async (req: Request, res: Response) => {
            this.checkTeacher(req.user);
            const courseID = courseValidation.checkIDFromParams.safeParse(req.params);
            if (!courseID.success) {
                throw new AppError("Invalid course ID", 400);
            }
            //cousre is exist by id and check userid is same or not 
            const course = await this.courseRepository.getOne({ filter: { _id: courseID.data.id } });
            if (!course) {
                throw new AppError("Course not found", 404);
            }
            if (String(course.instructorId) !== req.user!.id.toString()) {
                throw new AppError("forbidden you dont have permission to edit this course", 403);
            }
            //last update course 
            if (Date.now() - course.updatedAt.getTime() < 24 * 60 * 60 * 1000) {
                throw new AppError("Course can be edited only once in 1 day", 400);
            }
            //get data 
            const editCourseDto: editCourseDto = req.body;
            //factory edit data
            const editCourseData = this.courseFactory.editCourse(editCourseDto, course);
            //save to db
            const courseDB = await this.courseRepository.updateOne({ filter: { _id: courseID.data.id }, projection: { $set: editCourseData } });
            //reposne
            const responseEditCourse = this.responseCourse.editCourseResponse(courseDB);
            return res.status(200).json(responseEditCourse);
        }

    );





    //delete course
    //get course => mean select id from courses
    //get all courses

}

export default new CourseService(new CourseRepository(), new CourseFactory(), new CourseResponse());