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
    public editCourseResponse(data: ICourse) {
        return {
            success: true,
            message: "Course updated successfully",
            data,
        };
    }

    public deleteCourseResponse(data: ICourse) {
        return {
            success: true,
            message: "Course deleted successfully",
            data,
        };
    }
    public getCourseResponse(data: Partial<ICourse>, _id: string) {
        return {
            success: true,
            message: "Course fetched successfully",
            data: {
                _id,
                title: data.title,
                description: data.description,
                price: data.price,
                discount: data.discount,
                category: data.category,
                instructorId: data.instructorId,
                reviews: data.reviews,
                sessions: data.sessions,
            },
        };
    }
    public getAllCourseResponse(data:ICourse[]){
        return{
            success: true,
            message: "Courses fetched successfully",
            data,
        }
    }
}
export default CourseResponse;