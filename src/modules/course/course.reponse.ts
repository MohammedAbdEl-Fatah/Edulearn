import { ICourse } from "../../utils/interface";

class CourseResponse {
    //repsonse of create course
    public createCourseResponse(data: ICourse) {
        return {
            data,
            message: "Course created successfully"
        };
    }
}
export default CourseResponse;