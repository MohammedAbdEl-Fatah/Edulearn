import { ICourse } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { courseModel } from "./course.model";

export class CourseRepository extends DatabaseRepository<ICourse> {
    constructor() {
        super(courseModel);
    }
}
