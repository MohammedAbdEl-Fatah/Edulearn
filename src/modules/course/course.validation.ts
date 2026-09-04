import z from "zod";


class CourseValidation {
    private objectIdSchema = z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

    createCourse = z.strictObject({
        instructorId: this.objectIdSchema,
        title: z.string().min(1, { error: "Title is required" }),
        description: z.string().min(1, { error: "Description is required" }),
        price: z.number().min(0, { error: "Price must be a positive number" }),
        discount: z.number().min(0, { error: "Discount must be a positive number" }),
        category: z.string().min(1, { error: "Category is required" }),
    })
}

export default new CourseValidation();