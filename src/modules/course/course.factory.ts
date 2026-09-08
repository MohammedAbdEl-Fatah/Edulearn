import { Types } from "mongoose";
import { ICourse } from "../../utils/interface";
import { CreateCourseDto, editCourseDto } from "./course.dto";

class CourseFactory {
    public createCourse(course: CreateCourseDto, instructorId: Types.ObjectId) {
        const courseData: Omit<ICourse, "id"> = {
            title: course.title,
            description: course.description,
            price: course.price,
            category: course.category,
            instructorId: instructorId,
            reviews: [],
            sessions: [],
            discount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return courseData;
    };
    public editCourse(course: editCourseDto, oldCourse: ICourse) {
        const courseData: Omit<ICourse, "id"> = {
            title: course.title || oldCourse.title,
            description: course.description || oldCourse.description,
            price: oldCourse.price,
            category: oldCourse.category,
            instructorId: oldCourse.instructorId,
            reviews: oldCourse.reviews,
            sessions: oldCourse.sessions,
            discount: course.discount || oldCourse.discount,
            createdAt: oldCourse.createdAt,
            updatedAt: new Date()
        };
        return courseData;
    };
}
export default CourseFactory;