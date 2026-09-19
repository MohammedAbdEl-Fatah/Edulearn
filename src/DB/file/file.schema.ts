import { Schema } from "mongoose";
import { IFile } from "../../utils/interface";

export const fileSchema = new Schema<IFile>({
    sessionId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, required: true },
}, { timestamps: true, versionKey: false })