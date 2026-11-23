import { Types } from "mongoose";
import { ICourse, ICourseThumbnail } from "../../utils/interface";
import { CreateCourseDto, editCourseDto } from "./course.dto";

class CourseFactory {
    public createCourse(course: CreateCourseDto, instructorId: Types.ObjectId, thumbnail: ICourseThumbnail) {
        const courseData: Omit<ICourse, "id"> = {
            title: course.title,
            description: course.description,
            price: Number(course.price),
            discount: Number(course.discount) || 0,
            category: course.category,
            instructorId: instructorId,
            thumbnail: thumbnail,
            reviews: [],
            sessions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return courseData;
    };
    public editCourse(course: editCourseDto, oldCourse: ICourse, thumbnail?: ICourseThumbnail) {
        const courseData: Omit<ICourse, "id"> = {
            title: course.title || oldCourse.title,
            description: course.description || oldCourse.description,
            price: oldCourse.price,
            category: oldCourse.category,
            instructorId: oldCourse.instructorId,
            thumbnail: thumbnail || oldCourse.thumbnail,
            reviews: oldCourse.reviews,
            sessions: oldCourse.sessions,
            discount: course.discount !== undefined ? Number(course.discount) : oldCourse.discount,
            createdAt: oldCourse.createdAt,
            updatedAt: new Date()
        };
        return courseData;
    };
}
export default CourseFactory;