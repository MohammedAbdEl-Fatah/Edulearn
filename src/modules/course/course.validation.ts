import z from "zod";
import { CategoryType } from "../../utils/enum";
import mongoose from "mongoose";

const optionalDate = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.date().optional()
);

class CourseValidation {
    private objectIdSchema = z.string().refine(
        (id) => mongoose.Types.ObjectId.isValid(id),
        {
            message: "Invalid course ID",
        }
    )

    createCourse = z.strictObject({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
        discount: z.coerce.number().min(0, { message: "Discount must be a positive number" }).max(100, { message: "Discount cannot exceed 100%" }).default(0),
        discountStartDate: optionalDate,
        discountEndDate: optionalDate,
        discountFrom: optionalDate,
        discountTo: optionalDate,
        category: z.enum(CategoryType, { error: "Invalid category. Must be one of beginner, intermediate, advanced." }),
    }).refine((data) => {
        const start = data.discountStartDate || data.discountFrom;
        const end = data.discountEndDate || data.discountTo;
        if (start && end && end <= start) {
            return false;
        }
        return true;
    }, {
        message: "discountEndDate must be after discountStartDate",
        path: ["discountEndDate"],
    });

    checkIDFromParams = z.strictObject({
        id: this.objectIdSchema,
    })

    editCourse = z.strictObject({
        title: z.string().min(1, { message: "Title must be a string and not empty" }).optional(),
        description: z.string().min(1, { message: "Description must be a string and not empty" }).optional(),
        price: z.coerce.number().min(0, { message: "Price must be a positive number" }).optional(),
        discount: z.coerce.number().min(0, { message: "Discount must be a positive number" }).max(100, { message: "Discount cannot exceed 100%" }).optional(),
        discountStartDate: optionalDate,
        discountEndDate: optionalDate,
        discountFrom: optionalDate,
        discountTo: optionalDate,
    }).refine((data) => {
        const start = data.discountStartDate || data.discountFrom;
        const end = data.discountEndDate || data.discountTo;
        if (start && end && end <= start) {
            return false;
        }
        return true;
    }, {
        message: "discountEndDate must be after discountStartDate",
        path: ["discountEndDate"],
    });
}

export default new CourseValidation();