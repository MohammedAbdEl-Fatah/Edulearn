import z from "zod";

class UserValidation {
    editProfile = z.strictObject({
        firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters" }).optional(),
        lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters" }).optional(),
        about: z.string().trim().max(1000, { message: "About cannot exceed 1000 characters" }).optional(),
    }).refine((data) => data.firstName !== undefined || data.lastName !== undefined || data.about !== undefined, {
        message: "At least one field (firstName, lastName, or about) is required to update",
    });
}

export default new UserValidation();
