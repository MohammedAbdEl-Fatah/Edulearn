import { ICourse } from "../../utils/interface";
import { calculateTotalPrice } from "./course.factory";

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
        const price = Number(data.price) || 0;
        const discount = Number(data.discount) || 0;
        const totalPrice = calculateTotalPrice(price, discount, data.discountStartDate, data.discountEndDate);

        return {
            success: true,
            message: "Course fetched successfully",
            data: {
                _id,
                title: data.title,
                description: data.description,
                price: data.price,
                discount: data.discount,
                totalPrice: totalPrice,
                discountStartDate: data.discountStartDate,
                discountEndDate: data.discountEndDate,
                category: data.category,
                instructorId: data.instructorId,
                thumbnail: data.thumbnail,
                reviews: data.reviews,
                sessions: data.sessions,
            },
        };
    }
    public getAllCourseResponse(data: ICourse[]) {
        const formattedData = data.map((course) => {
            const courseObj = (course as any).toObject ? (course as any).toObject() : { ...course };
            courseObj.totalPrice = calculateTotalPrice(
                course.price,
                course.discount,
                course.discountStartDate,
                course.discountEndDate
            );
            return courseObj;
        });

        return {
            success: true,
            message: "Courses fetched successfully",
            data: formattedData,
        };
    }
}
export default CourseResponse;