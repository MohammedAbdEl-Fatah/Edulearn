import { ICourse } from "../../utils/interface";

class CourseResponse {
    //repsonse of create course
    public createCourseResponse(data: ICourse) {
        return {
            success: true,
            message: "Course created successfully",
            data,
        };
    }
}
export default CourseResponse;