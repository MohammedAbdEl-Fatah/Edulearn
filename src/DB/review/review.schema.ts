import { Schema } from "mongoose";
import { IReview } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const reviewSchema = new Schema<IReview>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.USER },
    courseId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.COURSE },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true })