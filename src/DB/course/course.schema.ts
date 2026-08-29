import { Schema } from "mongoose";
import { ICourse } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const courseSchema = new Schema<ICourse>({
    instructorId: { type: Schema.Types.ObjectId, required: true, ref: ConstentModel.USER },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, trim: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: ConstentModel.REVIEW }],
    sessions: [{ type: Schema.Types.ObjectId, ref: ConstentModel.SESSION }],

}, {
    timestamps: true,
    versionKey: false,
});