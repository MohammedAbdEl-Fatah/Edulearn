import { model } from "mongoose";
import { reviewSchema } from "./review.schema";
import { ConstentModel } from "../constent";

export const reviewModel = model(ConstentModel.REVIEW, reviewSchema);