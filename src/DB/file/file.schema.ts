import { Schema } from "mongoose";
import { IFile } from "../../utils/interface";
import { TypeAssenment } from "../../utils/enum";

export const fileSchema = new Schema<IFile>({
    sessionId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    presentId: { type: Schema.Types.ObjectId, },
    title: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, required: true },
    order: { type: Number, required: true },
    typeAssenment: { type: String, enum: TypeAssenment }
}, { timestamps: true, versionKey: false })