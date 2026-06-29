import { Schema } from "mongoose";
import { IToken } from "../../utils/interface";
import { RoleUSER } from "../../utils/enum";

export const tokenSchema = new Schema<IToken>({
    userId: { type: String, required: true },
    roleUser: { type: String, required: true, enum: RoleUSER },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
   }, {
    timestamps: true,
    versionKey: false,
})