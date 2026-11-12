import { Schema } from "mongoose";
import { IEnrollment } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const enrollmentSchema = new Schema<IEnrollment>({
    studentId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.USER },
    courseId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.COURSE },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: ConstentModel.VIDEO }],
    progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, required: true, default: false }
}, {
    timestamps: true,
    versionKey: false,
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

