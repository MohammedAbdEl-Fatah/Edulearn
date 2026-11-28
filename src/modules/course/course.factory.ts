import { Types } from "mongoose";
import { ICourse, ICourseThumbnail } from "../../utils/interface";
import { CreateCourseDto, editCourseDto } from "./course.dto";

export const calculateTotalPrice = (
    price: number,
    discount: number = 0,
    discountStartDate?: Date | string | null,
    discountEndDate?: Date | string | null
): number => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    if (d <= 0) return p;

    if (discountStartDate && discountEndDate) {
        const now = Date.now();
        const start = new Date(discountStartDate).getTime();
        const end = new Date(discountEndDate).getTime();
        if (now < start || now > end) {
            return p;
        }
    }

    const finalPrice = p - (p * d) / 100;
    return Math.max(0, Math.round(finalPrice * 100) / 100);
};

class CourseFactory {
    public createCourse(course: CreateCourseDto, instructorId: Types.ObjectId, thumbnail: ICourseThumbnail) {
        const price = Number(course.price);
        const discount = Number(course.discount) || 0;
        let discountStartDate = course.discountStartDate ? new Date(course.discountStartDate) : undefined;
        let discountEndDate = course.discountEndDate ? new Date(course.discountEndDate) : undefined;

        if (discount > 0) {
            discountStartDate = discountStartDate ?? new Date();
            discountEndDate = discountEndDate ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        }

        const totalPrice = calculateTotalPrice(price, discount, discountStartDate, discountEndDate);

        const courseData: Omit<ICourse, "id"> = {
            title: course.title,
            description: course.description,
            price: price,
            discount: discount,
            totalPrice: totalPrice,
            discountStartDate: discountStartDate,
            discountEndDate: discountEndDate,
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
        const price = course.price !== undefined ? Number(course.price) : oldCourse.price;
        const discount = course.discount !== undefined ? Number(course.discount) : oldCourse.discount;

        const discountStartDate = (course.discountStartDate !== undefined || course.discountFrom !== undefined)
            ? (course.discountStartDate || course.discountFrom ? new Date((course.discountStartDate || course.discountFrom)!) : undefined)
            : oldCourse.discountStartDate;

        const discountEndDate = (course.discountEndDate !== undefined || course.discountTo !== undefined)
            ? (course.discountEndDate || course.discountTo ? new Date((course.discountEndDate || course.discountTo)!) : undefined)
            : oldCourse.discountEndDate;

        const totalPrice = calculateTotalPrice(price, discount, discountStartDate, discountEndDate);

        const courseData: Omit<ICourse, "id"> = {
            title: course.title || oldCourse.title,
            description: course.description || oldCourse.description,
            price: price,
            category: oldCourse.category,
            instructorId: oldCourse.instructorId,
            thumbnail: thumbnail || oldCourse.thumbnail,
            reviews: oldCourse.reviews,
            sessions: oldCourse.sessions,
            discount: discount,
            totalPrice: totalPrice,
            discountStartDate: discountStartDate,
            discountEndDate: discountEndDate,
            createdAt: oldCourse.createdAt,
            updatedAt: new Date()
        };
        return courseData;
    };
}
export default CourseFactory;