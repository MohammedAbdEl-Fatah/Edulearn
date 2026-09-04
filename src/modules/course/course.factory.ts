import { Types } from "mongoose";
import { ICourse } from "../../utils/interface";
import { CreateCourseDto } from "./course.dto";

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
    }
}
export default CourseFactory;