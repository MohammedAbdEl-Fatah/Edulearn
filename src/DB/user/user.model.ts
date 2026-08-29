import { model } from "mongoose";
import { userSchema } from "./user.schema";
import { IUser } from "../../utils/interface";
import { ConstentModel } from "../constent";

export const userModel = model<IUser>(ConstentModel.USER, userSchema);