import { Schema } from "mongoose";
import { IPdf } from "../../utils/interface";

export const pdfSchema = new Schema<IPdf>({
    sessionId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, required: true },
}, { timestamps: true, versionKey: false })