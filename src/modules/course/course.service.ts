


import { Request, Response } from "express";
import { CreateCourseDto } from "./course.dto";
import { CourseRepository } from "../../DB/course/course.repository";
import CourseFactory from "./course.factory";
import CourseResponse from "./course.reponse";
import { RoleUSER } from "../../utils/enum";
import { asyncHandleError } from "../../error/async.handle";
import { AppError } from "../../error/app.error";

class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
        private readonly courseFactory: CourseFactory,
        private readonly responseCourse: CourseResponse
    ) { }
    //create course
    public createCourse = asyncHandleError(async (req: Request, res: Response) => {
        //get data from req
        const createCourseDTO: CreateCourseDto = req.body;
        //check role user is teacher
        if (req.user?.role !== RoleUSER.TEACHER) {
            throw new AppError("forbidden you dont have permission to create course", 403);
        }
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

        }

    );





    //delete course
    //get course => mean select id from courses
    //get all courses

}

export default new CourseService(new CourseRepository(), new CourseFactory(), new CourseResponse());