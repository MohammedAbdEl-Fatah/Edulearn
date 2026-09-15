import { Schema } from "mongoose";
import { IVideo } from "../../utils/interface";

export const videoSchema = new Schema<IVideo>({
    sessionId: { type: Schema.Types.ObjectId, required: true },
    instructorId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, required: true },
    format: { type: String, required: true },
    size: { type: String, required: true },
    duration: { type: Number, required: true },
}, {
    timestamps: true,
    versionKey: false,
})