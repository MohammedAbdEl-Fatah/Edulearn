import z from "zod";
import { CategoryType } from "../../utils/enum";
import mongoose from "mongoose";


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
        discount: z.coerce.number().min(0, { message: "Discount must be a positive number" }).default(0),
        category: z.enum(CategoryType, { error: "Invalid category. Must be one of beginner, intermediate, advanced." }),
    });

    checkIDFromParams = z.strictObject({
        id: this.objectIdSchema,
    })

    editCourse = z.strictObject({
        title: z.string().min(1, { message: "Title must be a string and not empty" }).optional(),
        description: z.string().min(1, { message: "Description must be a string and not empty" }).optional(),
        discount: z.coerce.number().min(0, { message: "Discount must be a positive number" }).optional(),
    });
}

export default new CourseValidation();