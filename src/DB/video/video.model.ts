import { model } from "mongoose";
import { videoSchema } from "./video.schema";
import { ConstentModel } from "../constent";

export const videoModel = model(ConstentModel.VIDEO, videoSchema);