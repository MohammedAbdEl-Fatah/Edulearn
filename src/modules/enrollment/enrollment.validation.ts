import z from "zod";
import mongoose from "mongoose";

class EnrollmentValidation {
    private objectIdSchema = z.string().refine(
        (id) => mongoose.Types.ObjectId.isValid(id),
        { message: "Invalid ObjectId format" }
    );

    courseIdParams = z.strictObject({
        courseId: this.objectIdSchema,
    });

    completeLessonParams = z.strictObject({
        courseId: this.objectIdSchema,
        lessonId: this.objectIdSchema,
    });
}

export default new EnrollmentValidation();

