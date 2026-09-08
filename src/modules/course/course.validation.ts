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
        instructorId: this.objectIdSchema,
        title: z.string().min(1, { error: "Title is required" }),
        description: z.string().min(1, { error: "Description is required" }),
        price: z.number().min(0, { error: "Price must be a positive number" }),
        discount: z.number().min(0, { error: "Discount must be a positive number" }),
        category: z.enum(CategoryType, { error: "Invalid category. Must be one of beginner, intermediate, advanced." }),
    });

    checkIDFromParams = z.strictObject({
        id: this.objectIdSchema,
    })

    editCourse = z.strictObject({
        title: z.string().min(1, { error: "Title must be a string and not empty" }).optional(),
        description: z.string().min(1, { error: "Description must be a string and not empty" }).optional(),
        discount: z.number().min(0, { error: "Discount must be a positive number" }).optional(),
    }).refine((data) => data.title || data.description || data.discount, {
        error: "At least one field is required",

    })
}

export default new CourseValidation();