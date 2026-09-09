import { Schema } from "mongoose";
import { ISession } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const sessionSchema = new Schema<ISession>({
    courseId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.COURSE },
    instructorId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.USER },
    title: { type: String, required: true, trim: true },
    videos: [{ type: Schema.Types.Mixed }],
    pdfs: [{ type: Schema.Types.Mixed }],
}, {
    timestamps: true,
    versionKey: false,
})