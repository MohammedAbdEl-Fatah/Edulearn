

import { model } from "mongoose";
import { courseSchema } from "./course.schema";
import { ICourse } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const courseModel = model<ICourse>(ConstentModel.COURSE, courseSchema);