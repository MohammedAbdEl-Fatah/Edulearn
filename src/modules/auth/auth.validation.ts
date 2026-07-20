import { z } from "zod";

class AuthValidation {

    public registerValidation = z.strictObject({
        fristName: z.string().min(1, { error: "Frist name is required" }),
        lastName: z.string().min(1, { error: "Last name is required" }),
        phone: z.string().optional(),
        dob: z.coerce.date({ error: "Date of birth is required" }),
        email: z.email().min(4, { error: "Email is required" }),
        password: z.string().min(6, { error: "Password must be at least 6 characters" }),
        confirmPassword: z.string().min(6, { error: "Password must be at least 6 characters" }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "confirmPassword doesn't match",
        path: ["confirmPassword"],
    });

    public loginValidation = z.strictObject({
        email: z.email().min(4, { error: "Email is required" }),
        password: z.string().min(6, { error: "Password must be at least 6 characters" }),
    });
    public verifyEmailValidation =
        z.strictObject({
            otp: z.string()
                .min(6, { error: "OTP must be at least 6 characters" })
                .max(6, { error: "OTP must be at most 6 characters" })
                .regex(/^\d+$/, { error: "OTP must contain only numbers" }),
            email: z.email().min(4, { error: "Email is required" }),
        });
    public generateOtpValidation = this.verifyEmailValidation.pick({
        email: true,
    });

    public forgetPasswordValidation = this.verifyEmailValidation.pick({
        email: true,
        otp: true,
    }).extend({
        newPassword: z.string().min(6, { error: "Password must be at least 6 characters" }),
    });
}
export default new AuthValidation();