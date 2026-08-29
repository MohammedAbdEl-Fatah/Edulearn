import { Schema } from "mongoose";
import { IVideo } from "../../utils/interface";

export const videoSchema = new Schema<IVideo>({
    sessionId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, required: true },
}, {
    timestamps: true,
    versionKey: false,
})