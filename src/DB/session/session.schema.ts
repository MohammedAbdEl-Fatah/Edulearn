import { Schema } from "mongoose";
import { ISession } from "../../utils/interface";

export const sessionSchema = new Schema<ISession>({
    courseId: { type: Schema.Types.ObjectId, required: true, ref: "courses" },
    title: { type: String, required: true, trim: true },
    videos: [{ type: Schema.Types.Mixed }],
    pdfs: [{ type: Schema.Types.Mixed }],
    duration: { type: Number, required: true },
}, {
    timestamps: true,
    versionKey: false,
})