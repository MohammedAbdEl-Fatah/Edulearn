import { model } from "mongoose";
import { enrollmentSchema } from "./enrollment.schema";
import { IEnrollment } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const enrollmentModel = model<IEnrollment>(ConstentModel.ENROLLMENT, enrollmentSchema);

