import { Schema } from "mongoose";
import { IToken } from "../../utils/interface";
import { RoleUSER } from "../../utils/enum";

export const tokenSchema = new Schema<IToken>({
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, required: true, enum: RoleUSER },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
})