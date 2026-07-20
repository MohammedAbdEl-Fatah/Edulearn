import { Schema } from "mongoose";
import { IUser } from "../../utils/interface";
import { RoleUSER } from "../../utils/enum";

export const userSchema = new Schema<IUser>({
    fristName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, trim: true, minLength: 6 },
    role: { type: String, required: true, default: RoleUSER.STUDENT },
    isVerified: { type: Boolean, required: true, default: false },
    phone: { type: String, required: false, trim: true },
    dob: { type: Date, required: false },
    otp: { type: String, required: false, trim: true },
    otpExpires: { type: Date, required: false }
}, {
    timestamps: true,
    versionKey: false,
})